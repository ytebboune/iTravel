import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
  @ApiProperty({ description: 'Contenu du commentaire', example: 'Très bel hôtel avec une vue imprenable !' })
  @IsString()
  @IsNotEmpty()
  content: string;
} 