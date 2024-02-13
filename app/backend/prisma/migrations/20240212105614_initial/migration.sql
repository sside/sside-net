-- CreateTable
CREATE TABLE "BlogEntry" (
    "id" CHAR NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "body_markdown" TEXT NOT NULL,

    CONSTRAINT "BlogEntry_pkey" PRIMARY KEY ("id")
);
