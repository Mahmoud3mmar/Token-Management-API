import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";



@Injectable()
export class AccessLevelsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required roles from metadata
    const requiredRoles = this.reflector.getAllAndOverride<AccessLevelsGuard[]>('access_levels', [
      context.getHandler(),
      context.getClass()
    ]);

    // If no roles are specified, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user is authenticated
    if (!user) {
      throw new ForbiddenException('No user authenticated');
    }

    // Check if the user has at least one of the required AccessLevels
    const hasAccessLevel = requiredRoles.some(access_level => user.access_level?.includes(access_level));

    // If the user does not have the required role, deny access
    if (!hasAccessLevel) {
      throw new ForbiddenException('You do not have the required AccessLevel');
    }

    return true;
  }
}