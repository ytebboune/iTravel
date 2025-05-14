import {
  TravelProject as TravelProjectModel,
  ProjectUser as ProjectUserModel,
  Destination as DestinationModel,
  DateSuggestion as DateSuggestionModel,
  Activity as ActivityModel,
} from '@prisma/client';

/**
   * TravelProjectEntity est le type complet renvoyé par Prisma
   * avec ses relations chargées.
   */
  export type TravelProjectEntity = TravelProjectModel & {
    participants: ProjectUserModel[];
    destinations: DestinationModel[];
    dateSuggestions: DateSuggestionModel[];
    activities: ActivityModel[];
  };
  