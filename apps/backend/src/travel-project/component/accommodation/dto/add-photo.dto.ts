import { IsUrl, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddPhotoDto {
  @ApiProperty({ description: 'URL de la photo', example: 'https://example.com/photo.jpg' })
  @IsUrl()
  @IsNotEmpty()
  url: string;
} 