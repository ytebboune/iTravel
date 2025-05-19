import { IsEnum, IsOptional } from 'class-validator';

export enum SortField {
  SCORE = 'score',
  PRICE = 'price',
  DURATION = 'duration',
  DATE = 'date'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

export class SortTransportDto {
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField;

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
} 