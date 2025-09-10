-- AlterTable
ALTER TABLE "public"."Delivery" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "topics" TEXT;

-- AlterTable
ALTER TABLE "public"."Issue" ADD COLUMN     "subject" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "topics" TEXT;

-- CreateIndex
CREATE INDEX "Delivery_userId_createdAt_idx" ON "public"."Delivery"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Delivery_issueId_createdAt_idx" ON "public"."Delivery"("issueId", "createdAt");

-- CreateIndex
CREATE INDEX "Issue_createdAt_idx" ON "public"."Issue"("createdAt");

-- CreateIndex
CREATE INDEX "Preference_nextSendAt_idx" ON "public"."Preference"("nextSendAt");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt");
