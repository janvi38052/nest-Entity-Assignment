import { IsString, IsEmail, IsOptional, IsArray, ArrayNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  bookingIds:number[];

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  bookingIds?:number[];

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
