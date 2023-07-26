import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(ROLES_KEY, context.getHandler()) as
      | string[]
      | undefined;
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    const isAuth = roles.some((role) => user.role.includes(role));

    if (!isAuth) {
      throw new UnauthorizedException(
        'No tienes permisios para realizar esta acción',
      );
    }

    return true;
  }
}
