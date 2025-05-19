import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({
    description: 'Title of the activity',
    example: 'Visit the Eiffel Tower'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the activity',
    example: 'Visit the iconic Eiffel Tower and enjoy the view from the top'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'URL of the activity image',
    required: false,
    nullable: true,
    example: 'https://example.com/eiffel-tower.jpg'
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Whether the activity was suggested by AI',
    required: false,
    nullable: true,
    default: false
  })
  @IsBoolean()
  @IsOptional()
  suggestedByAI?: boolean;
} 