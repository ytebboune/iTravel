import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrivacyDto {
  @ApiProperty({
    description: 'Profil privé',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;

  @ApiProperty({
    description: 'Afficher l\'email',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showEmail?: boolean;

  @ApiProperty({
    description: 'Afficher les lieux visités',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showVisitedPlaces?: boolean;

  @ApiProperty({
    description: 'Afficher les posts',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showPosts?: boolean;

  @ApiProperty({
    description: 'Afficher les stories',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  showStories?: boolean;
} 