import { IsString, MaxLength } from 'class-validator';

export class AccommodationCommentDto {
  @IsString()
  @MaxLength(1000)
  comment: string;
} 