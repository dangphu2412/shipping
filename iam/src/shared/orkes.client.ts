import { Module } from '@nestjs/common';
import { orkesConductorClient } from '@io-orkes/conductor-javascript';

export const ORKES_CLIENT = Symbol('ORKES_CLIENT');

@Module({
  providers: [
    {
      provide: ORKES_CLIENT,
      useFactory: () => {
        return orkesConductorClient({
          refreshTokenInterval: 0, // optional (in milliseconds) | defaults to 30 minutes | 0 = no refresh
          serverUrl: 'http://localhost:8081/api',
        });
      },
    },
  ],
})
export class OrkesModule {}
