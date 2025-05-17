import { IsEmail, IsString, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @ApiProperty({ example: '192.168.1.1' })
  @IsString()
  @Matches(/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([a-fA-F0-9:]+:+)+[a-fA-F0-9]+$/, { message: 'Invalid IP address format' })
  ipAddress: string;
} 