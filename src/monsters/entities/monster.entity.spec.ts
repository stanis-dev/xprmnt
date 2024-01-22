import Monster, {
  MONSTER_GENDERS,
  MONSTER_NATIONALITIES,
  MONSTER_TITLES,
  MonsterProperties,
} from './monster.entity';
import { faker } from '@faker-js/faker';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const generateRandomMonster = (): MonsterProperties => ({
  name: {
    first: faker.person.firstName(),
    last: faker.person.lastName(),
    title: faker.helpers.arrayElement(MONSTER_TITLES),
  },
  gender: faker.helpers.arrayElement(MONSTER_GENDERS),
  description: faker.lorem.paragraph(),
  nationality: faker.helpers.arrayElements(MONSTER_NATIONALITIES, 2),
  image: faker.image.url(),
  goldBalance: faker.number.int(),
  speed: faker.number.float(),
  health: faker.number.float(),
  secretNotes: faker.lorem.paragraph(),
  monsterPassword: faker.internet.password({ length: 20 }),
});

describe('Monster', () => {
  let mongoServer: MongoMemoryServer;
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
  });

  it('should initiate correctly if all data is valid', async () => {
    const monsterData = generateRandomMonster();
    const monster = new Monster(monsterData);

    expect(monster).toBeDefined();

    expect(monster.validate()).resolves;
  });

  it('should throw an error on validation fail', async () => {
    const monsterData1 = generateRandomMonster();
    // @ts-expect-error not assignable
    monsterData1.name.title = 'Sire';
    const monster = new Monster(monsterData1);
    expect(monster).toBeDefined();
    await expect(monster.validate()).rejects.toThrow();

    const monsterData2 = generateRandomMonster();
    monsterData2.name.first = '';
    const monster2 = new Monster(monsterData2);
    expect(monster2).toBeDefined();
    await expect(monster2.validate()).rejects.toThrow();

    const monsterData3 = generateRandomMonster();
    monsterData3.image = '';
    const monster3 = new Monster(monsterData3);
    expect(monster3).toBeDefined();
    await expect(monster3.validate()).rejects.toThrow();

    const monsterData4 = generateRandomMonster();
    monsterData4.monsterPassword = '';
    const monster4 = new Monster(monsterData4);
    expect(monster4).toBeDefined();
    await expect(monster4.validate()).rejects.toThrow();

    const monsterData5 = generateRandomMonster();
    monsterData5.monsterPassword = faker.internet.password({
      length: 10,
      memorable: true,
    });
    const monster5 = new Monster(monsterData5);
    expect(monster5).toBeDefined();
    await expect(monster5.validate()).rejects.toThrow();

    // I'm sure you get the idea :)
  });

  it('encrypts and decrypts secret notes correctly', async () => {
    const monsterData = generateRandomMonster();
    const secretNotes = monsterData.secretNotes;

    const monster = new Monster(monsterData);
    await monster.save();

    monster.decryptSecretNotes();
    expect(monster.secretNotes).toEqual(secretNotes);
  });

  it('hashes and compares passwords correctly', async () => {
    const monsterData = generateRandomMonster();
    const monster = new Monster(monsterData);
    await monster.save();

    const password = monsterData.monsterPassword;
    const isMatch = await monster.comparePassword(password);
    expect(isMatch).toBe(true);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });
});
