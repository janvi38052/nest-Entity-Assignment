import { IsDate, IsNumber,IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsDate()
  bookingDate: Date;

  @IsNumber()
  userId: number;

  @IsNumber()
  trainId: number;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsDate()
  bookingDate?: Date;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  trainId?: number;
}
