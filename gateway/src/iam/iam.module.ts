import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { RegistrationController } from './registration.controller';

@Module({
  controllers: [RegistrationController],
  imports: [
    ClientsModule.register([
      {
        name: 'IAM_REGISTRATION',
        transport: Transport.GRPC,
        options: {
          port: 5000,
          package: 'proto.iam.registration.v1',
          protoPath: 'proto/iam/registration/v1/user_registration.proto',
          loader: {
            includeDirs: [
              join(process.cwd(), 'node_modules/@dnp2412/shipping-protos'),
            ],
            arrays: true,
            objects: true,
          },
        },
      },
    ]),
  ],
})
export class IamModule {}
