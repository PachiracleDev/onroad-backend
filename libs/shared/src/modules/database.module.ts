import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../../../config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => ({
        type: 'postgres',
        url: configService.db.uri,
        autoLoadEntities: true,
        synchronize: true, // Esto de desactiva en producción para no perder datos
      }),
      inject: [config.KEY],
    }),
  ],
})
export class DatabaseModule {}
