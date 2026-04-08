-- CreateTable
CREATE TABLE "blog_entry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "slug" TEXT NOT NULL,
    "publish_at" DATETIME
);

-- CreateTable
CREATE TABLE "blog_entry_history" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blogEntryId" INTEGER NOT NULL,
    CONSTRAINT "blog_entry_history_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "blog_entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_entry_draft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "body_markdown" TEXT NOT NULL,
    "blogEntryId" INTEGER NOT NULL,
    CONSTRAINT "blog_entry_draft_blogEntryId_fkey" FOREIGN KEY ("blogEntryId") REFERENCES "blog_entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "blog_entry_meta_tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BlogEntryToBlogEntryMetaTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogEntryToBlogEntryMetaTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blog_entry" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogEntryToBlogEntryMetaTag_B_fkey" FOREIGN KEY ("B") REFERENCES "blog_entry_meta_tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "blog_entry_slug_key" ON "blog_entry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_entry_draft_blogEntryId_key" ON "blog_entry_draft"("blogEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "blog_entry_meta_tag_name_key" ON "blog_entry_meta_tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BlogEntryToBlogEntryMetaTag_AB_unique" ON "_BlogEntryToBlogEntryMetaTag"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogEntryToBlogEntryMetaTag_B_index" ON "_BlogEntryToBlogEntryMetaTag"("B");
