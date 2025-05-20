import { AccommodationType } from '@itravel/shared';
export declare class CreateAccommodationDto {
    name: string;
    description: string;
    link?: string;
    price?: number;
    imageUrl?: string;
    address?: string;
    type?: AccommodationType;
}
