CREATE TABLE urgency_rule
(
    id BIGSERIAL PRIMARY KEY,
    rule_code VARCHAR(100) NOT NULL UNIQUE,
    score_value INTEGER NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO urgency_rule
(rule_code, score_value, description)
VALUES
    ('HAS_WEAPON',40,'Có vũ khí'),

    ('HAPPENING_NOW',30,'Đang diễn ra'),

    ('HAS_INJURED_PERSON',30,'Có người bị thương'),

    ('EVIDENCE_TYPE_VIDEO',10,'Có video');