-- V6__create_evidence_file_table.sql
-- Create evidence_file table for report evidences.

CREATE TABLE IF NOT EXISTS evidence_file (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100),
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    checksum VARCHAR(128) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_evidence_file_case_report
    FOREIGN KEY (case_id)
    REFERENCES case_report(id)
    ON DELETE CASCADE,

    CONSTRAINT chk_evidence_file_type
    CHECK (file_type IN ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER')),

    CONSTRAINT chk_evidence_file_size
    CHECK (file_size >= 0)
    );

CREATE INDEX IF NOT EXISTS idx_evidence_file_case_id
    ON evidence_file(case_id);

CREATE INDEX IF NOT EXISTS idx_evidence_file_file_type
    ON evidence_file(file_type);

CREATE INDEX IF NOT EXISTS idx_evidence_file_uploaded_at
    ON evidence_file(uploaded_at);

CREATE INDEX IF NOT EXISTS idx_evidence_file_checksum
    ON evidence_file(checksum);
