-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "metaIgId" TEXT,
ADD COLUMN     "metaPageId" TEXT,
ADD COLUMN     "metaPageToken" TEXT;

-- CreateTable
CREATE TABLE "MetaInquiry" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "artistId" TEXT,
    "pageId" TEXT NOT NULL,
    "conversationId" TEXT,
    "senderPsid" TEXT NOT NULL,
    "senderUsername" TEXT,
    "senderName" TEXT,
    "messageId" TEXT NOT NULL,
    "messageText" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "intent" TEXT NOT NULL,
    "intentStrength" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "repliedAt" TIMESTAMP(3),
    "replyText" TEXT,
    "createdBookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetaInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetaInquiry_messageId_key" ON "MetaInquiry"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaInquiry_createdBookingId_key" ON "MetaInquiry"("createdBookingId");

-- CreateIndex
CREATE INDEX "MetaInquiry_status_receivedAt_idx" ON "MetaInquiry"("status", "receivedAt");

-- CreateIndex
CREATE INDEX "MetaInquiry_artistId_status_intent_idx" ON "MetaInquiry"("artistId", "status", "intent");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_metaPageId_key" ON "Artist"("metaPageId");

-- CreateIndex
CREATE UNIQUE INDEX "Artist_metaIgId_key" ON "Artist"("metaIgId");

-- AddForeignKey
ALTER TABLE "MetaInquiry" ADD CONSTRAINT "MetaInquiry_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaInquiry" ADD CONSTRAINT "MetaInquiry_createdBookingId_fkey" FOREIGN KEY ("createdBookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

