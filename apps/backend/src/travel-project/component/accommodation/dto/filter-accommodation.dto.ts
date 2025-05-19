import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccommodationType } from '@itravel/shared';

export class FilterAccommodationDto {
  @ApiProperty({ description: 'Prix minimum', required: false, example: 50 })
  @IsNumber()
  @IsOptional()
  priceMin?: number;

  @ApiProperty({ description: 'Prix maximum', required: false, example: 200 })
  @IsNumber()
  @IsOptional()
  priceMax?: number;

  @ApiProperty({ description: 'Type d\'hébergement', enum: AccommodationType, required: false, example: AccommodationType.HOTEL })
  @IsEnum(AccommodationType)
  @IsOptional()
  type?: AccommodationType;

  @ApiProperty({ description: 'Critère de tri (price, votes, score)', required: false, example: 'price' })
  @IsEnum(['price', 'votes', 'score'])
  @IsOptional()
  sortBy?: 'price' | 'votes' | 'score';
} 