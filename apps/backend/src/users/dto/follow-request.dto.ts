import { ApiProperty } from '@nestjs/swagger';

export class FollowRequestDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  requesterId: string;

  @ApiProperty()
  requestedToId: string;

  @ApiProperty()
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  requester: {
    id: string;
    username: string;
    avatar?: string;
  };
} 