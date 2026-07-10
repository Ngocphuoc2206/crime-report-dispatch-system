-- Demo seed for Ho Chi Minh City dispatch data.
-- Run against the MariaDB container before demo.
--
-- It creates:
-- - Officer login users in crime_auth
-- - HCMC administrative areas in crime_dispatch
-- - Police units matching the Admin Units form
-- - Officer profiles matching the Admin Officers form
-- - One active duty shift and AVAILABLE assignments
-- - A realistic six-completed-month report trend plus seven recent reports

USE crime_auth;

INSERT IGNORE INTO roles (name, description)
VALUES ('OFFICER', 'Officer handling assigned report cases');

INSERT INTO users (username, password_hash, full_name, email, phone, is_active)
VALUES
  ('officer_hcm_thuduc', '{noop}officer123', 'Officer Thu Duc Demo', 'officer_hcm_thuduc@example.com', '0910001001', TRUE),
  ('officer_hcm_q1', '{noop}officer123', 'Officer Quan 1 Demo', 'officer_hcm_q1@example.com', '0910001002', TRUE),
  ('officer_hcm_q3', '{noop}officer123', 'Officer Quan 3 Demo', 'officer_hcm_q3@example.com', '0910001003', TRUE),
  ('officer_hcm_q4', '{noop}officer123', 'Officer Quan 4 Demo', 'officer_hcm_q4@example.com', '0910001004', TRUE),
  ('officer_hcm_q5', '{noop}officer123', 'Officer Quan 5 Demo', 'officer_hcm_q5@example.com', '0910001005', TRUE),
  ('officer_hcm_q6', '{noop}officer123', 'Officer Quan 6 Demo', 'officer_hcm_q6@example.com', '0910001006', TRUE),
  ('officer_hcm_q7', '{noop}officer123', 'Officer Quan 7 Demo', 'officer_hcm_q7@example.com', '0910001007', TRUE),
  ('officer_hcm_q8', '{noop}officer123', 'Officer Quan 8 Demo', 'officer_hcm_q8@example.com', '0910001008', TRUE),
  ('officer_hcm_q10', '{noop}officer123', 'Officer Quan 10 Demo', 'officer_hcm_q10@example.com', '0910001010', TRUE),
  ('officer_hcm_q11', '{noop}officer123', 'Officer Quan 11 Demo', 'officer_hcm_q11@example.com', '0910001011', TRUE),
  ('officer_hcm_q12', '{noop}officer123', 'Officer Quan 12 Demo', 'officer_hcm_q12@example.com', '0910001012', TRUE),
  ('officer_hcm_binh_tan', '{noop}officer123', 'Officer Binh Tan Demo', 'officer_hcm_binh_tan@example.com', '0910001013', TRUE),
  ('officer_hcm_binh_thanh', '{noop}officer123', 'Officer Binh Thanh Demo', 'officer_hcm_binh_thanh@example.com', '0910001014', TRUE),
  ('officer_hcm_go_vap', '{noop}officer123', 'Officer Go Vap Demo', 'officer_hcm_go_vap@example.com', '0910001015', TRUE),
  ('officer_hcm_phu_nhuan', '{noop}officer123', 'Officer Phu Nhuan Demo', 'officer_hcm_phu_nhuan@example.com', '0910001016', TRUE),
  ('officer_hcm_tan_binh', '{noop}officer123', 'Officer Tan Binh Demo', 'officer_hcm_tan_binh@example.com', '0910001017', TRUE),
  ('officer_hcm_tan_phu', '{noop}officer123', 'Officer Tan Phu Demo', 'officer_hcm_tan_phu@example.com', '0910001018', TRUE),
  ('officer_hcm_binh_chanh', '{noop}officer123', 'Officer Binh Chanh Demo', 'officer_hcm_binh_chanh@example.com', '0910001019', TRUE),
  ('officer_hcm_can_gio', '{noop}officer123', 'Officer Can Gio Demo', 'officer_hcm_can_gio@example.com', '0910001020', TRUE),
  ('officer_hcm_cu_chi', '{noop}officer123', 'Officer Cu Chi Demo', 'officer_hcm_cu_chi@example.com', '0910001021', TRUE),
  ('officer_hcm_hoc_mon', '{noop}officer123', 'Officer Hoc Mon Demo', 'officer_hcm_hoc_mon@example.com', '0910001022', TRUE),
  ('officer_hcm_nha_be', '{noop}officer123', 'Officer Nha Be Demo', 'officer_hcm_nha_be@example.com', '0910001023', TRUE),
  ('officer_hcm_113', '{noop}officer123', 'Officer 113 HCMC Demo', 'officer_hcm_113@example.com', '0910001123', TRUE)
ON DUPLICATE KEY UPDATE
  password_hash = VALUES(password_hash),
  full_name = VALUES(full_name),
  email = VALUES(email),
  phone = VALUES(phone),
  is_active = VALUES(is_active);

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'OFFICER'
WHERE u.username IN (
  'officer01',
  'officer_hcm_thuduc',
  'officer_hcm_q1',
  'officer_hcm_q3',
  'officer_hcm_q4',
  'officer_hcm_q5',
  'officer_hcm_q6',
  'officer_hcm_q7',
  'officer_hcm_q8',
  'officer_hcm_q10',
  'officer_hcm_q11',
  'officer_hcm_q12',
  'officer_hcm_binh_tan',
  'officer_hcm_binh_thanh',
  'officer_hcm_go_vap',
  'officer_hcm_phu_nhuan',
  'officer_hcm_tan_binh',
  'officer_hcm_tan_phu',
  'officer_hcm_binh_chanh',
  'officer_hcm_can_gio',
  'officer_hcm_cu_chi',
  'officer_hcm_hoc_mon',
  'officer_hcm_nha_be',
  'officer_hcm_113'
);

USE crime_dispatch;

INSERT INTO administrative_area (code, name, area_type, parent_id)
VALUES ('HCM', 'TP. Ho Chi Minh', 'CITY', NULL)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  area_type = VALUES(area_type),
  parent_id = VALUES(parent_id);

INSERT INTO administrative_area (code, name, area_type, parent_id)
SELECT area_code, area_name, 'DISTRICT', hcm.id
FROM administrative_area hcm
JOIN (
  SELECT 'HCM_TP_THU_DUC' area_code, 'Thanh pho Thu Duc' area_name UNION ALL
  SELECT 'HCM_Q1', 'Quan 1' UNION ALL
  SELECT 'HCM_Q3', 'Quan 3' UNION ALL
  SELECT 'HCM_Q4', 'Quan 4' UNION ALL
  SELECT 'HCM_Q5', 'Quan 5' UNION ALL
  SELECT 'HCM_Q6', 'Quan 6' UNION ALL
  SELECT 'HCM_Q7', 'Quan 7' UNION ALL
  SELECT 'HCM_Q8', 'Quan 8' UNION ALL
  SELECT 'HCM_Q10', 'Quan 10' UNION ALL
  SELECT 'HCM_Q11', 'Quan 11' UNION ALL
  SELECT 'HCM_Q12', 'Quan 12' UNION ALL
  SELECT 'HCM_BINH_TAN', 'Quan Binh Tan' UNION ALL
  SELECT 'HCM_BINH_THANH', 'Quan Binh Thanh' UNION ALL
  SELECT 'HCM_GO_VAP', 'Quan Go Vap' UNION ALL
  SELECT 'HCM_PHU_NHUAN', 'Quan Phu Nhuan' UNION ALL
  SELECT 'HCM_TAN_BINH', 'Quan Tan Binh' UNION ALL
  SELECT 'HCM_TAN_PHU', 'Quan Tan Phu' UNION ALL
  SELECT 'HCM_BINH_CHANH', 'Huyen Binh Chanh' UNION ALL
  SELECT 'HCM_CAN_GIO', 'Huyen Can Gio' UNION ALL
  SELECT 'HCM_CU_CHI', 'Huyen Cu Chi' UNION ALL
  SELECT 'HCM_HOC_MON', 'Huyen Hoc Mon' UNION ALL
  SELECT 'HCM_NHA_BE', 'Huyen Nha Be'
) areas
WHERE hcm.code = 'HCM'
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  area_type = VALUES(area_type),
  parent_id = VALUES(parent_id);

INSERT INTO police_unit (code, name, area_id, address, latitude, longitude, unit_type, is_active)
SELECT unit_code, unit_name, a.id, address, latitude, longitude, unit_type, TRUE
FROM administrative_area a
JOIN (
  SELECT 'PU_HCM_TP_THU_DUC' unit_code, 'Cong an Thanh pho Thu Duc' unit_name, 'HCM_TP_THU_DUC' area_code, 'Thanh pho Thu Duc, TP. Ho Chi Minh' address, 10.8490000 latitude, 106.7698000 longitude, 'DISTRICT_POLICE' unit_type UNION ALL
  SELECT 'PU_HCM_Q1', 'Cong an Quan 1', 'HCM_Q1', 'Quan 1, TP. Ho Chi Minh', 10.7756000, 106.7009000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q3', 'Cong an Quan 3', 'HCM_Q3', 'Quan 3, TP. Ho Chi Minh', 10.7847000, 106.6844000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q4', 'Cong an Quan 4', 'HCM_Q4', 'Quan 4, TP. Ho Chi Minh', 10.7592000, 106.7045000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q5', 'Cong an Quan 5', 'HCM_Q5', 'Quan 5, TP. Ho Chi Minh', 10.7540000, 106.6634000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q6', 'Cong an Quan 6', 'HCM_Q6', 'Quan 6, TP. Ho Chi Minh', 10.7468000, 106.6350000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q7', 'Cong an Quan 7', 'HCM_Q7', 'Quan 7, TP. Ho Chi Minh', 10.7380000, 106.7219000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q8', 'Cong an Quan 8', 'HCM_Q8', 'Quan 8, TP. Ho Chi Minh', 10.7244000, 106.6286000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q10', 'Cong an Quan 10', 'HCM_Q10', 'Quan 10, TP. Ho Chi Minh', 10.7722000, 106.6678000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q11', 'Cong an Quan 11', 'HCM_Q11', 'Quan 11, TP. Ho Chi Minh', 10.7630000, 106.6438000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_Q12', 'Cong an Quan 12', 'HCM_Q12', 'Quan 12, TP. Ho Chi Minh', 10.8672000, 106.6539000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_BINH_TAN', 'Cong an Quan Binh Tan', 'HCM_BINH_TAN', 'Quan Binh Tan, TP. Ho Chi Minh', 10.7658000, 106.6038000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_BINH_THANH', 'Cong an Quan Binh Thanh', 'HCM_BINH_THANH', 'Quan Binh Thanh, TP. Ho Chi Minh', 10.8106000, 106.7091000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_GO_VAP', 'Cong an Quan Go Vap', 'HCM_GO_VAP', 'Quan Go Vap, TP. Ho Chi Minh', 10.8387000, 106.6653000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_PHU_NHUAN', 'Cong an Quan Phu Nhuan', 'HCM_PHU_NHUAN', 'Quan Phu Nhuan, TP. Ho Chi Minh', 10.7992000, 106.6802000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_TAN_BINH', 'Cong an Quan Tan Binh', 'HCM_TAN_BINH', 'Quan Tan Binh, TP. Ho Chi Minh', 10.8017000, 106.6520000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_TAN_PHU', 'Cong an Quan Tan Phu', 'HCM_TAN_PHU', 'Quan Tan Phu, TP. Ho Chi Minh', 10.7900000, 106.6275000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_BINH_CHANH', 'Cong an Huyen Binh Chanh', 'HCM_BINH_CHANH', 'Huyen Binh Chanh, TP. Ho Chi Minh', 10.6956000, 106.5936000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_CAN_GIO', 'Cong an Huyen Can Gio', 'HCM_CAN_GIO', 'Huyen Can Gio, TP. Ho Chi Minh', 10.4114000, 106.9547000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_CU_CHI', 'Cong an Huyen Cu Chi', 'HCM_CU_CHI', 'Huyen Cu Chi, TP. Ho Chi Minh', 10.9736000, 106.4931000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_HOC_MON', 'Cong an Huyen Hoc Mon', 'HCM_HOC_MON', 'Huyen Hoc Mon, TP. Ho Chi Minh', 10.8897000, 106.5957000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_NHA_BE', 'Cong an Huyen Nha Be', 'HCM_NHA_BE', 'Huyen Nha Be, TP. Ho Chi Minh', 10.6953000, 106.7403000, 'DISTRICT_POLICE' UNION ALL
  SELECT 'PU_HCM_113', 'Trung tam 113 TP. Ho Chi Minh', 'HCM', 'TP. Ho Chi Minh', 10.7769000, 106.7009000, 'EMERGENCY_CENTER'
) units ON units.area_code = a.code
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  area_id = VALUES(area_id),
  address = VALUES(address),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  unit_type = VALUES(unit_type),
  is_active = VALUES(is_active);

INSERT INTO officer (user_id, unit_id, badge_number, rank_name, officer_status)
SELECT u.id, p.id, badge_number, rank_name, 'ACTIVE'
FROM crime_auth.users u
JOIN (
  SELECT 'officer_hcm_thuduc' username, 'PU_HCM_TP_THU_DUC' unit_code, 'HCM-TD-001' badge_number, 'Dai uy' rank_name UNION ALL
  SELECT 'officer_hcm_q1', 'PU_HCM_Q1', 'HCM-Q1-001', 'Dai uy' UNION ALL
  SELECT 'officer_hcm_q3', 'PU_HCM_Q3', 'HCM-Q3-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_q4', 'PU_HCM_Q4', 'HCM-Q4-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_q5', 'PU_HCM_Q5', 'HCM-Q5-001', 'Trung uy' UNION ALL
  SELECT 'officer_hcm_q6', 'PU_HCM_Q6', 'HCM-Q6-001', 'Trung uy' UNION ALL
  SELECT 'officer_hcm_q7', 'PU_HCM_Q7', 'HCM-Q7-001', 'Dai uy' UNION ALL
  SELECT 'officer_hcm_q8', 'PU_HCM_Q8', 'HCM-Q8-001', 'Trung uy' UNION ALL
  SELECT 'officer_hcm_q10', 'PU_HCM_Q10', 'HCM-Q10-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_q11', 'PU_HCM_Q11', 'HCM-Q11-001', 'Trung uy' UNION ALL
  SELECT 'officer_hcm_q12', 'PU_HCM_Q12', 'HCM-Q12-001', 'Dai uy' UNION ALL
  SELECT 'officer_hcm_binh_tan', 'PU_HCM_BINH_TAN', 'HCM-BTAN-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_binh_thanh', 'PU_HCM_BINH_THANH', 'HCM-BTH-001', 'Dai uy' UNION ALL
  SELECT 'officer_hcm_go_vap', 'PU_HCM_GO_VAP', 'HCM-GV-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_phu_nhuan', 'PU_HCM_PHU_NHUAN', 'HCM-PN-001', 'Trung uy' UNION ALL
  SELECT 'officer_hcm_tan_binh', 'PU_HCM_TAN_BINH', 'HCM-TB-001', 'Dai uy' UNION ALL
  SELECT 'officer_hcm_tan_phu', 'PU_HCM_TAN_PHU', 'HCM-TP-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_binh_chanh', 'PU_HCM_BINH_CHANH', 'HCM-BC-001', 'Dai uy' UNION ALL
  SELECT 'officer_hcm_can_gio', 'PU_HCM_CAN_GIO', 'HCM-CG-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_cu_chi', 'PU_HCM_CU_CHI', 'HCM-CC-001', 'Dai uy' UNION ALL
  SELECT 'officer_hcm_hoc_mon', 'PU_HCM_HOC_MON', 'HCM-HM-001', 'Trung uy' UNION ALL
  SELECT 'officer_hcm_nha_be', 'PU_HCM_NHA_BE', 'HCM-NB-001', 'Thuong uy' UNION ALL
  SELECT 'officer_hcm_113', 'PU_HCM_113', 'HCM-113-001', 'Dai uy'
) seed ON seed.username = u.username
JOIN police_unit p ON p.code = seed.unit_code
ON DUPLICATE KEY UPDATE
  unit_id = VALUES(unit_id),
  badge_number = VALUES(badge_number),
  rank_name = VALUES(rank_name),
  officer_status = VALUES(officer_status);

INSERT INTO duty_shift (code, name, start_at, end_at, shift_status)
VALUES (
  'SHIFT_HCM_DEMO_ACTIVE',
  'Ca truc demo TP. Ho Chi Minh',
  CURRENT_TIMESTAMP(6) - INTERVAL 1 DAY,
  CURRENT_TIMESTAMP(6) + INTERVAL 30 DAY,
  'ACTIVE'
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  start_at = VALUES(start_at),
  end_at = VALUES(end_at),
  shift_status = VALUES(shift_status);

INSERT INTO duty_assignment (shift_id, officer_id, availability_status, current_case_id, note)
SELECT s.id, o.id, 'AVAILABLE', NULL, 'Demo HCMC: officer available for smart dispatch'
FROM duty_shift s
JOIN officer o ON o.badge_number IN (
  'CB001',
  'CH001',
  'HCM-TD-001',
  'HCM-Q1-001',
  'HCM-Q3-001',
  'HCM-Q4-001',
  'HCM-Q5-001',
  'HCM-Q6-001',
  'HCM-Q7-001',
  'HCM-Q8-001',
  'HCM-Q10-001',
  'HCM-Q11-001',
  'HCM-Q12-001',
  'HCM-BTAN-001',
  'HCM-BTH-001',
  'HCM-GV-001',
  'HCM-PN-001',
  'HCM-TB-001',
  'HCM-TP-001',
  'HCM-BC-001',
  'HCM-CG-001',
  'HCM-CC-001',
  'HCM-HM-001',
  'HCM-NB-001',
  'HCM-113-001'
)
WHERE s.code = 'SHIFT_HCM_DEMO_ACTIVE'
ON DUPLICATE KEY UPDATE
  availability_status = VALUES(availability_status),
  current_case_id = VALUES(current_case_id),
  note = VALUES(note),
  last_status_at = CURRENT_TIMESTAMP(6);

-- Dashboard analytics data. Counts for the six completed months are
-- 9, 11, 10, 13, 15, 18. The small dip avoids an artificial perfectly
-- straight line while still producing a believable upward forecast.
-- Seven additional reports are placed in the current week; monthly analytics
-- intentionally ignores them until the current month has completed.
USE crime_report;

DROP TEMPORARY TABLE IF EXISTS demo_month_plan;
CREATE TEMPORARY TABLE demo_month_plan (
  months_ago INT NOT NULL PRIMARY KEY,
  report_count INT NOT NULL
);

INSERT INTO demo_month_plan (months_ago, report_count)
VALUES (6, 9), (5, 11), (4, 10), (3, 13), (2, 15), (1, 18), (0, 7);

DROP TEMPORARY TABLE IF EXISTS demo_sequence;
CREATE TEMPORARY TABLE demo_sequence (sequence_no INT NOT NULL PRIMARY KEY);

INSERT INTO demo_sequence (sequence_no)
VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9),
       (10), (11), (12), (13), (14), (15), (16), (17), (18);

INSERT INTO case_report (
  tracking_code,
  crime_type_id,
  description,
  incident_time,
  is_happening_now,
  has_weapon,
  has_injured_person,
  latitude,
  longitude,
  address_text,
  urgency_score,
  urgency_level,
  status,
  spam_score,
  spam_level,
  spam_reasons,
  fake_score,
  ai_confidence,
  ai_decision,
  spam_detection_source,
  version,
  created_at,
  updated_at
)
SELECT
  CONCAT('DEMO-TREND-M', LPAD(p.months_ago, 2, '0'), '-', LPAD(s.sequence_no, 2, '0')),
  ct.id,
  CASE MOD(s.sequence_no, 6)
    WHEN 0 THEN 'Phat hien dau hieu lua dao chuyen khoan qua mang xa hoi.'
    WHEN 1 THEN 'Trinh bao vu trom cap tai san tai khu dan cu.'
    WHEN 2 THEN 'Phan anh doi tuong cuop giat tai san tren duong.'
    WHEN 3 THEN 'Phat hien nhom nguoi gay roi trat tu cong cong.'
    WHEN 4 THEN 'Trinh bao hanh vi lua dao chiem doat tai san.'
    ELSE 'Phat hien dau hieu tang tru trai phep chat ma tuy.'
  END,
  TIMESTAMPADD(HOUR, -1, CASE
    WHEN p.months_ago = 0 THEN TIMESTAMPADD(DAY, 1 - s.sequence_no, CURRENT_TIMESTAMP)
    ELSE TIMESTAMPADD(HOUR, 8 + MOD(s.sequence_no * 3, 12), TIMESTAMPADD(DAY, s.sequence_no, TIMESTAMPADD(MONTH, -p.months_ago, CAST(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AS DATE))))
  END),
  IF(p.months_ago = 0 AND s.sequence_no <= 2, TRUE, FALSE),
  IF(MOD(s.sequence_no, 9) = 0, TRUE, FALSE),
  IF(MOD(s.sequence_no, 7) = 0, TRUE, FALSE),
  10.7244000 + MOD(s.sequence_no * 17 + p.months_ago * 3, 145) / 1000,
  106.6038000 + MOD(s.sequence_no * 23 + p.months_ago * 5, 165) / 1000,
  CASE MOD(s.sequence_no, 6)
    WHEN 0 THEN 'Quan 1, TP. Ho Chi Minh'
    WHEN 1 THEN 'Quan Binh Thanh, TP. Ho Chi Minh'
    WHEN 2 THEN 'Quan Tan Binh, TP. Ho Chi Minh'
    WHEN 3 THEN 'Quan Go Vap, TP. Ho Chi Minh'
    WHEN 4 THEN 'Thanh pho Thu Duc, TP. Ho Chi Minh'
    ELSE 'Quan 7, TP. Ho Chi Minh'
  END,
  CASE
    WHEN MOD(s.sequence_no, 9) = 0 THEN 82
    WHEN MOD(s.sequence_no, 4) = 0 THEN 64
    WHEN MOD(s.sequence_no, 2) = 0 THEN 43
    ELSE 24
  END,
  CASE
    WHEN MOD(s.sequence_no, 9) = 0 THEN 'CRITICAL'
    WHEN MOD(s.sequence_no, 4) = 0 THEN 'HIGH'
    WHEN MOD(s.sequence_no, 2) = 0 THEN 'MEDIUM'
    ELSE 'LOW'
  END,
  CASE
    WHEN p.months_ago = 0 THEN
      CASE
        WHEN s.sequence_no <= 2 THEN 'NEW_RECEIVED'
        WHEN s.sequence_no <= 5 THEN 'UNDER_VERIFICATION'
        WHEN s.sequence_no = 6 THEN 'TRANSFERRED_TO_INVESTIGATION'
        ELSE 'RESOLVED'
      END
    WHEN MOD(s.sequence_no, 11) = 0 THEN 'SPAM_OR_FAKE'
    WHEN MOD(s.sequence_no, 3) = 0 THEN 'TRANSFERRED_TO_INVESTIGATION'
    ELSE 'RESOLVED'
  END,
  IF(p.months_ago > 0 AND MOD(s.sequence_no, 11) = 0, 85, 0),
  IF(p.months_ago > 0 AND MOD(s.sequence_no, 11) = 0, 'HIGH', 'NONE'),
  IF(p.months_ago > 0 AND MOD(s.sequence_no, 11) = 0, 'Noi dung lap lai va thieu thong tin xac minh', NULL),
  IF(p.months_ago > 0 AND MOD(s.sequence_no, 11) = 0, 80, 0),
  0,
  NULL,
  'RULE_BASED',
  0,
  CASE
    WHEN p.months_ago = 0 THEN TIMESTAMPADD(DAY, 1 - s.sequence_no, CURRENT_TIMESTAMP)
    ELSE TIMESTAMPADD(HOUR, 8 + MOD(s.sequence_no * 3, 12), TIMESTAMPADD(DAY, s.sequence_no, TIMESTAMPADD(MONTH, -p.months_ago, CAST(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AS DATE))))
  END,
  CASE
    WHEN p.months_ago = 0 THEN TIMESTAMPADD(DAY, 1 - s.sequence_no, CURRENT_TIMESTAMP)
    ELSE TIMESTAMPADD(HOUR, 8 + MOD(s.sequence_no * 3, 12), TIMESTAMPADD(DAY, s.sequence_no, TIMESTAMPADD(MONTH, -p.months_ago, CAST(DATE_FORMAT(CURRENT_DATE, '%Y-%m-01') AS DATE))))
  END
FROM demo_month_plan p
JOIN demo_sequence s ON s.sequence_no <= p.report_count
JOIN crime_type ct ON ct.code = CASE MOD(s.sequence_no, 6)
  WHEN 0 THEN 'ONLINE_SCAM'
  WHEN 1 THEN 'THEFT'
  WHEN 2 THEN 'ROBBERY'
  WHEN 3 THEN 'PUBLIC_DISTURBANCE'
  WHEN 4 THEN 'FRAUD'
  ELSE 'DRUG_POSSESSION'
END
ON DUPLICATE KEY UPDATE
  crime_type_id = VALUES(crime_type_id),
  description = VALUES(description),
  incident_time = VALUES(incident_time),
  is_happening_now = VALUES(is_happening_now),
  has_weapon = VALUES(has_weapon),
  has_injured_person = VALUES(has_injured_person),
  latitude = VALUES(latitude),
  longitude = VALUES(longitude),
  address_text = VALUES(address_text),
  urgency_score = VALUES(urgency_score),
  urgency_level = VALUES(urgency_level),
  status = VALUES(status),
  spam_score = VALUES(spam_score),
  spam_level = VALUES(spam_level),
  spam_reasons = VALUES(spam_reasons),
  fake_score = VALUES(fake_score),
  created_at = VALUES(created_at),
  updated_at = VALUES(updated_at);

DROP TEMPORARY TABLE demo_sequence;
DROP TEMPORARY TABLE demo_month_plan;
