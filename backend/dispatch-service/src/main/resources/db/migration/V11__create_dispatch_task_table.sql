CREATE TABLE IF NOT EXISTS dispatch_task (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL UNIQUE,

    assigned_unit_id BIGINT NOT NULL,
    assigned_officer_id BIGINT NOT NULL,
    duty_assignment_id BIGINT NOT NULL,

    incident_latitude DECIMAL(10, 7) NOT NULL,
    incident_longitude DECIMAL(10, 7) NOT NULL,
    distance_km DECIMAL(10, 3) NOT NULL,

    dispatch_status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    failure_reason VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_dispatch_task_unit
    FOREIGN KEY (assigned_unit_id)
    REFERENCES police_unit(id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_dispatch_task_officer
    FOREIGN KEY (assigned_officer_id)
    REFERENCES officer(id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_dispatch_task_duty_assignment
    FOREIGN KEY (duty_assignment_id)
    REFERENCES duty_assignment(id)
    ON DELETE RESTRICT,

    CONSTRAINT chk_dispatch_task_status
    CHECK (dispatch_status IN ('PENDING', 'ASSIGNED', 'FAILED', 'CANCELLED', 'COMPLETED'))
);

CREATE INDEX idx_dispatch_task_case_id
    ON dispatch_task(case_id);

CREATE INDEX idx_dispatch_task_assigned_unit_id
    ON dispatch_task(assigned_unit_id);

CREATE INDEX idx_dispatch_task_assigned_officer_id
    ON dispatch_task(assigned_officer_id);

CREATE INDEX idx_dispatch_task_status
    ON dispatch_task(dispatch_status);
