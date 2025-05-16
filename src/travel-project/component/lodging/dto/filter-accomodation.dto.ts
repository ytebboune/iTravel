// filter-accommodation.dto.ts
import { IsOptional, IsNumber, Min, Max, IsString, IsEnum } from 'class-validator';
import { AccommodationType } from '@prisma/client';

export class FilterAccommodationDto {
  @IsOptional() @Min(0) priceMin?: number;
  @IsOptional() @Max(99999) priceMax?: number;
  @IsOptional() @IsString() sortBy?: 'price' | 'votes' | 'score';
  @IsOptional()
@IsEnum(AccommodationType)
type?: AccommodationType;
}