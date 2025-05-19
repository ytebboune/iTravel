import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUrl, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccommodationType } from '@itravel/shared';

export class CreateAccommodationDto {
  @ApiProperty({ description: 'Nom de l\'hébergement', example: 'Hôtel du Lac' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description de l\'hébergement', example: 'Un bel hôtel au bord du lac' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Lien vers le site de l\'hébergement', example: 'https://example.com/hotel' })
  @IsUrl()
  @IsOptional()
  link?: string;

  @ApiProperty({ description: 'Prix par nuit', example: 150 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'URL de l\'image principale', example: 'https://example.com/hotel.jpg' })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ description: 'Adresse de l\'hébergement', example: '123 rue du Lac, 75000 Paris' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Type d\'hébergement', enum: AccommodationType, example: AccommodationType.HOTEL })
  @IsEnum(AccommodationType)
  @IsOptional()
  type?: AccommodationType;
} 