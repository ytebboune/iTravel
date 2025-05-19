import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreatePlanningDto {
  @ApiProperty({ description: 'Nom du planning', example: 'Planning de mon voyage' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Description du planning', example: 'Planning pour mon voyage à Paris' })
  @IsString()
  @IsOptional()
  description?: string;
} 