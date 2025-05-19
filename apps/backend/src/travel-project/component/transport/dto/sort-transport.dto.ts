import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SortField, SortOrder } from '@itravel/shared';

export class SortTransportDto {
  @ApiProperty({ enum: SortField, required: false, description: 'Field to sort by' })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField;

  @ApiProperty({ enum: SortOrder, required: false, description: 'Sort order (ASC or DESC)', default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}

export { SortField, SortOrder }; 