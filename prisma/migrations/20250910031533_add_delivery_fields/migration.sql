-- AlterTable
ALTER TABLE "public"."Delivery" ADD COLUMN     "subject" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "toEmail" TEXT,
ADD COLUMN     "toName" TEXT;
