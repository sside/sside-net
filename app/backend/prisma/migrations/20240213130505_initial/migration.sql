/*
  Warnings:

  - The primary key for the `BlogEntry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `body_markdown` on the `BlogEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlogEntry" DROP CONSTRAINT "BlogEntry_pkey",
DROP COLUMN "body_markdown",
ALTER COLUMN "id" SET DATA TYPE CHAR(36),
ADD CONSTRAINT "BlogEntry_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "BlogEntryHistory" (
    "id" CHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blogEntryId" CHAR(36) NOT NULL,

    CONSTRAINT "BlogEntryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEntryDraft" (
    "id" CHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blogEntryId" CHAR(36) NOT NULL,

    CONSTRAINT "BlogEntryDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEntryMetaTag" (
    "id" CHAR(36) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,

    CONSTRAINT "BlogEntryMetaTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogEntryToBlogEntryMetaTag" (
    "A" CHAR(36) NOT NULL,
    "B" CHAR(36) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntryDraft_blogEntryId_key" ON "BlogEntryDraft"("blogEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogEntryToBlogEntryMetaTag_AB_unique" ON "_BlogEntryToBlogEntryMetaTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogEntryToBlogEntryMetaTag_B_index" ON "_BlogEntryToBlogEntryMetaTag"("B");

-- AddForeignKey
ALTER TABLE "BlogEntryHistory" ADD CONSTRAINT "BlogEntryHistory_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogEntryDraft" ADD CONSTRAINT "BlogEntryDraft_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogEntryMetaTag" ADD CONSTRAINT "_BlogEntryToBlogEntryMetaTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogEntryMetaTag" ADD CONSTRAINT "_BlogEntryToBlogEntryMetaTag_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogEntryMetaTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
