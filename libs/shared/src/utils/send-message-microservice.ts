import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

export const sendMicroserviceMessage = (
  service: ClientProxy,
  cmd: string,
  data: any,
) => {
  //Tambien se pudo haber manejado los errores de RabbitMQ con un ExceptionFilter, pero queria probar esta forma :P
  return service.send({ cmd }, data).pipe(catchError((err) => of(err)));
};
