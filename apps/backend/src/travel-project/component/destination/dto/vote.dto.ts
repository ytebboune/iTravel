import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class VoteDto {
  @ApiProperty({ description: 'Vote value (true for upvote, false for downvote)' })
  @IsBoolean()
  vote: boolean;

  @ApiProperty({ required: false, description: 'Optional comment with the vote', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
} 