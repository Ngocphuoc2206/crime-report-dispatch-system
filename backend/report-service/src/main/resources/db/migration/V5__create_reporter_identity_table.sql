-- V5__create_reporter_identity_table.sql
-- Create reporter_identity table for encrypted reporter personal information.

CREATE TABLE IF NOT EXISTS reporter_identity(
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL UNIQUE,

    encrypted_full_name TEXT,
    encrypted_phone TEXT,
    encrypted_email TEXT,
    encrypted_address TEXT,

    iv VARCHAR(255) NOT NULL,

    encryption_key_version VARCHAR(50) NOT NULL DEFAULT 'v1',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reporter_identity_case_report
        FOREIGN KEY (case_id)
        REFERENCES case_report(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_reporter_identity_case_id
ON reporter_identity(case_id);

CREATE INDEX IF NOT EXISTS idx_reporter_identity_key_version
ON reporter_identity(encryption_key_version);
