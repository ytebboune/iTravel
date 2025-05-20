export declare class GetProfileDto {
    id: string;
    username: string;
    bio?: string;
    avatar?: string;
    isPrivate: boolean;
    showEmail: boolean;
    showVisitedPlaces: boolean;
    showPosts: boolean;
    showStories: boolean;
    followersCount: number;
    followingCount: number;
    email?: string;
    visitedPlaces?: any[];
    posts?: any[];
    stories?: any[];
    isFollowing: boolean;
    hasRequestedFollow: boolean;
}
