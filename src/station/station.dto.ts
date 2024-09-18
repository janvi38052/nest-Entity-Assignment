import { IsString , IsOptional } from 'class-validator';

export class CreateStationDto {
  @IsString()
  stationName: string;
  trainIds? : number [];
}

export class UpdateStationDto {
  @IsOptional()
  @IsString()
  stationName?: string;
  trainIds : number[];
}
