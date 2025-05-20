import { AccommodationType } from '@itravel/shared';
export declare class FilterAccommodationDto {
    priceMin?: number;
    priceMax?: number;
    type?: AccommodationType;
    sortBy?: 'price' | 'votes' | 'score';
}
