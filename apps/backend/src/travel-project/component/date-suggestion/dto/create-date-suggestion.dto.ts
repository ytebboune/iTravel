import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDateSuggestionDto {
  @ApiProperty({
    description: 'Start date of the travel period',
    example: '2024-06-01T00:00:00.000Z',
    type: Date
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the travel period',
    example: '2024-06-15T00:00:00.000Z',
    type: Date
  })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate: Date;
} 