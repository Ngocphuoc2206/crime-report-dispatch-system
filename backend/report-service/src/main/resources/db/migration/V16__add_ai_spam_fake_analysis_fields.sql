ALTER TABLE case_report
    ADD COLUMN fake_score INT NOT NULL DEFAULT 0,
    ADD COLUMN ai_confidence INT NOT NULL DEFAULT 0,
    ADD COLUMN ai_decision VARCHAR(50) NULL,
    ADD COLUMN spam_detection_source VARCHAR(50) NOT NULL DEFAULT 'RULE_BASED',
    ADD COLUMN ai_model VARCHAR(100) NULL,
    ADD COLUMN ai_checked_at TIMESTAMP NULL,
    ADD COLUMN ai_error TEXT NULL;

CREATE INDEX idx_case_report_spam_level
    ON case_report(spam_level);

CREATE INDEX idx_case_report_ai_decision
    ON case_report(ai_decision);