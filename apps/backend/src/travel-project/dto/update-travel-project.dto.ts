import { IsOptional, IsString, IsEnum, IsArray, IsUUID } from 'class-validator';
import { ProjectStatus } from '@itravel/shared';

export class UpdateTravelProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  participants?: string[];

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsUUID()
  creatorId?: string;

  @IsOptional()
  @IsString()
  createdAt?: string;
}