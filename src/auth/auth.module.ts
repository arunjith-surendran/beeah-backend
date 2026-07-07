import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { SalesforceModule } from '../salesforce/salesforce.module';
import { AuthService } from './service/auth.service';
import { AuthRepository } from './repository/auth.repository';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    SalesforceModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
