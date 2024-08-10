import {
  CanActivate,
  ExecutionContext,
  Headers,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { JwtTokenPayload } from '../models/auth.model';
import { ROLES_KEY } from './auth.decorator';
import { UserResponse } from '../models/user.model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers);
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload: JwtTokenPayload = await this.jwtService.verifyAsync(
        token,
        { secret: process.env.JWT_SECRET },
      );
      const user: UserResponse = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      });
      request['user'] = user;
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles.length) {
      return true;
    }

    const isAuthorized = requiredRoles.some(
      (role) => request.user?.role === role,
    );
    if (!isAuthorized) {
      throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
    }

    return true;
  }

  private extractTokenFromHeader(
    @Headers() headers: Record<string, any>,
  ): string | undefined {
    const [type, token] = headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
