-- CreateTable
CREATE TABLE "app_state" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "priority_order" JSONB NOT NULL DEFAULT '[]',
    "blocked_ids" JSONB NOT NULL DEFAULT '[]',
    "last_submit_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_state_pkey" PRIMARY KEY ("id")
);
