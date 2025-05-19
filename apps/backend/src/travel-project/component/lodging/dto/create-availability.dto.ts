import { IsString, IsDateString } from 'class-validator';
export class CreateAvailabilityDto {
  @IsString() accommodationId: string;
  @IsDateString() start: string;
  @IsDateString() end: string;
}