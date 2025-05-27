-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "currency" TEXT,
ADD COLUMN     "currencySymbol" TEXT,
ADD COLUMN     "emoji" TEXT,
ADD COLUMN     "emojiU" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "phoneCode" TEXT;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "cityId" TEXT;

-- CreateIndex
CREATE INDEX "posts_cityId_idx" ON "posts"("cityId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
