import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class AccommodationVoteDto {
  @IsBoolean()
  vote: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
} 