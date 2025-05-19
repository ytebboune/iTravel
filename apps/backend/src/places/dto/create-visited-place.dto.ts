import { IsString, IsNumber, IsOptional, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVisitedPlaceDto {
  @IsString()
  cityId: string;

  @IsNumber()
  @IsOptional()
  rating?: number;

  @IsString()
  @IsOptional()
  review?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  visitedAt?: Date;
} 