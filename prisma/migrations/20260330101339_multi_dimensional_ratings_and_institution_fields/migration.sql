-- Migration: multi_dimensional_ratings_and_institution_fields
-- Adds multi-dimensional review ratings (FR-04.2), institution fields
-- (bookingLink, pincode, services, openingHours — FR-02.2, FR-02.5, FR-05.2),
-- and doctor fields (qualifications, consultationFee — FR-03.1).

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Review — replace single `rating` with four dimensional columns
-- ─────────────────────────────────────────────────────────────────────────────

-- Add new columns with a temporary default so existing rows are valid
ALTER TABLE "Review"
  ADD COLUMN "ratingOverall"        INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN "ratingCleanliness"    INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN "ratingStaffBehaviour" INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN "ratingWaitTime"       INTEGER NOT NULL DEFAULT 3;

-- Migrate existing single rating value into all four dimensions
UPDATE "Review"
SET
  "ratingOverall"        = "rating",
  "ratingCleanliness"    = "rating",
  "ratingStaffBehaviour" = "rating",
  "ratingWaitTime"       = "rating";

-- Drop the old single rating column
ALTER TABLE "Review" DROP COLUMN "rating";

-- Remove temporary defaults (columns are already populated)
ALTER TABLE "Review"
  ALTER COLUMN "ratingOverall"        DROP DEFAULT,
  ALTER COLUMN "ratingCleanliness"    DROP DEFAULT,
  ALTER COLUMN "ratingStaffBehaviour" DROP DEFAULT,
  ALTER COLUMN "ratingWaitTime"       DROP DEFAULT;

-- Add check constraints to enforce 1–5 range
ALTER TABLE "Review"
  ADD CONSTRAINT "review_ratingOverall_range"        CHECK ("ratingOverall"        BETWEEN 1 AND 5),
  ADD CONSTRAINT "review_ratingCleanliness_range"    CHECK ("ratingCleanliness"    BETWEEN 1 AND 5),
  ADD CONSTRAINT "review_ratingStaffBehaviour_range" CHECK ("ratingStaffBehaviour" BETWEEN 1 AND 5),
  ADD CONSTRAINT "review_ratingWaitTime_range"       CHECK ("ratingWaitTime"       BETWEEN 1 AND 5);

-- Indexes for common query patterns
CREATE INDEX "Review_hospitalId_idx" ON "Review"("hospitalId");
CREATE INDEX "Review_doctorId_idx"   ON "Review"("doctorId");
CREATE INDEX "Review_status_idx"     ON "Review"("status");

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Hospital — add missing institution fields
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE "Hospital"
  ADD COLUMN "bookingLink"          TEXT,
  ADD COLUMN "pincode"              TEXT,
  ADD COLUMN "openingHours"         TEXT,
  ADD COLUMN "services"             TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN "ratingCleanliness"    DOUBLE PRECISION,
  ADD COLUMN "ratingStaffBehaviour" DOUBLE PRECISION,
  ADD COLUMN "ratingWaitTime"       DOUBLE PRECISION;

-- Indexes for search performance
CREATE INDEX "Hospital_name_idx"            ON "Hospital"("name");
CREATE INDEX "Hospital_institutionType_idx" ON "Hospital"("institutionType");

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Doctor — add qualifications and consultation fee
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE "Doctor"
  ADD COLUMN "qualifications"   TEXT[]  NOT NULL DEFAULT '{}',
  ADD COLUMN "consultationFee"  DOUBLE PRECISION;

-- Index for search performance
CREATE INDEX "Doctor_specialization_idx" ON "Doctor"("specialization");
