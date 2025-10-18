import { Module } from '@nestjs/common';
import { MailController } from './presentation/mail.controller';

@Module({
  controllers: [MailController],
})
export class MailModule {}
