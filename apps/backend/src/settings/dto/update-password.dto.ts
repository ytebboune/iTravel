import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({ description: 'Mot de passe actuel', example: 'currentPassword123' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'Nouveau mot de passe', example: 'newPassword123' })
  @IsString()
  @MinLength(8)
  newPassword: string;
} 