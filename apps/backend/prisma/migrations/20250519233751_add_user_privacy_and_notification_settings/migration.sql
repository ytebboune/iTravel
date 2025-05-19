-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'planning', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectStep" AS ENUM ('date_selection', 'transport', 'accommodation', 'activities');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('admin', 'member', 'viewer');

-- CreateEnum
CREATE TYPE "TransportType" AS ENUM ('PLANE', 'TRAIN', 'BUS', 'CAR', 'BOAT', 'OTHER');

-- CreateEnum
CREATE TYPE "AccommodationType" AS ENUM ('hotel', 'hostel', 'apartment', 'house', 'camping', 'other');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('email_verification', 'password_reset', 'refresh');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "showEmail" BOOLEAN NOT NULL DEFAULT true,
    "showVisitedPlaces" BOOLEAN NOT NULL DEFAULT true,
    "showPosts" BOOLEAN NOT NULL DEFAULT true,
    "showStories" BOOLEAN NOT NULL DEFAULT true,
    "notificationSettings" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visited_places" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "cityId" TEXT,
    "visitedAt" TIMESTAMP(3) NOT NULL,
    "rating" SMALLINT,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visited_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flag" TEXT,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_comments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,
    "shareCode" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
    "currentStep" "ProjectStep" NOT NULL DEFAULT 'date_selection',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_participants" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ProjectRole" NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_options" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "TransportType" NOT NULL,
    "departure" TEXT NOT NULL,
    "arrival" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TEXT,
    "price" DECIMAL(10,2),
    "link" TEXT,
    "company" TEXT,
    "flightNumber" TEXT,
    "baggageIncluded" BOOLEAN,
    "nbStops" INTEGER,
    "seatInfo" TEXT,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "selectedAt" TIMESTAMP(3),
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_votes" (
    "projectId" TEXT NOT NULL,
    "transportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "comment" TEXT,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_votes_pkey" PRIMARY KEY ("projectId","transportId","userId")
);

-- CreateTable
CREATE TABLE "transport_comments" (
    "id" TEXT NOT NULL,
    "transportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transport_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transport_comment_likes" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transport_comment_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "link" TEXT,
    "type" "AccommodationType" NOT NULL DEFAULT 'other',
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "selectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_votes" (
    "projectId" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "comment" TEXT,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_votes_pkey" PRIMARY KEY ("projectId","accommodationId","userId")
);

-- CreateTable
CREATE TABLE "accommodation_photos" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT,
    "visitedPlaceId" TEXT,
    "postId" TEXT,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_comments" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT,
    "destinationId" TEXT,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_availability" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_project_destinations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addedBy" TEXT NOT NULL,
    "suggestedByAI" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_project_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_votes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "destinationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "comment" TEXT,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destination_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_project_dates" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "addedBy" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "selectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_project_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "date_votes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "dateId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "comment" TEXT,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "date_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "suggestedByAI" BOOLEAN NOT NULL DEFAULT false,
    "addedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_votes" (
    "projectId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "comment" TEXT,
    "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_votes_pkey" PRIMARY KEY ("projectId","activityId","userId")
);

-- CreateTable
CREATE TABLE "predefined_activities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "predefined_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planning_activities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "activityId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planning_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plannings" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plannings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowRequest" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "requestedToId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "device" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "story_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "follows_followerId_idx" ON "follows"("followerId");

-- CreateIndex
CREATE INDEX "follows_followingId_idx" ON "follows"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "follows"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "visited_places_userId_idx" ON "visited_places"("userId");

-- CreateIndex
CREATE INDEX "visited_places_countryId_idx" ON "visited_places"("countryId");

-- CreateIndex
CREATE INDEX "visited_places_cityId_idx" ON "visited_places"("cityId");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE INDEX "cities_countryId_idx" ON "cities"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_countryId_key" ON "cities"("name", "countryId");

-- CreateIndex
CREATE INDEX "posts_userId_idx" ON "posts"("userId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "likes"("userId");

-- CreateIndex
CREATE INDEX "likes_postId_idx" ON "likes"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_postId_key" ON "likes"("userId", "postId");

-- CreateIndex
CREATE INDEX "social_comments_userId_idx" ON "social_comments"("userId");

-- CreateIndex
CREATE INDEX "social_comments_postId_idx" ON "social_comments"("postId");

-- CreateIndex
CREATE INDEX "stories_userId_idx" ON "stories"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "travel_projects_shareCode_key" ON "travel_projects"("shareCode");

-- CreateIndex
CREATE INDEX "travel_projects_creatorId_idx" ON "travel_projects"("creatorId");

-- CreateIndex
CREATE INDEX "project_participants_projectId_idx" ON "project_participants"("projectId");

-- CreateIndex
CREATE INDEX "project_participants_userId_idx" ON "project_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "project_participants_projectId_userId_key" ON "project_participants"("projectId", "userId");

-- CreateIndex
CREATE INDEX "transport_options_projectId_idx" ON "transport_options"("projectId");

-- CreateIndex
CREATE INDEX "transport_options_addedBy_idx" ON "transport_options"("addedBy");

-- CreateIndex
CREATE INDEX "transport_votes_transportId_idx" ON "transport_votes"("transportId");

-- CreateIndex
CREATE INDEX "transport_votes_userId_idx" ON "transport_votes"("userId");

-- CreateIndex
CREATE INDEX "transport_comments_transportId_idx" ON "transport_comments"("transportId");

-- CreateIndex
CREATE INDEX "transport_comments_userId_idx" ON "transport_comments"("userId");

-- CreateIndex
CREATE INDEX "transport_comments_parentId_idx" ON "transport_comments"("parentId");

-- CreateIndex
CREATE INDEX "transport_comment_likes_commentId_idx" ON "transport_comment_likes"("commentId");

-- CreateIndex
CREATE INDEX "transport_comment_likes_userId_idx" ON "transport_comment_likes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "transport_comment_likes_commentId_userId_key" ON "transport_comment_likes"("commentId", "userId");

-- CreateIndex
CREATE INDEX "accommodations_projectId_idx" ON "accommodations"("projectId");

-- CreateIndex
CREATE INDEX "accommodation_votes_accommodationId_idx" ON "accommodation_votes"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_votes_userId_idx" ON "accommodation_votes"("userId");

-- CreateIndex
CREATE INDEX "accommodation_photos_accommodationId_idx" ON "accommodation_photos"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_photos_visitedPlaceId_idx" ON "accommodation_photos"("visitedPlaceId");

-- CreateIndex
CREATE INDEX "accommodation_photos_postId_idx" ON "accommodation_photos"("postId");

-- CreateIndex
CREATE INDEX "accommodation_comments_accommodationId_idx" ON "accommodation_comments"("accommodationId");

-- CreateIndex
CREATE INDEX "accommodation_comments_destinationId_idx" ON "accommodation_comments"("destinationId");

-- CreateIndex
CREATE INDEX "accommodation_comments_userId_idx" ON "accommodation_comments"("userId");

-- CreateIndex
CREATE INDEX "accommodation_availability_accommodationId_idx" ON "accommodation_availability"("accommodationId");

-- CreateIndex
CREATE INDEX "travel_project_destinations_projectId_idx" ON "travel_project_destinations"("projectId");

-- CreateIndex
CREATE INDEX "travel_project_destinations_addedBy_idx" ON "travel_project_destinations"("addedBy");

-- CreateIndex
CREATE INDEX "destination_votes_projectId_idx" ON "destination_votes"("projectId");

-- CreateIndex
CREATE INDEX "destination_votes_destinationId_idx" ON "destination_votes"("destinationId");

-- CreateIndex
CREATE INDEX "destination_votes_userId_idx" ON "destination_votes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "destination_votes_projectId_destinationId_userId_key" ON "destination_votes"("projectId", "destinationId", "userId");

-- CreateIndex
CREATE INDEX "travel_project_dates_projectId_idx" ON "travel_project_dates"("projectId");

-- CreateIndex
CREATE INDEX "travel_project_dates_addedBy_idx" ON "travel_project_dates"("addedBy");

-- CreateIndex
CREATE INDEX "date_votes_projectId_idx" ON "date_votes"("projectId");

-- CreateIndex
CREATE INDEX "date_votes_dateId_idx" ON "date_votes"("dateId");

-- CreateIndex
CREATE INDEX "date_votes_userId_idx" ON "date_votes"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "date_votes_projectId_dateId_userId_key" ON "date_votes"("projectId", "dateId", "userId");

-- CreateIndex
CREATE INDEX "activities_projectId_idx" ON "activities"("projectId");

-- CreateIndex
CREATE INDEX "activities_addedBy_idx" ON "activities"("addedBy");

-- CreateIndex
CREATE INDEX "activity_votes_activityId_idx" ON "activity_votes"("activityId");

-- CreateIndex
CREATE INDEX "activity_votes_userId_idx" ON "activity_votes"("userId");

-- CreateIndex
CREATE INDEX "planning_activities_projectId_idx" ON "planning_activities"("projectId");

-- CreateIndex
CREATE INDEX "planning_activities_activityId_idx" ON "planning_activities"("activityId");

-- CreateIndex
CREATE INDEX "planning_activities_planningId_idx" ON "planning_activities"("planningId");

-- CreateIndex
CREATE INDEX "plannings_projectId_idx" ON "plannings"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "FollowRequest_requesterId_requestedToId_key" ON "FollowRequest"("requesterId", "requestedToId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "verification_tokens_userId_idx" ON "verification_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- CreateIndex
CREATE INDEX "password_reset_tokens_userId_idx" ON "password_reset_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "story_views_userId_idx" ON "story_views"("userId");

-- CreateIndex
CREATE INDEX "story_views_storyId_idx" ON "story_views"("storyId");

-- CreateIndex
CREATE UNIQUE INDEX "story_views_userId_storyId_key" ON "story_views"("userId", "storyId");

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_places" ADD CONSTRAINT "visited_places_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_places" ADD CONSTRAINT "visited_places_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_places" ADD CONSTRAINT "visited_places_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comments" ADD CONSTRAINT "social_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social_comments" ADD CONSTRAINT "social_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stories" ADD CONSTRAINT "stories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_projects" ADD CONSTRAINT "travel_projects_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_participants" ADD CONSTRAINT "project_participants_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_participants" ADD CONSTRAINT "project_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_options" ADD CONSTRAINT "transport_options_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_options" ADD CONSTRAINT "transport_options_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_votes" ADD CONSTRAINT "transport_votes_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transport_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_votes" ADD CONSTRAINT "transport_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_votes" ADD CONSTRAINT "transport_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_comments" ADD CONSTRAINT "transport_comments_transportId_fkey" FOREIGN KEY ("transportId") REFERENCES "transport_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_comments" ADD CONSTRAINT "transport_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_comments" ADD CONSTRAINT "transport_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "transport_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_comment_likes" ADD CONSTRAINT "transport_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "transport_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transport_comment_likes" ADD CONSTRAINT "transport_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodations" ADD CONSTRAINT "accommodations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_votes" ADD CONSTRAINT "accommodation_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_votes" ADD CONSTRAINT "accommodation_votes_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_votes" ADD CONSTRAINT "accommodation_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_photos" ADD CONSTRAINT "accommodation_photos_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_photos" ADD CONSTRAINT "accommodation_photos_visitedPlaceId_fkey" FOREIGN KEY ("visitedPlaceId") REFERENCES "visited_places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_photos" ADD CONSTRAINT "accommodation_photos_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_comments" ADD CONSTRAINT "accommodation_comments_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_comments" ADD CONSTRAINT "accommodation_comments_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "travel_project_destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_comments" ADD CONSTRAINT "accommodation_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_availability" ADD CONSTRAINT "accommodation_availability_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_destinations" ADD CONSTRAINT "travel_project_destinations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_destinations" ADD CONSTRAINT "travel_project_destinations_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_votes" ADD CONSTRAINT "destination_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_votes" ADD CONSTRAINT "destination_votes_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "travel_project_destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_votes" ADD CONSTRAINT "destination_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_dates" ADD CONSTRAINT "travel_project_dates_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_dates" ADD CONSTRAINT "travel_project_dates_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_votes" ADD CONSTRAINT "date_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_votes" ADD CONSTRAINT "date_votes_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "travel_project_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_votes" ADD CONSTRAINT "date_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_votes" ADD CONSTRAINT "activity_votes_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_votes" ADD CONSTRAINT "activity_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_votes" ADD CONSTRAINT "activity_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_activities" ADD CONSTRAINT "planning_activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_activities" ADD CONSTRAINT "planning_activities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planning_activities" ADD CONSTRAINT "planning_activities_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "plannings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plannings" ADD CONSTRAINT "plannings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowRequest" ADD CONSTRAINT "FollowRequest_requestedToId_fkey" FOREIGN KEY ("requestedToId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "story_views" ADD CONSTRAINT "story_views_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
