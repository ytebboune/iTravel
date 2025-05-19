import { IsString, MinLength } from 'class-validator';
export default class AddCommentLodgingDto {
  @IsString() accommodationId: string;
  @IsString() @MinLength(1) content: string;
}