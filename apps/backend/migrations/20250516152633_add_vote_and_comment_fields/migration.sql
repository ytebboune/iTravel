-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('draft', 'planning', 'confirmed', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('admin', 'member', 'viewer');

-- CreateEnum
CREATE TYPE "TransportType" AS ENUM ('flight', 'train', 'bus', 'carpool', 'ferry', 'other');

-- CreateEnum
CREATE TYPE "AccommodationType" AS ENUM ('hotel', 'hostel', 'apartment', 'house', 'camping', 'other');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creatorId" TEXT NOT NULL,
    "shareCode" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'draft',
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
    "accommodationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accommodation_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_comments" (
    "id" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
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
CREATE TABLE "travel_project_activities" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "addedBy" TEXT NOT NULL,
    "suggestedByAI" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_project_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

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
CREATE INDEX "accommodation_comments_accommodationId_idx" ON "accommodation_comments"("accommodationId");

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
CREATE INDEX "travel_project_activities_projectId_idx" ON "travel_project_activities"("projectId");

-- CreateIndex
CREATE INDEX "travel_project_activities_addedBy_idx" ON "travel_project_activities"("addedBy");

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
ALTER TABLE "accommodation_comments" ADD CONSTRAINT "accommodation_comments_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "travel_project_activities" ADD CONSTRAINT "travel_project_activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_activities" ADD CONSTRAINT "travel_project_activities_addedBy_fkey" FOREIGN KEY ("addedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
