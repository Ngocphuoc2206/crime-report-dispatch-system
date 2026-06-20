CREATE TABLE IF NOT EXISTS case_history (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,

    case_id BIGINT NOT NULL,
    actor_user_id BIGINT NOT NULL,
    actor_officer_id BIGINT NULL,
    actor_unit_id BIGINT NULL,
    action VARCHAR(100) NOT NULL,
    old_status VARCHAR(50) NULL,
    new_status VARCHAR(50) NULL,
    note VARCHAR(500) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_case_history_case_report
    FOREIGN KEY (case_id)
    REFERENCES case_report(id)
    ON DELETE CASCADE
    );

CREATE INDEX idx_case_history_case_id
    ON case_history(case_id);

CREATE INDEX idx_case_history_actor_user_id
    ON case_history(actor_user_id);

CREATE INDEX idx_case_history_action
    ON case_history(action);