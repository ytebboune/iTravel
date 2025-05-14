-- CreateTable
CREATE TABLE "travel_projects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creator_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_project_participants" (
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travel_project_participants_pkey" PRIMARY KEY ("project_id","user_id")
);

-- CreateTable
CREATE TABLE "travel_project_destinations" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "added_by" TEXT NOT NULL,
    "suggested_by_ai" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_project_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destination_votes" (
    "project_id" TEXT NOT NULL,
    "destination_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "voted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "destination_votes_pkey" PRIMARY KEY ("project_id","destination_id","user_id")
);

-- CreateTable
CREATE TABLE "travel_project_dates" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "added_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_project_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "date_votes" (
    "project_id" TEXT NOT NULL,
    "date_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "voted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "date_votes_pkey" PRIMARY KEY ("project_id","date_id","user_id")
);

-- CreateTable
CREATE TABLE "travel_project_activities" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "added_by" TEXT NOT NULL,
    "suggested_by_ai" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_project_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "travel_project_participants" ADD CONSTRAINT "travel_project_participants_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_destinations" ADD CONSTRAINT "travel_project_destinations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_votes" ADD CONSTRAINT "destination_votes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "destination_votes" ADD CONSTRAINT "destination_votes_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "travel_project_destinations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_dates" ADD CONSTRAINT "travel_project_dates_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_votes" ADD CONSTRAINT "date_votes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "date_votes" ADD CONSTRAINT "date_votes_date_id_fkey" FOREIGN KEY ("date_id") REFERENCES "travel_project_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travel_project_activities" ADD CONSTRAINT "travel_project_activities_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "travel_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
