import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../../../config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { SharedServiceInterface } from '../interfaces/services/shared.service.interface';

@Injectable()
export class SharedService implements SharedServiceInterface {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  getRmqOptions(queueName: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.rabbitmq.uri],
        noAck: false,
        queue: queueName,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(ctx: RmqContext) {
    const channel = ctx.getChannelRef();
    const msg = ctx.getMessage();
    channel.ack(msg); // Buena practica: Siempre que se recibe un mensaje, se debe de mandar un ack para que el mensaje se elimine de la cola de RabbitMQ. (Esto es para avisar que se proceso el mensaje correctamente)
  }
}
