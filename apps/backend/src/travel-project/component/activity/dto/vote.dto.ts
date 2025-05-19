import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VoteDto {
  @ApiProperty({
    description: 'Vote value (true for upvote, false for downvote)',
    example: true
  })
  @IsBoolean()
  vote: boolean;

  @ApiProperty({
    description: 'Optional comment with the vote',
    required: false,
    maxLength: 500,
    example: 'This activity looks interesting!'
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  comment?: string;
} 