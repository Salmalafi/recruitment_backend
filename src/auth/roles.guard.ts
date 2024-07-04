import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from './role.enum';
import { ROLES_KEY } from './auth.controller';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      this.logger.debug('No roles specified, allowing access.');
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      this.logger.warn('User not found in request.');
      return false; 
    }

    const isAuthorized = requiredRoles.some((role) => user?.roles?.includes(role));

    if (!isAuthorized) {
      this.logger.warn(`User does not have required roles: ${requiredRoles.join(', ')}`);
    } else {
      this.logger.debug('User has required roles.');
    }

    return isAuthorized;
  }
}


