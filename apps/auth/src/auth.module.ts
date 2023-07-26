import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { SharedModule } from '@app/shared/modules/shared.module';
import { UserRepository } from '@app/shared/respositories/user.repository';
import { DatabaseModule } from '@app/shared/modules/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedService } from '@app/shared/services/shared.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import config from '../../../config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGuard } from './guards/jwt.guard';
import { ALL_ENTITIES } from '@app/shared/entities';

@Module({
  imports: [
    SharedModule,

    JwtModule.registerAsync({
      useFactory: (configService: ConfigType<typeof config>) => ({
        secret: configService.auth.access,
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [config.KEY],
    }),
    DatabaseModule,
    TypeOrmModule.forFeature(ALL_ENTITIES),
  ],
  controllers: [AuthController],
  providers: [
    JwtGuard,
    JwtStrategy,

    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
