import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class TransportVoteDto {
  @IsString() transportId: string;
  @IsBoolean() vote: boolean;
  @IsOptional() @IsString() comment?: string;
}