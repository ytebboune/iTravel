import { IsString, IsArray, IsOptional, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(1, 1000)
  content: string;

  @IsArray()
  @IsOptional()
  photos?: string[];
} 