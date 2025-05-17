import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 30)
  @IsOptional()
  username?: string;

  @IsString()
  @Length(0, 500)
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
} 