import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, Validate } from 'class-validator';
import { IsEndDateAfterStartDate } from '../validators/date-validator';

export class AddActivityToPlanningDto {
  @ApiProperty({ description: 'ID de l\'activité', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsOptional()
  activityId?: string;

  @ApiProperty({ description: 'Date de l\'activité', example: '2024-03-20' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Heure de début', example: '2024-03-20T10:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'Heure de fin', example: '2024-03-20T12:00:00Z' })
  @IsDateString()
  @Validate(IsEndDateAfterStartDate, ['startTime'])
  endTime: string;

  @ApiProperty({ description: 'Notes sur l\'activité', example: 'N\'oubliez pas d\'apporter votre appareil photo' })
  @IsString()
  @IsOptional()
  notes?: string;
} 