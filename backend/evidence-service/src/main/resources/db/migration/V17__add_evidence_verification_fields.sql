ALTER TABLE evidence_file
    ADD COLUMN IF NOT EXISTS verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    ADD COLUMN IF NOT EXISTS verification_note TEXT NULL,
    ADD COLUMN IF NOT EXISTS verified_by_user_id BIGINT NULL,
    ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP NULL;

CREATE INDEX IF NOT EXISTS idx_evidence_file_verification_status
    ON evidence_file(verification_status);
