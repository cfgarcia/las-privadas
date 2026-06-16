-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "appleMusicUrl" TEXT,
ADD COLUMN     "bioLongEn" TEXT,
ADD COLUMN     "bioLongEs" TEXT,
ADD COLUMN     "bioShortEn" TEXT,
ADD COLUMN     "bioShortEs" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "genre" TEXT,
ADD COLUMN     "heroVideoUrl" TEXT,
ADD COLUMN     "instagramUrl" TEXT,
ADD COLUMN     "isPressPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "liveVideoUrl" TEXT,
ADD COLUMN     "pressContacts" JSONB,
ADD COLUMN     "pressQuotes" JSONB,
ADD COLUMN     "pressStats" JSONB,
ADD COLUMN     "pressTaglineEn" TEXT,
ADD COLUMN     "pressTaglineEs" TEXT,
ADD COLUMN     "spotifyUrl" TEXT,
ADD COLUMN     "tiktokUrl" TEXT,
ADD COLUMN     "youtubeUrl" TEXT;

-- CreateTable
CREATE TABLE "PressPhoto" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "webUrl" TEXT,
    "caption" TEXT,
    "orientation" TEXT,
    "credit" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PressPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PressAsset" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "labelEs" TEXT,
    "kind" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileSizeBytes" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PressAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PressPhoto_artistId_order_idx" ON "PressPhoto"("artistId", "order");

-- CreateIndex
CREATE INDEX "PressAsset_artistId_order_idx" ON "PressAsset"("artistId", "order");

-- AddForeignKey
ALTER TABLE "PressPhoto" ADD CONSTRAINT "PressPhoto_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PressAsset" ADD CONSTRAINT "PressAsset_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

