import { IsString, IsOptional, IsArray, ArrayNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class CreateTrainDto {
  @IsString()
  trainName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  bookingIds: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  stationIds: number[];

  @IsString()
  trainNumber: string;
}

export class UpdateTrainDto {
  @IsOptional()
  @IsString()
  trainName?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  bookingIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  stationIds?: number[];

  @IsOptional()
  @IsString()
  trainNumber?: string;
}
