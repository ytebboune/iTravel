import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({
    description: 'Contenu de la story',
    example: 'Ma super story !',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'URL de la photo',
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  @IsNotEmpty()
  photo: string;
} 