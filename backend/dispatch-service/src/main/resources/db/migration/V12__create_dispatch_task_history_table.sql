CREATE TABLE IF NOT EXISTS dispatch_task_history (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dispatch_task_id BIGINT,
    case_id BIGINT NOT NULL,

    action VARCHAR(50) NOT NULL,
    previous_status VARCHAR(50),
    next_status VARCHAR(50),

    previous_unit_id BIGINT,
    previous_officer_id BIGINT,
    assigned_unit_id BIGINT,
    assigned_officer_id BIGINT,

    reason VARCHAR(500),
    actor VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_dispatch_history_task
    FOREIGN KEY (dispatch_task_id)
    REFERENCES dispatch_task(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_dispatch_history_task_id
    ON dispatch_task_history(dispatch_task_id);

CREATE INDEX idx_dispatch_history_case_id
    ON dispatch_task_history(case_id);

CREATE INDEX idx_dispatch_history_created_at
    ON dispatch_task_history(created_at);
