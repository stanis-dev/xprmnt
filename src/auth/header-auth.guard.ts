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
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const username = request.headers.authorization as
      | User['username']
      | undefined;
    if (!username) {
      throw new UnauthorizedException();
    }

    // here we are all going to use some good'ol imagination
    // and assume that the authHeader is a JWT token and we verified it successfully
    // getting user's data from the payload
    const user = this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    request.user = user;

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
