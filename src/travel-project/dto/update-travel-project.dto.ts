import { IsOptional, IsString, IsEnum, IsArray, IsUUID } from 'class-validator';
import { TravelProjectStatus } from '../enums/travel-project-status.enum';

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
  @IsEnum(TravelProjectStatus)
  status?: TravelProjectStatus;

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