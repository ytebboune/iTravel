import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddDestinationDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  suggestedByAI?: boolean;  // pour les suggestions IA
}
