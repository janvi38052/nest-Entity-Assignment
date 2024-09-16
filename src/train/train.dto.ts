import { IsString ,IsOptional} from 'class-validator';

export class CreateTrainDto {
  @IsString()
  trainName: string;

  @IsString()
  trainNumber: string;
}

export class UpdateTrainDto {
  @IsOptional()
  @IsString()
  trainName?: string;

  @IsOptional()
  @IsString()
  trainNumber?: string;
}
