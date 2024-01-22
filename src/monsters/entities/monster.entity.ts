import mongoose, { Schema } from 'mongoose';
// tooltip will say it can be converted to a default import, but that's a lie
import * as zxcvbn from 'zxcvbn';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

const ENCRYPTION_ALG: crypto.CipherCCMTypes = 'aes-256-ccm';
const IV: crypto.BinaryLike = crypto.randomBytes(12);

//TODO: move to config
const ENCRYPTION_SECRET_KEY = process.env.CRYPTO_SECRET_KEY!;

export const MONSTER_GENDERS = ['female', 'male', 'other'] as const;
export const MONSTER_NATIONALITIES = ['Other', 'US', 'UK', 'SP', 'DE'] as const;
export const MONSTER_TITLES = [
  'Mr.',
  'Mrs.',
  'Miss',
  'Dr.',
  'That weird thingy',
] as const;
export type MonsterTitle = (typeof MONSTER_TITLES)[number];

export type MonsterName = {
  first: string;
  last: string;
  title: MonsterTitle;
};

export type MonsterGender = (typeof MONSTER_GENDERS)[number];
export type MonsterNationality = (typeof MONSTER_NATIONALITIES)[number];

export type MonsterProperties = {
  name: MonsterName;
  gender: MonsterGender;
  description?: string;
  nationality: MonsterNationality[];
  image: string;
  goldBalance?: number;
  speed?: number;
  health?: number;
  secretNotes?: string;
  monsterPassword: string;
};

export type MonsterMethods = {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  decryptSecretNotes: () => Promise<string>;
};

export type MonsterDocument = mongoose.Document &
  MonsterProperties &
  MonsterMethods;

export const MonsterSchema = new Schema<MonsterDocument>({
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      enum: MONSTER_TITLES,
    },
  },
  gender: {
    type: String,
    required: true,
    enum: MONSTER_GENDERS,
  },
  description: String,
  nationality: {
    type: [MONSTER_NATIONALITIES],
    default: [MONSTER_NATIONALITIES[0]],
  },
  image: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v: string) => {
        // TODO in perfect world, add proper url validation: protocol, whitelisted domains, etc.
        return /^https?:\/\//i.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    maxlength: [512, 'image url is too long'],
  },
  goldBalance: {
    type: Number,
    default: 0,
    min: [0, 'gold balance cannot be negative'],
  },
  speed: {
    type: Number,
    default: 100,
  },
  health: {
    type: Number,
    default: 100,
  },
  secretNotes: {
    type: String,
    default: '',
  },
  monsterPassword: {
    type: String,
    required: true,
    trim: true,
    select: false,
    validate: {
      validator: (v: string) => {
        const { score } = zxcvbn(v);
        return score > 3;
      },
      // ideally, the specific tips and initial check would be done on the client side through ui
      // this is just a fallback. But if needed, zxcvb suggestions could be made human readable
      // and displayed to the user. best to avoid, though. Because localization 🙃
      message: (props) => `${props.value} is not a strong password!`,
    },
  },
});

function encryptSecretNotes(secretNotes: string) {
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALG,
    ENCRYPTION_SECRET_KEY,
    IV,
    { authTagLength: 16 },
  );

  let encrypted = cipher.update(secretNotes, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  return encrypted + authTag;
}

MonsterSchema.methods.decryptSecretNotes = async function () {
  const authTagLength = 16 * 2; // 16 bytes in hex
  const encrypted = this.secretNotes.slice(0, -authTagLength);
  const authTag = this.secretNotes.slice(-authTagLength);

  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALG,
    ENCRYPTION_SECRET_KEY,
    IV,
    { authTagLength: 16 },
  );

  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

MonsterSchema.pre('save', async function (next) {
  if (this.secretNotes && this.isModified('secretNotes')) {
    this.secretNotes = encryptSecretNotes(this.secretNotes);
  }

  if (this.isModified('monsterPassword')) {
    this.monsterPassword = await hashPassword(this.monsterPassword);
  }

  return next();
});

MonsterSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.monsterPassword);
};

const Monster = mongoose.model('Monster', MonsterSchema);

export default Monster;
