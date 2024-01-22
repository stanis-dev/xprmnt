import { SetMetadata } from '@nestjs/common';
import { User } from 'src/users/users.service';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: User['role'][]) =>
  SetMetadata(ROLES_KEY, roles);
