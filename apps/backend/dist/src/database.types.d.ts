import { TravelProjectRecord } from './travel-project/interfaces/travel-project-record.interface';
import { TravelProjectParticipantRecord } from './travel-project/interfaces/travel-project-participant-record.interface';
import { TravelProjectDestinationRecord } from './travel-project/interfaces/travel-project-destination-record.interface';
import { TravelProjectDateRecord } from './travel-project/interfaces/travel-project-date-record.interface';
import { DateVoteRecord } from './travel-project/interfaces/date-vote-record.interface';
import { DestinationVoteRecord } from './travel-project/interfaces/destination-vote-record.interface';
export type Database = {
    public: {
        travel_projects: TravelProjectRecord;
        travel_project_participants: TravelProjectParticipantRecord;
        travel_project_destinations: TravelProjectDestinationRecord;
        destination_votes: DestinationVoteRecord;
        travel_project_dates: TravelProjectDateRecord;
        date_votes: DateVoteRecord;
    };
};
