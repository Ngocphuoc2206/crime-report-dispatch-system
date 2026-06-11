CREATE DATABASE IF NOT EXISTS crime_auth CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS crime_report CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS crime_evidence CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS crime_urgency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS crime_dispatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


GRANT ALL PRIVILEGES ON crime_auth.* TO 'crime_user'@'%';
GRANT ALL PRIVILEGES ON crime_report.* TO 'crime_user'@'%';
GRANT ALL PRIVILEGES ON crime_evidence.* TO 'crime_user'@'%';
GRANT ALL PRIVILEGES ON crime_urgency.* TO 'crime_user'@'%';
GRANT ALL PRIVILEGES ON crime_dispatch.* TO 'crime_user'@'%';
FLUSH PRIVILEGES;
