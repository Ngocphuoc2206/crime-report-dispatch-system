# Crime Report Dispatch System

Hệ thống tiếp nhận và điều phối thông tin tố giác tội phạm, gồm frontend Next.js và backend Spring Boot microservices.

## Yêu cầu

- Docker Desktop hoặc Docker Engine có Docker Compose.
- Node.js chỉ cần thiết nếu chạy frontend ở chế độ dev ngoài Docker.
- JDK 21 và Maven wrapper chỉ cần thiết nếu chạy backend ở chế độ dev ngoài Docker.

## Chạy toàn bộ hệ thống bằng Docker

Tại thư mục gốc của dự án:

```powershell
docker compose up --build
```

Chạy nền:

```powershell
docker compose up -d --build
```

Sau khi các container khởi động xong:

| Thành phần | URL / Port |
| --- | --- |
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| MariaDB | localhost:3306 |

Các backend service nội bộ:

| Service | Port nội bộ |
| --- | --- |
| auth-service | 8081 |
| report-service | 8082 |
| evidence-service | 8083 |
| urgency-service | 8084 |
| dispatch-service | 8085 |

## Cấu hình môi trường

Frontend mặc định gọi API qua:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

Nếu cần đổi API base URL khi build Docker:

```powershell
$env:NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
docker compose up -d --build
```

Tính năng AI spam detection mặc định đang tắt. Nếu muốn bật:

```powershell
$env:AI_SPAM_DETECTION_ENABLED="true"
$env:OPENAI_API_KEY="your_api_key"
$env:OPENAI_MODEL="gpt-4.1"
docker compose up -d --build
```

## Database

MariaDB dùng các thông tin mặc định trong `docker-compose.yml`:

```text
MARIADB_USER=crime_user
MARIADB_PASSWORD=crime_password
MARIADB_ROOT_PASSWORD=root_password
```

File khởi tạo database nằm tại:

```text
backend/docker/mariadb/init/01-create-databases.sql
```

Lưu ý: script init của MariaDB chỉ chạy khi volume database được tạo lần đầu. Nếu đã có volume cũ và muốn tạo lại database từ đầu:

```powershell
docker compose down -v
docker compose up -d --build
```

Lệnh `down -v` sẽ xóa dữ liệu trong volume MariaDB và evidence uploads.

## Lệnh Docker thường dùng

Xem log toàn bộ hệ thống:

```powershell
docker compose logs -f
```

Xem log một service:

```powershell
docker compose logs -f api-gateway
docker compose logs -f frontend
```

Dừng container nhưng giữ dữ liệu:

```powershell
docker compose down
```

Build riêng frontend:

```powershell
docker compose build frontend
```

Build riêng một backend service:

```powershell
docker compose build api-gateway
```

## Chạy frontend ở chế độ dev

```powershell
cd frontend
npm install
npm run dev
```

Frontend dev chạy tại:

```text
http://localhost:3000
```

Nếu backend chạy qua Docker, giữ API base URL là:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Chạy backend riêng

Backend là Maven multi-module project trong thư mục `backend/`.

Chạy test toàn bộ backend:

```powershell
cd backend
.\mvnw.cmd test
```

Build hoặc test một service:

```powershell
cd backend
.\mvnw.cmd -pl auth-service -am test
```

## Cấu trúc chính

```text
.
+-- backend/
|   +-- api-gateway/
|   +-- auth-service/
|   +-- report-service/
|   +-- evidence-service/
|   +-- urgency-service/
|   +-- dispatch-service/
+-- frontend/
|   +-- Dockerfile
|   +-- src/
+-- docker-compose.yml
```
