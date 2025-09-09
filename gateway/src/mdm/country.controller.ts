import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  COUNTRY_SERVICE_NAME,
  CountryServiceClient,
  CountryServiceController,
  CountryServiceControllerMethods,
  SearchCountry,
} from '@dnp2412/shipping-protos/dist/proto/mdm/country/v1/country';

@CountryServiceControllerMethods()
@Controller('/countries')
export class CountryController
  implements OnModuleInit, CountryServiceController
{
  private countryServiceClient: CountryServiceClient;

  constructor(@Inject('MDM') private client: ClientGrpc) {}

  onModuleInit() {
    this.countryServiceClient =
      this.client.getService<CountryServiceClient>(COUNTRY_SERVICE_NAME);
  }
  @Get()
  search(@Query() query: SearchCountry) {
    return this.countryServiceClient.search(query);
  }
}
