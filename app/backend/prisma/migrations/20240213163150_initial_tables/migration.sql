-- CreateTable
CREATE TABLE "BlogEntry" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "slug" VARCHAR(300) NOT NULL,

    CONSTRAINT "BlogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEntryHistory" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blogEntryId" UUID NOT NULL,

    CONSTRAINT "BlogEntryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEntryDraft" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blogEntryId" UUID NOT NULL,

    CONSTRAINT "BlogEntryDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogEntryMetaTag" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,

    CONSTRAINT "BlogEntryMetaTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogEntryToBlogEntryMetaTag" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntry_slug_key" ON "BlogEntry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BlogEntryDraft_blogEntryId_key" ON "BlogEntryDraft"("blogEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogEntryToBlogEntryMetaTag_AB_unique" ON "_BlogEntryToBlogEntryMetaTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogEntryToBlogEntryMetaTag_B_index" ON "_BlogEntryToBlogEntryMetaTag"("B");

-- AddForeignKey
ALTER TABLE "BlogEntryHistory" ADD CONSTRAINT "BlogEntryHistory_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogEntryDraft" ADD CONSTRAINT "BlogEntryDraft_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogEntryMetaTag" ADD CONSTRAINT "_BlogEntryToBlogEntryMetaTag_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogEntryMetaTag" ADD CONSTRAINT "_BlogEntryToBlogEntryMetaTag_B_fkey" FOREIGN KEY ("B") REFERENCES "BlogEntryMetaTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
