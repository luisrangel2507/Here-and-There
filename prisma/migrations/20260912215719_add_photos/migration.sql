-- CreateTable
CREATE TABLE "photos" (
    "key" TEXT NOT NULL,
    "data_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("key")
);
