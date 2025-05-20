import { TransportType } from '@itravel/shared';
export declare class CreateTransportOptionDto {
    type: TransportType;
    departure: string;
    arrival: string;
    date: string;
    duration?: string;
    price?: number;
    link?: string;
    company?: string;
    flightNumber?: string;
    baggageIncluded?: boolean;
    nbStops?: number;
    seatInfo?: string;
}
