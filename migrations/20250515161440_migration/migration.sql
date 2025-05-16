/*
  Warnings:

  - The primary key for the `date_votes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_id` on the `date_votes` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `date_votes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `date_votes` table. All the data in the column will be lost.
  - You are about to drop the column `voted_at` on the `date_votes` table. All the data in the column will be lost.
  - The primary key for the `destination_votes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `destination_id` on the `destination_votes` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `destination_votes` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `destination_votes` table. All the data in the column will be lost.
  - You are about to drop the column `voted_at` on the `destination_votes` table. All the data in the column will be lost.
  - You are about to drop the column `added_by` on the `travel_project_activities` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `travel_project_activities` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `travel_project_activities` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `travel_project_activities` table. All the data in the column will be lost.
  - You are about to drop the column `suggested_by_ai` on the `travel_project_activities` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `travel_project_activities` table. All the data in the column will be lost.
  - You are about to drop the column `added_by` on the `travel_project_dates` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `travel_project_dates` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `travel_project_dates` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `travel_project_dates` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `travel_project_dates` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `travel_project_dates` table. All the data in the column will be lost.
  - You are about to drop the column `added_by` on the `travel_project_destinations` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `travel_project_destinations` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `travel_project_destinations` table. All the data in the column will be lost.
  - You are about to drop the column `suggested_by_ai` on the `travel_project_destinations` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `travel_project_destinations` table. All the data in the column will be lost.
  - The primary key for the `travel_project_participants` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `joined_at` on the `travel_project_participants` table. All the data in the column will be lost.
  - You are about to drop the column `project_id` on the `travel_project_participants` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `travel_project_participants` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `travel_projects` table. All the data in the column will be lost.
  - You are about to drop the column `creator_id` on the `travel_projects` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `travel_projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[projectId,dateId,userId]` on the table `date_votes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,destinationId,userId]` on the table `destination_votes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId,userId]` on the table `travel_project_participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateId` to the `date_votes` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `date_votes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `projectId` to the `date_votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `date_votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `destinationId` to the `destination_votes` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `destination_votes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `projectId` to the `destination_votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `destination_votes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedBy` to the `travel_project_activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `travel_project_activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `travel_project_activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedBy` to the `travel_project_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `travel_project_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `travel_project_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `travel_project_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `travel_project_dates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addedBy` to the `travel_project_destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `travel_project_destinations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `travel_project_destinations` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `travel_project_participants` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `projectId` to the `travel_project_participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `travel_project_participants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `travel_projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `travel_projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "date_votes" DROP CONSTRAINT "date_votes_date_id_fkey";

-- DropForeignKey
ALTER TABLE "date_votes" DROP CONSTRAINT "date_votes_project_id_fkey";

-- DropForeignKey
ALTER TABLE "destination_votes" DROP CONSTRAINT "destination_votes_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "destination_votes" DROP CONSTRAINT "destination_votes_project_id_fkey";

-- DropForeignKey
ALTER TABLE "travel_project_activities" DROP CONSTRAINT "travel_project_activities_project_id_fkey";

-- DropForeignKey
ALTER TABLE "travel_project_dates" DROP CONSTRAINT "travel_project_dates_project_id_fkey";

-- DropForeignKey
ALTER TABLE "travel_project_destinations" DROP CONSTRAINT "travel_project_destinations_project_id_fkey";

-- DropForeignKey
ALTER TABLE "travel_project_participants" DROP CONSTRAINT "travel_project_participants_project_id_fkey";

-- AlterTable
ALTER TABLE "date_votes" DROP CONSTRAINT "date_votes_pkey",
DROP COLUMN "date_id",
DROP COLUMN "project_id",
DROP COLUMN "user_id",
DROP COLUMN "voted_at",
ADD COLUMN     "dateId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "date_votes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "destination_votes" DROP CONSTRAINT "destination_votes_pkey",
DROP COLUMN "destination_id",
DROP COLUMN "project_id",
DROP COLUMN "user_id",
DROP COLUMN "voted_at",
ADD COLUMN     "destinationId" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "votedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "destination_votes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "travel_project_activities" DROP COLUMN "added_by",
DROP COLUMN "created_at",
DROP COLUMN "image_url",
DROP COLUMN "project_id",
DROP COLUMN "suggested_by_ai",
DROP COLUMN "updated_at",
ADD COLUMN     "addedBy" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "suggestedByAI" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "travel_project_dates" DROP COLUMN "added_by",
DROP COLUMN "created_at",
DROP COLUMN "end_date",
DROP COLUMN "project_id",
DROP COLUMN "start_date",
DROP COLUMN "updated_at",
ADD COLUMN     "addedBy" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "travel_project_destinations" DROP COLUMN "added_by",
DROP COLUMN "created_at",
DROP COLUMN "project_id",
DROP COLUMN "suggested_by_ai",
DROP COLUMN "updated_at",
ADD COLUMN     "addedBy" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "suggestedByAI" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "travel_project_participants" DROP CONSTRAINT "travel_project_participants_pkey",
DROP COLUMN "joined_at",
DROP COLUMN "project_id",
DROP COLUMN "user_id",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "travel_project_participants_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "travel_projects" DROP COLUMN "created_at",
DROP COLUMN "creator_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "travel_project_accommodations" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_project_accommodations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_votes" (
    "projectId" TEXT NOT NULL,
    "accommodationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
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
    "addedBy" TEXT NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "date_votes_projectId_dateId_userId_key" ON "date_votes"("projectId", "dateId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "destination_votes_projectId_destinationId_userId_key" ON "destination_votes"("projectId", "destinationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "travel_project_participants_projectId_userId_key" ON "travel_project_participants"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "travel_project_participants" ADD CONSTRAINT "travel_project_participants_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_destinations" ADD CONSTRAINT "travel_project_destinations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_votes" ADD CONSTRAINT "destination_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_votes" ADD CONSTRAINT "destination_votes_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "travel_project_destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_dates" ADD CONSTRAINT "travel_project_dates_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_votes" ADD CONSTRAINT "date_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_votes" ADD CONSTRAINT "date_votes_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "travel_project_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_activities" ADD CONSTRAINT "travel_project_activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_accommodations" ADD CONSTRAINT "travel_project_accommodations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_votes" ADD CONSTRAINT "accommodation_votes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_votes" ADD CONSTRAINT "accommodation_votes_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "travel_project_accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_photos" ADD CONSTRAINT "accommodation_photos_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "travel_project_accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_comments" ADD CONSTRAINT "accommodation_comments_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "travel_project_accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accommodation_availability" ADD CONSTRAINT "accommodation_availability_accommodationId_fkey" FOREIGN KEY ("accommodationId") REFERENCES "travel_project_accommodations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
