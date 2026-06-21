CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    actor_user_id BIGINT NULL,
    actor_role VARCHAR(100) NULL,

    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id BIGINT NOT NULL,

    old_value VARCHAR(500) NULL,
    new_value VARCHAR(500) NULL,

    note VARCHAR(500) NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_audit_log_resource
    ON audit_log(resource_type, resource_id);

CREATE INDEX idx_audit_log_actor_user_id
    ON audit_log(actor_user_id);

CREATE INDEX idx_audit_log_action
    ON audit_log(action);