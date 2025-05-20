import { TravelProject, ProjectUser, Destination, DateSuggestion, Activity, Accommodation } from '@prisma/client';
export type TravelProjectWithRelations = TravelProject & {
    participants: ProjectUser[];
    destinations: Destination[];
    dateSuggestions: DateSuggestion[];
    activities: Activity[];
    accommodations: Accommodation[];
};
export type TravelProjectWithBasicRelations = TravelProject & {
    participants: ProjectUser[];
    accommodations: Accommodation[];
};
