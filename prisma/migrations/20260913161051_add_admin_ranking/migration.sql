-- AlterTable
ALTER TABLE "app_state" DROP COLUMN "admin_pick_id",
ADD COLUMN     "admin_ranking" JSONB NOT NULL DEFAULT '[]';
