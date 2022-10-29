import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SystemRole } from "@prisma/client";
import { ROLES_KEY } from "../../decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const getRequiredRoles = this.reflector.getAllAndOverride<SystemRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!getRequiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    return getRequiredRoles.some(
      (role) => role && user?.role && role === user.role,
    );
  }
}
