# Crime Report Dispatch Backend

Backend is organized as Maven multi-module services:

```text
backend/
├── api-gateway/
├── auth-service/
├── report-service/
├── evidence-service/
├── urgency-service/
├── dispatch-service/
└── docker-compose.yml
```

## Ports

| Service | Port |
| --- | --- |
| api-gateway | 8080 |
| auth-service | 8081 |
| report-service | 8082 |
| evidence-service | 8083 |
| urgency-service | 8084 |
| dispatch-service | 8085 |
| MariaDB | 3306 |

## Gateway Routes

| Gateway path | Target service |
| --- | --- |
| `/api/auth/**` | auth-service |
| `/api/admin/users/**` | auth-service |
| `/api/public/reports/**` | report-service |
| `/api/public/crime-types` | report-service |
| `/api/officer/cases/**` | report-service |
| `/api/commander/dashboard/**` | report-service |
| `/api/admin/crime-types/**` | report-service |
| `/api/officer/evidences/**` | evidence-service |
| `/api/urgency/**` | urgency-service |
| `/api/admin/urgency-rules/**` | urgency-service |
| `/api/dispatch/**` | dispatch-service |
| `/api/admin/officers/**` | dispatch-service |

## Run Locally

From this folder:

```powershell
docker compose up -d --build
```

If you already created a MariaDB volume before this split, Docker will not rerun `docker/mariadb/init/01-create-databases.sql`. Either create the databases manually or recreate the `backend_mariadb_data` volume if you do not need old data.

## Build

```powershell
.\mvnw.cmd test
```

To build a single service:

```powershell
.\mvnw.cmd -pl auth-service -am test
```
