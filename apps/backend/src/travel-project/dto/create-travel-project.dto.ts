import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTravelProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}