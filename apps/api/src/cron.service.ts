import { Cron, CronExpression } from '@nestjs/schedule';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { sendMicroserviceMessage } from '@app/shared/utils/send-message-microservice';
import { firstValueFrom } from 'rxjs';
import { EmailsService } from '@app/shared/services/emails.service';

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name);

  constructor(
    @Inject('RESERVATIONS_SERVICE')
    private readonly reservationService: ClientProxy,
    private readonly emailService: EmailsService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async hanleReservationsComingSoon() {
    const obs = sendMicroserviceMessage(
      this.reservationService,
      'missingOneDayToDeparture',
      {},
    );

    const rta = await firstValueFrom(obs).catch((err) => console.log(err));

    this.logger.debug('[CronService] hanleReservationsComingSoon');

    if (rta.length > 0) {
      for (const reservation of rta) {
        this.emailService.sendReservationReminder(
          reservation.email,
          reservation.itinerary.openingTime,
        );
      }
    }
  }
}
