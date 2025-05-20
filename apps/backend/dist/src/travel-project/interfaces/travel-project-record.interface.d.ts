import { TravelProjectStatus } from "../enums/travel-project-status.enum";
export interface TravelProjectRecord {
    id: string;
    title: string;
    description: string | null;
    creator_id: string;
    status: TravelProjectStatus;
    selected_destination: string | null;
    selected_date: {
        start_date: string;
        end_date: string;
    } | null;
    created_at: string;
    updated_at: string;
}
