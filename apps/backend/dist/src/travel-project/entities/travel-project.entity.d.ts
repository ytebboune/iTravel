import { TravelProject as TravelProjectModel, ProjectUser as ProjectUserModel, Destination as DestinationModel, DateSuggestion as DateSuggestionModel, Activity as ActivityModel } from '@prisma/client';
export type TravelProjectEntity = TravelProjectModel & {
    participants: ProjectUserModel[];
    destinations: DestinationModel[];
    dateSuggestions: DateSuggestionModel[];
    activities: ActivityModel[];
};
