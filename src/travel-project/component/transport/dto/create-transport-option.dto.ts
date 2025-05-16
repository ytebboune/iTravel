import { IsEnum, IsString, IsDateString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { TransportType } from '@prisma/client';

export class CreateTransportOptionDto {
  @IsEnum(TransportType)
  type: TransportType;

  @IsString() departure: string;
  @IsString() arrival: string;
  @IsDateString() date: string;

  @IsOptional() @IsString() duration?: string;
  @IsOptional() @IsNumber() price?: number;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsString() company?: string;
  @IsOptional() @IsString() flightNumber?: string;
  @IsOptional() @IsBoolean() baggageIncluded?: boolean;
  @IsOptional() @IsNumber() nbStops?: number;
  @IsOptional() @IsString() seatInfo?: string;
}