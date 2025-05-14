import { IsNotEmpty, IsDateString } from 'class-validator';

export class AddDateDto {
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}