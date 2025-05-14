import { IsNotEmpty, IsString, IsOptional, IsUrl, IsBoolean } from 'class-validator';

export class AddActivityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  suggestedByAI?: boolean;
}
