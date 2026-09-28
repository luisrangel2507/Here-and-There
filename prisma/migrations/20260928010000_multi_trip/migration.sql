-- Multi-trip: replace the single hardcoded Luis/Eleny app with any number of
-- independent trips, each with its own travelers. The one existing trip's
-- data is preserved and migrated onto a new Trip + two Traveler rows
-- (fixed ids below, since this only ever runs once against this dataset).

-- ---- new tables ----
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizer_passcode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "trips_code_key" ON "trips"("code");

CREATE TABLE "travelers" (
    "id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_organizer" BOOLEAN NOT NULL DEFAULT false,
    "info" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "travelers_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "travelers_trip_id_idx" ON "travelers"("trip_id");

CREATE TABLE "trip_state" (
    "trip_id" TEXT NOT NULL,
    "blocked_ids" JSONB NOT NULL DEFAULT '[]',
    "hidden_ids" JSONB NOT NULL DEFAULT '[]',
    "hidden_from" JSONB NOT NULL DEFAULT '{}',
    "trip_start" TEXT,
    "trip_end" TEXT,
    "swipe_round" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "trip_state_pkey" PRIMARY KEY ("trip_id")
);

-- ---- seed the one existing trip from app_state (fixed ids: this block
-- only ever runs once, against the one pre-multi-trip dataset) ----
INSERT INTO "trips" ("id", "code", "name", "organizer_passcode", "created_at")
VALUES ('trip_seed_luis_eleny_2026', 'PVRBAC', 'Luis & Eleny', 'aguacate9', now());

INSERT INTO "travelers" ("id", "trip_id", "name", "is_organizer", "info", "created_at")
SELECT 'trav_seed_luis_2026', 'trip_seed_luis_eleny_2026', 'Luis', true,
       COALESCE((SELECT profile_info -> 'luis' FROM app_state WHERE id = 1), '{}'::jsonb),
       now()
WHERE EXISTS (SELECT 1 FROM app_state WHERE id = 1);

INSERT INTO "travelers" ("id", "trip_id", "name", "is_organizer", "info", "created_at")
SELECT 'trav_seed_eleny_2026', 'trip_seed_luis_eleny_2026', 'Eleny', false,
       COALESCE((SELECT profile_info -> 'eleny' FROM app_state WHERE id = 1), '{}'::jsonb),
       now()
WHERE EXISTS (SELECT 1 FROM app_state WHERE id = 1);

-- No prior app_state row (fresh DB) — still seed the two default travelers
-- so the migrated trip behaves the same either way.
INSERT INTO "travelers" ("id", "trip_id", "name", "is_organizer", "info", "created_at")
SELECT 'trav_seed_luis_2026', 'trip_seed_luis_eleny_2026', 'Luis', true, '{}'::jsonb, now()
WHERE NOT EXISTS (SELECT 1 FROM app_state WHERE id = 1);

INSERT INTO "travelers" ("id", "trip_id", "name", "is_organizer", "info", "created_at")
SELECT 'trav_seed_eleny_2026', 'trip_seed_luis_eleny_2026', 'Eleny', false, '{}'::jsonb, now()
WHERE NOT EXISTS (SELECT 1 FROM app_state WHERE id = 1);

INSERT INTO "trip_state" ("trip_id", "blocked_ids", "hidden_ids", "hidden_from", "trip_start", "trip_end", "swipe_round", "updated_at")
SELECT
  'trip_seed_luis_eleny_2026',
  COALESCE(blocked_ids, '[]'::jsonb),
  COALESCE(hidden_ids, '[]'::jsonb),
  CASE WHEN COALESCE(eleny_hidden_ids, '[]'::jsonb) = '[]'::jsonb
       THEN '{}'::jsonb
       ELSE jsonb_build_object('trav_seed_eleny_2026', eleny_hidden_ids)
  END,
  trip_start, trip_end, COALESCE(swipe_round, 1), now()
FROM app_state WHERE id = 1;

INSERT INTO "trip_state" ("trip_id", "updated_at")
SELECT 'trip_seed_luis_eleny_2026', now()
WHERE NOT EXISTS (SELECT 1 FROM app_state WHERE id = 1);

DROP TABLE "app_state";

-- ---- photos: scope per trip ----
ALTER TABLE "photos" DROP CONSTRAINT "photos_pkey";
ALTER TABLE "photos" ADD COLUMN "trip_id" TEXT;
UPDATE "photos" SET "trip_id" = 'trip_seed_luis_eleny_2026';
ALTER TABLE "photos" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "photos" ADD CONSTRAINT "photos_pkey" PRIMARY KEY ("trip_id", "key");

-- ---- destination_highlights ----
ALTER TABLE "destination_highlights" DROP CONSTRAINT "destination_highlights_pkey";
ALTER TABLE "destination_highlights" ADD COLUMN "trip_id" TEXT;
UPDATE "destination_highlights" SET "trip_id" = 'trip_seed_luis_eleny_2026';
ALTER TABLE "destination_highlights" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "destination_highlights" ADD CONSTRAINT "destination_highlights_pkey" PRIMARY KEY ("trip_id", "dest_id");

-- ---- custom_destinations ----
ALTER TABLE "custom_destinations" DROP CONSTRAINT "custom_destinations_pkey";
ALTER TABLE "custom_destinations" ADD COLUMN "trip_id" TEXT;
UPDATE "custom_destinations" SET "trip_id" = 'trip_seed_luis_eleny_2026';
ALTER TABLE "custom_destinations" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "custom_destinations" ADD CONSTRAINT "custom_destinations_pkey" PRIMARY KEY ("trip_id", "region");

-- ---- destination_lodging ----
ALTER TABLE "destination_lodging" DROP CONSTRAINT "destination_lodging_pkey";
ALTER TABLE "destination_lodging" ADD COLUMN "trip_id" TEXT;
UPDATE "destination_lodging" SET "trip_id" = 'trip_seed_luis_eleny_2026';
ALTER TABLE "destination_lodging" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "destination_lodging" ADD CONSTRAINT "destination_lodging_pkey" PRIMARY KEY ("trip_id", "dest_id");

-- ---- destination_costs ----
ALTER TABLE "destination_costs" DROP CONSTRAINT "destination_costs_pkey";
ALTER TABLE "destination_costs" ADD COLUMN "trip_id" TEXT;
UPDATE "destination_costs" SET "trip_id" = 'trip_seed_luis_eleny_2026';
ALTER TABLE "destination_costs" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "destination_costs" ADD CONSTRAINT "destination_costs_pkey" PRIMARY KEY ("trip_id", "dest_id");

-- ---- itineraries ----
ALTER TABLE "itineraries" DROP CONSTRAINT "itineraries_pkey";
ALTER TABLE "itineraries" ADD COLUMN "trip_id" TEXT;
UPDATE "itineraries" SET "trip_id" = 'trip_seed_luis_eleny_2026';
ALTER TABLE "itineraries" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_pkey" PRIMARY KEY ("trip_id", "dest_id");

-- ---- swipes: profile -> traveler_id ----
ALTER TABLE "swipes" DROP CONSTRAINT "swipes_pkey";
ALTER TABLE "swipes" ADD COLUMN "trip_id" TEXT;
ALTER TABLE "swipes" ADD COLUMN "traveler_id" TEXT;
UPDATE "swipes" SET "trip_id" = 'trip_seed_luis_eleny_2026',
  "traveler_id" = CASE profile WHEN 'luis' THEN 'trav_seed_luis_2026' ELSE 'trav_seed_eleny_2026' END;
ALTER TABLE "swipes" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "swipes" ALTER COLUMN "traveler_id" SET NOT NULL;
ALTER TABLE "swipes" DROP COLUMN "profile";
ALTER TABLE "swipes" ADD CONSTRAINT "swipes_pkey" PRIMARY KEY ("traveler_id", "dest_id");
CREATE INDEX "swipes_trip_id_idx" ON "swipes"("trip_id");

-- ---- reactions: profile -> traveler_id ----
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_pkey";
ALTER TABLE "reactions" ADD COLUMN "trip_id" TEXT;
ALTER TABLE "reactions" ADD COLUMN "traveler_id" TEXT;
UPDATE "reactions" SET "trip_id" = 'trip_seed_luis_eleny_2026',
  "traveler_id" = CASE profile WHEN 'luis' THEN 'trav_seed_luis_2026' ELSE 'trav_seed_eleny_2026' END;
ALTER TABLE "reactions" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "reactions" ALTER COLUMN "traveler_id" SET NOT NULL;
ALTER TABLE "reactions" DROP COLUMN "profile";
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_pkey" PRIMARY KEY ("traveler_id", "dest_id", "name");
CREATE INDEX "reactions_trip_id_idx" ON "reactions"("trip_id");

-- ---- push_subscriptions: profile -> traveler_id ----
ALTER TABLE "push_subscriptions" ADD COLUMN "trip_id" TEXT;
ALTER TABLE "push_subscriptions" ADD COLUMN "traveler_id" TEXT;
UPDATE "push_subscriptions" SET "trip_id" = 'trip_seed_luis_eleny_2026',
  "traveler_id" = CASE profile WHEN 'luis' THEN 'trav_seed_luis_2026' ELSE 'trav_seed_eleny_2026' END;
ALTER TABLE "push_subscriptions" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "push_subscriptions" ALTER COLUMN "traveler_id" SET NOT NULL;
ALTER TABLE "push_subscriptions" DROP COLUMN "profile";
CREATE INDEX "push_subscriptions_trip_id_idx" ON "push_subscriptions"("trip_id");

-- ---- activity: profile -> traveler_id (nullable; 'both' becomes NULL) ----
ALTER TABLE "activity" ADD COLUMN "trip_id" TEXT;
ALTER TABLE "activity" ADD COLUMN "traveler_id" TEXT;
UPDATE "activity" SET "trip_id" = 'trip_seed_luis_eleny_2026',
  "traveler_id" = CASE profile WHEN 'luis' THEN 'trav_seed_luis_2026' WHEN 'eleny' THEN 'trav_seed_eleny_2026' ELSE NULL END;
ALTER TABLE "activity" ALTER COLUMN "trip_id" SET NOT NULL;
ALTER TABLE "activity" DROP COLUMN "profile";
DROP INDEX IF EXISTS "activity_created_at_idx";
CREATE INDEX "activity_trip_id_created_at_idx" ON "activity"("trip_id", "created_at");
