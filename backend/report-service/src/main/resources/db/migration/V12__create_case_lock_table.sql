CREATE TABLE IF NOT EXISTS case_lock (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL UNIQUE,

    locked_by_user_id BIGINT NOT NULL,
    locked_by_officer_id BIGINT NOT NULL,
    locked_by_unit_id BIGINT NOT NULL,

    lock_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',

    locked_at DATETIME(6) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    released_at DATETIME(6) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_case_lock_case_report
        FOREIGN KEY (case_id)
        REFERENCES case_report(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_case_lock_status
        CHECK (lock_status IN ('ACTIVE', 'RELEASED', 'EXPIRED'))
);

CREATE INDEX idx_case_lock_case_id
    ON case_lock(case_id);

CREATE INDEX idx_case_lock_locked_by_officer_id
    ON case_lock(locked_by_officer_id);

CREATE INDEX idx_case_lock_status_expires_at
    ON case_lock(lock_status, expires_at);
