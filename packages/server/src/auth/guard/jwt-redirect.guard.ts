import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class JWTRedirectGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const { headers } = context.switchToHttp().getRequest();
    // if user is active dont allow to signup or signin
    if (headers?.authorization) return false;
    return true;
  }
}
