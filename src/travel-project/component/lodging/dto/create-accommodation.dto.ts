import { IsString, IsUrl, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import { AccommodationType } from '@prisma/client';

export class CreateAccommodationDto {
  @IsString() name: string;
  @IsString() address: string;
  @IsNumber() @Min(0) price: number;
  @IsOptional() @IsUrl() link?: string;
  @IsOptional()
  @IsEnum(AccommodationType)
  type?: AccommodationType;
}