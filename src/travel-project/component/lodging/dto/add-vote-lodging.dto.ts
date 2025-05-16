import { IsString, IsBoolean, MaxLength, IsOptional } from 'class-validator';
export class AddVoteDto {
  @IsString() accommodationId: string;
  @IsBoolean() vote: boolean;
  @IsOptional() @IsString() @MaxLength(1000) comment?: string;
}