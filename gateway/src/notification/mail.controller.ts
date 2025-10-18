import { Body, Controller, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  MAIL_SERVICE_NAME,
  MailBody,
  MailServiceClient,
} from '@dnp2412/shipping-protos/dist/proto/notification/mail/v1/mail';

@Controller('/notifications/mails')
export class MailController implements OnModuleInit {
  private mailServiceClient: MailServiceClient;

  constructor(
    @Inject('NOTIFICATION')
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.mailServiceClient =
      this.client.getService<MailServiceClient>(MAIL_SERVICE_NAME);
  }
  @Post()
  send(@Body() body: MailBody) {
    return this.mailServiceClient.send(body);
  }
}
