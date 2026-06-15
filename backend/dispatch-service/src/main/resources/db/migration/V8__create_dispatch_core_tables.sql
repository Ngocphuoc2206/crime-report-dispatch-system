CREATE TABLE IF NOT EXISTS administrative_area (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    area_type VARCHAR(50) NOT NULL,
    parent_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_administrative_area_parent
    FOREIGN KEY (parent_id)
    REFERENCES administrative_area(id)
                                                            ON DELETE RESTRICT,

    CONSTRAINT chk_administrative_area_type
    CHECK (area_type IN ('CITY', 'DISTRICT', 'WARD'))
    );

CREATE INDEX IF NOT EXISTS idx_administrative_area_parent_id
    ON administrative_area(parent_id);

CREATE INDEX IF NOT EXISTS idx_administrative_area_area_type
    ON administrative_area(area_type);


CREATE TABLE IF NOT EXISTS police_unit (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    area_id BIGINT NOT NULL,
    address VARCHAR(500),
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    unit_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_police_unit_area
    FOREIGN KEY (area_id)
    REFERENCES administrative_area(id)
    ON DELETE RESTRICT,

    CONSTRAINT chk_police_unit_type
    CHECK (unit_type IN (
           'WARD_POLICE',
           'DISTRICT_POLICE',
           'CRIMINAL_POLICE',
           'EMERGENCY_CENTER'
                        ))
    );

CREATE INDEX IF NOT EXISTS idx_police_unit_area_id
    ON police_unit(area_id);

CREATE INDEX IF NOT EXISTS idx_police_unit_unit_type
    ON police_unit(unit_type);

CREATE INDEX IF NOT EXISTS idx_police_unit_is_active
    ON police_unit(is_active);


CREATE TABLE IF NOT EXISTS officer (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    unit_id BIGINT NOT NULL,
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    rank_name VARCHAR(100),
    officer_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_officer_unit
    FOREIGN KEY (unit_id)
    REFERENCES police_unit(id)
    ON DELETE RESTRICT,

    CONSTRAINT chk_officer_status
    CHECK (officer_status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE'))
    );

CREATE INDEX IF NOT EXISTS idx_officer_unit_id
    ON officer(unit_id);

CREATE INDEX IF NOT EXISTS idx_officer_status
    ON officer(officer_status);


INSERT INTO administrative_area (code, name, area_type, parent_id)
VALUES
    ('HCM', 'TP. Hồ Chí Minh', 'CITY', NULL)
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    area_type = VALUES(area_type),
    parent_id = VALUES(parent_id);

INSERT INTO administrative_area (code, name, area_type, parent_id)
SELECT 'HCM_Q1', 'Quận 1', 'DISTRICT', id
FROM administrative_area
WHERE code = 'HCM'
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    area_type = VALUES(area_type),
    parent_id = VALUES(parent_id);

INSERT INTO administrative_area (code, name, area_type, parent_id)
SELECT 'HCM_Q1_BEN_NGHE', 'Phường Bến Nghé', 'WARD', id
FROM administrative_area
WHERE code = 'HCM_Q1'
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    area_type = VALUES(area_type),
    parent_id = VALUES(parent_id);


INSERT INTO police_unit (
    code,
    name,
    area_id,
    address,
    latitude,
    longitude,
    unit_type,
    is_active
)
SELECT
    'PU_BEN_NGHE',
    'Công an Phường Bến Nghé',
    id,
    'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    10.7792000,
    106.7020000,
    'WARD_POLICE',
    TRUE
FROM administrative_area
WHERE code = 'HCM_Q1_BEN_NGHE'
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    area_id = VALUES(area_id),
    address = VALUES(address),
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    unit_type = VALUES(unit_type),
    is_active = VALUES(is_active);

INSERT INTO police_unit (
    code,
    name,
    area_id,
    address,
    latitude,
    longitude,
    unit_type,
    is_active
)
SELECT
    'PU_Q1',
    'Công an Quận 1',
    id,
    'Quận 1, TP. Hồ Chí Minh',
    10.7756000,
    106.7009000,
    'DISTRICT_POLICE',
    TRUE
FROM administrative_area
WHERE code = 'HCM_Q1'
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    area_id = VALUES(area_id),
    address = VALUES(address),
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    unit_type = VALUES(unit_type),
    is_active = VALUES(is_active);

INSERT INTO police_unit (
    code,
    name,
    area_id,
    address,
    latitude,
    longitude,
    unit_type,
    is_active
)
SELECT
    'PU_113_HCM',
    'Trung tâm 113 TP. Hồ Chí Minh',
    id,
    'TP. Hồ Chí Minh',
    10.7769000,
    106.7009000,
    'EMERGENCY_CENTER',
    TRUE
FROM administrative_area
WHERE code = 'HCM'
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    area_id = VALUES(area_id),
    address = VALUES(address),
    latitude = VALUES(latitude),
    longitude = VALUES(longitude),
    unit_type = VALUES(unit_type),
    is_active = VALUES(is_active);


INSERT INTO officer (
    user_id,
    unit_id,
    badge_number,
    rank_name,
    officer_status
)
SELECT
    2,
    id,
    'CB001',
    'Thiếu úy',
    'ACTIVE'
FROM police_unit
WHERE code = 'PU_BEN_NGHE'
    ON DUPLICATE KEY UPDATE
    unit_id = VALUES(unit_id),
    badge_number = VALUES(badge_number),
    rank_name = VALUES(rank_name),
    officer_status = VALUES(officer_status);

INSERT INTO officer (
    user_id,
    unit_id,
    badge_number,
    rank_name,
    officer_status
)
SELECT
    3,
    id,
    'DP001',
    'Trung úy',
    'ACTIVE'
FROM police_unit
WHERE code = 'PU_Q1'
    ON DUPLICATE KEY UPDATE
    unit_id = VALUES(unit_id),
    badge_number = VALUES(badge_number),
    rank_name = VALUES(rank_name),
    officer_status = VALUES(officer_status);

INSERT INTO officer (
    user_id,
    unit_id,
    badge_number,
    rank_name,
    officer_status
)
SELECT
    4,
    id,
    'CH001',
    'Đại úy',
    'ACTIVE'
FROM police_unit
WHERE code = 'PU_113_HCM'
    ON DUPLICATE KEY UPDATE
    unit_id = VALUES(unit_id),
    badge_number = VALUES(badge_number),
    rank_name = VALUES(rank_name),
    officer_status = VALUES(officer_status);