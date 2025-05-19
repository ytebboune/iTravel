import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AddTransportCommentDto {
  @ApiProperty({ description: 'Transport option ID' })
  @IsString()
  @IsNotEmpty()
  transportId: string;

  @ApiProperty({ description: 'Comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}