import { ApiProperty } from '@nestjs/swagger';

export class GetProfileDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ required: false })
  bio?: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty()
  isPrivate: boolean;

  @ApiProperty()
  showEmail: boolean;

  @ApiProperty()
  showVisitedPlaces: boolean;

  @ApiProperty()
  showPosts: boolean;

  @ApiProperty()
  showStories: boolean;

  @ApiProperty()
  followersCount: number;

  @ApiProperty()
  followingCount: number;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ type: [Object], required: false })
  visitedPlaces?: any[];

  @ApiProperty({ type: [Object], required: false })
  posts?: any[];

  @ApiProperty({ type: [Object], required: false })
  stories?: any[];

  @ApiProperty()
  isFollowing: boolean;

  @ApiProperty()
  hasRequestedFollow: boolean;
} 