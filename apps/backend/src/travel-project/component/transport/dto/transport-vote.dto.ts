import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TransportVoteDto {
  @ApiProperty({ description: 'Transport option ID' })
  @IsString()
  transportId: string;

  @ApiProperty({ description: 'Vote value (true for upvote, false for downvote)' })
  @IsBoolean()
  vote: boolean;

  @ApiProperty({ required: false, description: 'Optional comment with the vote' })
  @IsOptional()
  @IsString()
  comment?: string;
}