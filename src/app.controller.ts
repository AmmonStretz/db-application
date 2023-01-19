import { Controller, Get, Param } from '@nestjs/common';
import { StationService } from './station.service';
import { DistanceDTO } from './dtos/distance.dto';

@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: StationService) {}

  @Get('distance/:from/:to')
  async getDistance(
    @Param('from') from: string,
    @Param('to') to: string,
  ): Promise<DistanceDTO> {
    return await this.appService.getDistance(from, to);
  }
}
