import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { CountryController } from './country.controller';

@Module({
  controllers: [CountryController],
  imports: [
    ClientsModule.register([
      {
        name: 'MDM',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:5001',
          package: 'proto.mdm.country.v1',
          protoPath: ['proto/mdm/country/v1/country.proto'],
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
export class MdmModule {}
