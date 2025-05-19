import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum } from 'class-validator';
import { TransportType } from '@itravel/shared';

export class CreateTransportOptionDto {
  @ApiProperty({ enum: TransportType })
  @IsEnum(TransportType)
  type: TransportType;

  @ApiProperty()
  @IsString()
  departure: string;

  @ApiProperty()
  @IsString()
  arrival: string;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  duration?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  flightNumber?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  baggageIncluded?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  nbStops?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  seatInfo?: string;
}