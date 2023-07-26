import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { SharedService } from '../services/shared.service';
import config from '../../../../config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [config],
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigType<typeof config>) => {
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [configService.rabbitmq.uri],
              queue: queue,
              queueOptions: {
                durable: true, // Esto es para que no se pierdan los mensajes si se cae el servidor
              },
            },
          });
        },
        inject: [config.KEY],
      },
    ];

    return {
      module: SharedModule,
      providers,
      exports: providers,
    };
  }
}
