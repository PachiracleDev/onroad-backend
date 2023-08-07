import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TokenInterface } from 'apps/auth/src/interfaces/token.interface';
import { catchError, Observable, of, switchMap } from 'rxjs';
declare module 'express' {
  export interface Request {
    user: TokenInterface;
  }
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'http') {
      return false;
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) return false;

    const authHeaderParts = (authHeader as string).split(' ');

    if (authHeaderParts.length !== 2) return false;

    const [, jwt] = authHeaderParts;

    return this.authService.send({ cmd: 'verify-jwt' }, { jwt }).pipe(
      switchMap((result) => {
        if (!result.exp) return of(false);

        const TOKEN_EXP_MS = result.exp * 1000;

        const isJwtValid = Date.now() < TOKEN_EXP_MS;
        context.switchToHttp().getRequest().user = result;

        return of(isJwtValid);
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }
}
