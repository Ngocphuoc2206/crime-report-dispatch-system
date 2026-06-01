-- V4__create_case_report_table.sql
-- Create case_report table for report case management.

CREATE TABLE IF NOT EXISTS case_report (
    id BIGSERIAL PRIMARY KEY,
    tracking_code VARCHAR(50) NOT NULL UNIQUE,
    crime_type_id BIGINT NOT NULL,
    description TEXT NOT NULL,
    incident_time TIMESTAMP,
    is_happening_now BOOLEAN NOT NULL DEFAULT FALSE,
    has_weapon BOOLEAN NOT NULL DEFAULT FALSE,
    has_injured_person BOOLEAN NOT NULL DEFAULT FALSE,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    address_text TEXT,
    urgency_score INT NOT NULL DEFAULT 0,
    urgency_level VARCHAR(50) NOT NULL DEFAULT 'LOW',
    status VARCHAR(50) NOT NULL DEFAULT 'NEW_RECEIVED',
    assigned_unit_id BIGINT,
    assigned_officer_id BIGINT,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_case_report_crime_type
    FOREIGN KEY (crime_type_id)
    REFERENCES crime_type(id)
    ON DELETE RESTRICT,

    CONSTRAINT chk_case_report_status
    CHECK (status IN (
           'NEW_RECEIVED',
           'UNDER_VERIFICATION',
           'TRANSFERRED_TO_INVESTIGATION',
           'RESOLVED',
           'SPAM_OR_FAKE'
                     )),

    CONSTRAINT chk_case_report_urgency_level
    CHECK (urgency_level IN (
           'LOW',
           'MEDIUM',
           'HIGH',
           'CRITICAL'
                            )),

    CONSTRAINT chk_case_report_urgency_score
    CHECK (urgency_score >= 0)
    );

CREATE INDEX IF NOT EXISTS idx_case_report_tracking_code
    ON case_report(tracking_code);

CREATE INDEX IF NOT EXISTS idx_case_report_crime_type_id
    ON case_report(crime_type_id);

CREATE INDEX IF NOT EXISTS idx_case_report_status
    ON case_report(status);

CREATE INDEX IF NOT EXISTS idx_case_report_urgency_level
    ON case_report(urgency_level);

CREATE INDEX IF NOT EXISTS idx_case_report_assigned_unit_id
    ON case_report(assigned_unit_id);

CREATE INDEX IF NOT EXISTS idx_case_report_assigned_officer_id
    ON case_report(assigned_officer_id);

CREATE INDEX IF NOT EXISTS idx_case_report_created_at
    ON case_report(created_at);