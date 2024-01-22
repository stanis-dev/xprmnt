import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';
import { User, UsersService } from 'src/users/users.service';

@Injectable()
export default class HeaderAuthGuard extends AuthGuard('header') {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const username = request.headers.authorization as
      | User['username']
      | undefined;

    if (username) {
      // here we are all going to use some good'ol imagination
      // and assume that the username is actually a JWT token and we verified it successfully
      // getting user's data from the payload
      request.user = this.usersService.findOne(username);
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    if (!username) {
      throw new UnauthorizedException();
    }

    if (!request.user) {
      throw new UnauthorizedException();
    }

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRoles) {
      const user = request.user as User;
      if (!requiredRoles.includes(user.role)) {
        throw new UnauthorizedException();
      }
    }

    return super.canActivate(context);
  }
}
