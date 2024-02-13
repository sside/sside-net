/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `BlogEntry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `BlogEntry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BlogEntryDraft" DROP CONSTRAINT "BlogEntryDraft_blogEntryId_fkey";

-- DropForeignKey
ALTER TABLE "BlogEntryHistory" DROP CONSTRAINT "BlogEntryHistory_blogEntryId_fkey";

-- AlterTable
ALTER TABLE "BlogEntry" ADD COLUMN     "slug" VARCHAR(300) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntry_slug_key" ON "BlogEntry"("slug");

-- AddForeignKey
ALTER TABLE "BlogEntryHistory" ADD CONSTRAINT "BlogEntryHistory_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogEntryDraft" ADD CONSTRAINT "BlogEntryDraft_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
