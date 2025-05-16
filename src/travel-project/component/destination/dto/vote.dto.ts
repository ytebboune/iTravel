import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class VoteDto {
  @IsBoolean()
  vote: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
} 