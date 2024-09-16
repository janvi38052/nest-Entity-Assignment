import { IsString , IsOptional } from 'class-validator';

export class CreateStationDto {
  @IsString()
  stationName: string;
}

export class UpdateStationDto {
  @IsOptional()
  @IsString()
  stationName?: string;
}
