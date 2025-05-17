import { IsString, IsArray, IsOptional, Length } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @Length(1, 1000)
  @IsOptional()
  content?: string;

  @IsArray()
  @IsOptional()
  photos?: string[];
} 