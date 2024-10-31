-- CreateTable
CREATE TABLE "blog_entry" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "slug" VARCHAR(300) NOT NULL,

    CONSTRAINT "blog_entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_entry_history" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blog_entry_id" INTEGER NOT NULL,

    CONSTRAINT "blog_entry_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_entry_draft" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blog_entry_id" INTEGER NOT NULL,

    CONSTRAINT "blog_entry_draft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_entry_meta_tag" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(300) NOT NULL,

    CONSTRAINT "blog_entry_meta_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogEntryToBlogEntryMetaTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_entry_slug_key" ON "blog_entry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_entry_draft_blog_entry_id_key" ON "blog_entry_draft"("blog_entry_id");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogEntryToBlogEntryMetaTag_AB_unique" ON "_BlogEntryToBlogEntryMetaTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogEntryToBlogEntryMetaTag_B_index" ON "_BlogEntryToBlogEntryMetaTag"("B");

-- AddForeignKey
ALTER TABLE "blog_entry_history" ADD CONSTRAINT "blog_entry_history_blog_entry_id_fkey" FOREIGN KEY ("blog_entry_id") REFERENCES "blog_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_entry_draft" ADD CONSTRAINT "blog_entry_draft_blog_entry_id_fkey" FOREIGN KEY ("blog_entry_id") REFERENCES "blog_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogEntryMetaTag" ADD CONSTRAINT "_BlogEntryToBlogEntryMetaTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogEntryToBlogEntryMetaTag" ADD CONSTRAINT "_BlogEntryToBlogEntryMetaTag_B_fkey" FOREIGN KEY ("B") REFERENCES "blog_entry_meta_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
