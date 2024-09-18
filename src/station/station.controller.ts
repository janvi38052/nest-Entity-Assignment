import { Controller, Post, Get, Param, Body, Put, Delete } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto, UpdateStationDto } from './station.dto';
import { Station } from './station.entity';

@Controller('stations')
export class StationController {
  constructor(private readonly stationService: StationService) {}

  @Post()
  async create(@Body() createStationDto: CreateStationDto): Promise<Station> {
    return this.stationService.create(createStationDto);
  }

  @Get()
  async findAll(): Promise<Station[]> {
    return this.stationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Station> {
    return this.stationService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateStationDto: UpdateStationDto
  ): Promise<void> {
    await this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.stationService.remove(id);
  }
}
