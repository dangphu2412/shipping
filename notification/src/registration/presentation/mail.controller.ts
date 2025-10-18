import { Controller } from '@nestjs/common';
import {
  MailBody,
  MailServiceController,
  MailServiceControllerMethods,
} from '@dnp2412/shipping-protos/dist/proto/notification/mail/v1/mail';

@MailServiceControllerMethods()
@Controller()
export class MailController implements MailServiceController {
  constructor() {}

  send(mailBody: MailBody) {
    console.log(mailBody)
  }
}
