import { IsDateString, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEndDateAfterStartDate } from '../validators/date-validator';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'Date de début de disponibilité', example: '2024-03-20T00:00:00Z' })
  @IsDateString()
  start: string;

  @ApiProperty({ description: 'Date de fin de disponibilité', example: '2024-03-25T00:00:00Z' })
  @IsDateString()
  @Validate(IsEndDateAfterStartDate, ['start'])
  end: string;
} 