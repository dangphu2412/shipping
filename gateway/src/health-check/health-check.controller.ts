import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  @Get('/readiness')
  readiness() {
    return 'OK';
  }

  @Get('/liveness')
  liveness() {
    return 'OK';
  }
}
