export declare class FollowRequestDto {
    id: string;
    requesterId: string;
    requestedToId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;
    requester: {
        id: string;
        username: string;
        avatar?: string;
    };
}
