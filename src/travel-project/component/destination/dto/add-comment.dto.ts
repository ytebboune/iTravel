import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddCommentDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;
} 