export interface TravelProjectActivityRecord {
    id: string;
    project_id: string;
    title: string;
    description: string;
    image_url: string | null;
    added_by: string;
    suggested_by_ai: boolean;
    created_at: string;
    updated_at: string;
}
