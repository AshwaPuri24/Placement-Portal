USE placement_portal;

-- Adds recruiter/admin ownership on job postings for access scoping.
ALTER TABLE jobs
  ADD COLUMN IF NOT EXISTS created_by INT NULL;

-- Add foreign key only if it does not already exist.
SET @fk_exists := (
  SELECT COUNT(*)
  FROM information_schema.REFERENTIAL_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND CONSTRAINT_NAME = 'fk_jobs_created_by_users'
);

SET @sql := IF(
  @fk_exists = 0,
  'ALTER TABLE jobs ADD CONSTRAINT fk_jobs_created_by_users FOREIGN KEY (created_by) REFERENCES users(id)',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
