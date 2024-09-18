import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { TrainService } from './train.service';
import { CreateTrainDto, UpdateTrainDto } from './train.dto';
import { Train } from './train.entity';

@Controller('trains')
export class TrainController {
  constructor(private readonly trainService: TrainService) {}

  @Post()
  async create(@Body() createTrainDto: CreateTrainDto): Promise<Train> {
    return this.trainService.create(createTrainDto);
  }

  @Get()
  async findAll(): Promise<Train[]> {
    return this.trainService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Train> {
    return this.trainService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTrainDto: UpdateTrainDto): Promise<void> {
    await this.trainService.update(id, updateTrainDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.trainService.remove(id);
  }
}
