CREATE TABLE IF NOT EXISTS app_metadata (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    meta_key VARCHAR(100) NOT NULL UNIQUE,
    meta_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

INSERT IGNORE INTO app_metadata (meta_key, meta_value)
VALUES ('schema_version', 'dispatch-v1');