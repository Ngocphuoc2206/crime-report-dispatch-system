CREATE TABLE IF NOT EXISTS case_notification (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    public_message VARCHAR(500) NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_case_notification_case
        FOREIGN KEY (case_id)
        REFERENCES case_report(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_case_notification_case_created
    ON case_notification(case_id, created_at);

CREATE INDEX idx_case_notification_public
    ON case_notification(is_public);
