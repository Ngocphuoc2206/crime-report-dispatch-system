-- V2__create_users_roles_tables.sql
-- Create users, roles, and user_roles schema for Auth & RBAC.

CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                     username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS roles (
                                     id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                     name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
    );

CREATE TABLE IF NOT EXISTS user_roles (
                                          user_id BIGINT NOT NULL,
                                          role_id BIGINT NOT NULL,

                                          PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE CASCADE
    );

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

INSERT IGNORE INTO roles (name, description)
VALUES
    ('DUTY_OFFICER', 'Cán bộ trực ban tiếp nhận và xác minh tin báo'),
    ('DISPATCHER', 'Cán bộ điều phối tin báo cho đơn vị hoặc cán bộ phù hợp'),
    ('COMMANDER', 'Chỉ huy theo dõi toàn hệ thống và dashboard'),
    ('ADMIN', 'Quản trị viên hệ thống')
;

INSERT IGNORE INTO users (username, password_hash, full_name, email, phone, is_active)
VALUES
    ('admin', '{noop}admin123', 'System Administrator', 'admin@example.com', '0900000001', TRUE),
    ('officer01', '{noop}officer123', 'Nguyễn Văn Trực Ban', 'officer01@example.com', '0900000002', TRUE),
    ('dispatcher01', '{noop}dispatcher123', 'Trần Văn Điều Phối', 'dispatcher01@example.com', '0900000003', TRUE),
    ('commander01', '{noop}commander123', 'Lê Văn Chỉ Huy', 'commander01@example.com', '0900000004', TRUE)
;

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
         JOIN roles r ON r.name = 'ADMIN'
WHERE u.username = 'admin';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
         JOIN roles r ON r.name = 'DUTY_OFFICER'
WHERE u.username = 'officer01';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
         JOIN roles r ON r.name = 'DISPATCHER'
WHERE u.username = 'dispatcher01';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
         JOIN roles r ON r.name = 'COMMANDER'
WHERE u.username = 'commander01';
