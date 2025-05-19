import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStoryDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  mediaUrl: string;
} 