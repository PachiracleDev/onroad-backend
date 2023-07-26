import { RmqContext, RmqOptions } from '@nestjs/microservices';

export interface SharedServiceInterface {
  getRmqOptions(queueName: string): RmqOptions;
  acknowledgeMessage(ctx: RmqContext): void;
}
