-- V3__create_crime_catalog_tables.sql
-- Create crime_category and crime_type tables.

CREATE TABLE IF NOT EXISTS crime_category (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_urgency_level VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_crime_category_default_urgency_level
    CHECK (default_urgency_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
    );

CREATE TABLE IF NOT EXISTS crime_type (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_score INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_crime_type_category
    FOREIGN KEY (category_id)
    REFERENCES crime_category(id)
    ON DELETE RESTRICT,

    CONSTRAINT chk_crime_type_base_score
    CHECK (base_score >= 0)
    );

CREATE INDEX IF NOT EXISTS idx_crime_category_code ON crime_category(code);
CREATE INDEX IF NOT EXISTS idx_crime_category_is_active ON crime_category(is_active);

CREATE INDEX IF NOT EXISTS idx_crime_type_code ON crime_type(code);
CREATE INDEX IF NOT EXISTS idx_crime_type_category_id ON crime_type(category_id);
CREATE INDEX IF NOT EXISTS idx_crime_type_is_active ON crime_type(is_active);


-- Seed crime categories

INSERT INTO crime_category (code, name, description, default_urgency_level, is_active)
VALUES
    (
        'SOCIAL_ORDER',
        'Trật tự xã hội',
        'Các hành vi như cướp giật, trộm cắp, gây rối trật tự công cộng, đánh nhau, cố ý gây thương tích.',
        'HIGH',
        TRUE
    ),
    (
        'DRUG',
        'Ma túy',
        'Các hành vi tàng trữ, vận chuyển, mua bán trái phép chất ma túy hoặc tổ chức sử dụng chất cấm.',
        'HIGH',
        TRUE
    ),
    (
        'ECONOMIC',
        'Kinh tế',
        'Các hành vi lừa đảo, buôn lậu, hàng giả, gian lận thương mại, tham nhũng hoặc vi phạm quản lý kinh tế.',
        'MEDIUM',
        TRUE
    ),
    (
        'CYBER',
        'Không gian mạng',
        'Các hành vi lừa đảo trực tuyến, đánh cắp tài khoản, phát tán mã độc, tống tiền online hoặc tấn công hệ thống thông tin.',
        'MEDIUM',
        TRUE
    )
    ON CONFLICT (code) DO NOTHING;


-- Seed crime types: Social Order

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'ROBBERY', 'Cướp giật', 'Hành vi cướp giật tài sản hoặc dùng vũ lực để chiếm đoạt tài sản.', 30, TRUE
FROM crime_category
WHERE code = 'SOCIAL_ORDER'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'THEFT', 'Trộm cắp tài sản', 'Hành vi lén lút chiếm đoạt tài sản của người khác.', 25, TRUE
FROM crime_category
WHERE code = 'SOCIAL_ORDER'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'PUBLIC_DISTURBANCE', 'Gây rối trật tự công cộng', 'Hành vi gây mất an ninh, trật tự tại nơi công cộng.', 20, TRUE
FROM crime_category
WHERE code = 'SOCIAL_ORDER'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'ASSAULT', 'Cố ý gây thương tích', 'Hành vi xâm phạm sức khỏe, thân thể của người khác.', 35, TRUE
FROM crime_category
WHERE code = 'SOCIAL_ORDER'
    ON CONFLICT (code) DO NOTHING;


-- Seed crime types: Drug

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'DRUG_TRAFFICKING', 'Mua bán trái phép chất ma túy', 'Hành vi mua bán, trao đổi, phân phối trái phép chất ma túy.', 40, TRUE
FROM crime_category
WHERE code = 'DRUG'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'DRUG_POSSESSION', 'Tàng trữ trái phép chất ma túy', 'Hành vi cất giữ, tàng trữ trái phép chất ma túy.', 30, TRUE
FROM crime_category
WHERE code = 'DRUG'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'DRUG_USE_ORGANIZATION', 'Tổ chức sử dụng trái phép chất ma túy', 'Hành vi tổ chức, chứa chấp hoặc lôi kéo người khác sử dụng trái phép chất ma túy.', 35, TRUE
FROM crime_category
WHERE code = 'DRUG'
    ON CONFLICT (code) DO NOTHING;


-- Seed crime types: Economic

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'FRAUD', 'Lừa đảo chiếm đoạt tài sản', 'Hành vi dùng thủ đoạn gian dối để chiếm đoạt tài sản.', 25, TRUE
FROM crime_category
WHERE code = 'ECONOMIC'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'SMUGGLING', 'Buôn lậu', 'Hành vi vận chuyển, buôn bán hàng hóa trái phép qua biên giới hoặc khu vực kiểm soát.', 25, TRUE
FROM crime_category
WHERE code = 'ECONOMIC'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'COUNTERFEIT_GOODS', 'Sản xuất, buôn bán hàng giả', 'Hành vi sản xuất, kinh doanh hàng giả hoặc hàng kém chất lượng.', 20, TRUE
FROM crime_category
WHERE code = 'ECONOMIC'
    ON CONFLICT (code) DO NOTHING;


-- Seed crime types: Cyber

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'ONLINE_SCAM', 'Lừa đảo qua mạng', 'Hành vi lừa đảo, chiếm đoạt tài sản thông qua mạng internet, mạng xã hội hoặc viễn thông.', 25, TRUE
FROM crime_category
WHERE code = 'CYBER'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'ACCOUNT_TAKEOVER', 'Chiếm đoạt tài khoản', 'Hành vi đánh cắp, chiếm quyền sử dụng tài khoản cá nhân hoặc tài khoản ngân hàng.', 25, TRUE
FROM crime_category
WHERE code = 'CYBER'
    ON CONFLICT (code) DO NOTHING;

INSERT INTO crime_type (category_id, code, name, description, base_score, is_active)
SELECT id, 'MALWARE_ATTACK', 'Phát tán mã độc', 'Hành vi phát tán phần mềm độc hại, mã độc hoặc tấn công hệ thống thông tin.', 30, TRUE
FROM crime_category
WHERE code = 'CYBER'
    ON CONFLICT (code) DO NOTHING;