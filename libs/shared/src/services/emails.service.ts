import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import config from '../../../../config';
import { ConfigType } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
@Injectable()
export class EmailsService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {
    sgMail.setApiKey(this.configService.sendgrid.apiKey);
  }

  async sendReservationReminder(to: string, openingTime: string) {
    try {
      await sgMail.send({
        to,
        from: this.configService.sendgrid.from, //Aqui el correo empresarial de ONROAD
        templateId: this.configService.sendgrid.templates.reservationReminder, // Aqui podemos el templateId que se crea en tu panel de sendgrid
        dynamicTemplateData: {
          openingTime, // Insertamos esta variable en nuestro template que creamos en sendgrid para hacerlo dinámico
        },
      });
      return true;
    } catch (error) {
      throw new NotFoundException('Error al enviar el correo');
    }
  }
}
