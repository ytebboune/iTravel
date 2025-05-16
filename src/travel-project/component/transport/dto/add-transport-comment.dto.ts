import { IsString } from 'class-validator';

export class AddTransportCommentDto {
  @IsString() transportId: string;
  @IsString() content: string;
}