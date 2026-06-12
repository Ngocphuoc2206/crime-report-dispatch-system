CREATE TABLE IF NOT EXISTS duty_shift (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    start_at DATETIME(6) NOT NULL,
    end_at DATETIME(6) NOT NULL,
    shift_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_duty_shift_time
    CHECK (end_at > start_at),

    CONSTRAINT chk_duty_shift_status
    CHECK (shift_status IN ('PLANNED', 'ACTIVE', 'COMPLETED', 'CANCELLED'))
    );

CREATE INDEX IF NOT EXISTS idx_duty_shift_time
    ON duty_shift(start_at, end_at);

CREATE INDEX IF NOT EXISTS idx_duty_shift_status
    ON duty_shift(shift_status);


CREATE TABLE IF NOT EXISTS duty_assignment (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    shift_id BIGINT NOT NULL,
    officer_id BIGINT NOT NULL,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    current_case_id BIGINT NULL,
    note VARCHAR(255),
    last_status_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_duty_assignment_shift
    FOREIGN KEY (shift_id)
    REFERENCES duty_shift(id)
    ON DELETE RESTRICT,

    CONSTRAINT fk_duty_assignment_officer
    FOREIGN KEY (officer_id)
    REFERENCES officer(id)
    ON DELETE RESTRICT,

    CONSTRAINT uk_duty_assignment_shift_officer
    UNIQUE (shift_id, officer_id),

    CONSTRAINT chk_duty_assignment_status
    CHECK (availability_status IN ('AVAILABLE', 'BUSY', 'OFFLINE'))
    );

CREATE INDEX IF NOT EXISTS idx_duty_assignment_shift_id
    ON duty_assignment(shift_id);

CREATE INDEX IF NOT EXISTS idx_duty_assignment_officer_id
    ON duty_assignment(officer_id);

CREATE INDEX IF NOT EXISTS idx_duty_assignment_status
    ON duty_assignment(availability_status);

CREATE INDEX IF NOT EXISTS idx_duty_assignment_current_case_id
    ON duty_assignment(current_case_id);


INSERT INTO duty_shift (
    code,
    name,
    start_at,
    end_at,
    shift_status
)
VALUES (
           'SHIFT_DEMO_ACTIVE',
           'Ca trực demo đang hoạt động',
           CURRENT_TIMESTAMP(6) - INTERVAL 1 DAY,
           CURRENT_TIMESTAMP(6) + INTERVAL 30 DAY,
           'ACTIVE'
       )
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    start_at = VALUES(start_at),
    end_at = VALUES(end_at),
    shift_status = VALUES(shift_status);


INSERT INTO duty_assignment (
    shift_id,
    officer_id,
    availability_status,
    current_case_id,
    note
)
SELECT
    s.id,
    o.id,
    'AVAILABLE',
    NULL,
    'Seed mẫu: cán bộ đang sẵn sàng nhận case'
FROM duty_shift s
         JOIN officer o ON o.badge_number = 'CB001'
WHERE s.code = 'SHIFT_DEMO_ACTIVE'
    ON DUPLICATE KEY UPDATE
                         availability_status = VALUES(availability_status),
                         current_case_id = VALUES(current_case_id),
                         note = VALUES(note),
                         last_status_at = CURRENT_TIMESTAMP(6);


INSERT INTO duty_assignment (
    shift_id,
    officer_id,
    availability_status,
    current_case_id,
    note
)
SELECT
    s.id,
    o.id,
    'BUSY',
    1,
    'Seed mẫu: cán bộ đang xử lý một case'
FROM duty_shift s
         JOIN officer o ON o.badge_number = 'DP001'
WHERE s.code = 'SHIFT_DEMO_ACTIVE'
    ON DUPLICATE KEY UPDATE
                         availability_status = VALUES(availability_status),
                         current_case_id = VALUES(current_case_id),
                         note = VALUES(note),
                         last_status_at = CURRENT_TIMESTAMP(6);


INSERT INTO duty_assignment (
    shift_id,
    officer_id,
    availability_status,
    current_case_id,
    note
)
SELECT
    s.id,
    o.id,
    'AVAILABLE',
    NULL,
    'Seed mẫu: cán bộ đang sẵn sàng nhận case'
FROM duty_shift s
         JOIN officer o ON o.badge_number = 'CH001'
WHERE s.code = 'SHIFT_DEMO_ACTIVE'
    ON DUPLICATE KEY UPDATE
                         availability_status = VALUES(availability_status),
                         current_case_id = VALUES(current_case_id),
                         note = VALUES(note),
                         last_status_at = CURRENT_TIMESTAMP(6);