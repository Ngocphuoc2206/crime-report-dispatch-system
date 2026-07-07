# 12. Swagger / OpenAPI

## 1. Muc dich

Swagger UI duoc dung de tai lieu hoa va kiem thu nhanh REST API cua he thong Crime Report Dispatch System.

He thong la microservice, vi vay moi service backend sinh OpenAPI rieng. Frontend va nguoi dung van goi API qua API Gateway trong luong chuan, nhung khi demo ky thuat co the mo Swagger UI cua tung service de test endpoint truc tiep.

## 2. Cac URL Swagger UI

Sau khi chay backend bang Docker hoac chay tung service local:

| Service | Port | Swagger UI | OpenAPI JSON |
|---|---:|---|---|
| auth-service | 8081 | http://localhost:8081/swagger-ui.html | http://localhost:8081/v3/api-docs |
| report-service | 8082 | http://localhost:8082/swagger-ui.html | http://localhost:8082/v3/api-docs |
| evidence-service | 8083 | http://localhost:8083/swagger-ui.html | http://localhost:8083/v3/api-docs |
| urgency-service | 8084 | http://localhost:8084/swagger-ui.html | http://localhost:8084/v3/api-docs |
| dispatch-service | 8085 | http://localhost:8085/swagger-ui.html | http://localhost:8085/v3/api-docs |

## 3. Xac thuc JWT tren Swagger

1. Mo Swagger UI cua `auth-service`.
2. Goi `POST /api/auth/login`.
3. Copy `accessToken` trong response.
4. Mo Swagger UI cua service can test.
5. Bam nut `Authorize`.
6. Nhap JWT token theo dang:

```text
Bearer <access_token>
```

Neu Swagger UI chi nhan raw token, nhap:

```text
<access_token>
```

## 4. Luong demo de bao cao

### 4.1. Public report

Service: `report-service`

1. `GET /api/public/crime-types`
2. `POST /api/public/reports`
3. Luu `trackingCode`
4. `GET /api/public/reports/{trackingCode}/status`

### 4.2. Evidence

Service: `evidence-service`

1. `POST /api/public/reports/{trackingCode}/evidences`
2. Dang nhap officer/commander
3. `PATCH /api/officer/evidences/{evidenceId}/verification`

### 4.3. Officer workflow

Service: `report-service`

1. `GET /api/officer/cases`
2. `GET /api/officer/cases/{caseId}`
3. `POST /api/officer/cases/{caseId}/lock`
4. `POST /api/officer/cases/{caseId}/accept`
5. `PATCH /api/officer/cases/{caseId}/status`
6. `DELETE /api/officer/cases/{caseId}/lock`

### 4.4. Dispatch workflow

Service: `dispatch-service`

1. `GET /api/dispatch/cases/pending`
2. `GET /api/dispatch/police-units/nearest`
3. `POST /api/dispatch/smart-dispatch`
4. `GET /api/dispatch/tasks`
5. `PATCH /api/dispatch/tasks/{taskId}/status`

### 4.5. Commander dashboard

Service: `report-service`

1. `GET /api/commander/dashboard/overview`
2. `GET /api/commander/dashboard/heatmap`
3. `GET /api/commander/dashboard/timeline`
4. `GET /api/commander/cases`

## 5. Cac nhom API chinh trong Swagger

| Nhom | Y nghia |
|---|---|
| Authentication | Dang nhap va cap JWT token |
| Admin Users | Quan ly tai khoan va role |
| Public Reports | Nguoi dan gui va tra cuu tin bao |
| Officer Cases | Can bo tiep nhan, khoa va xu ly vu viec |
| Case Locks | Khoa chinh sua ho so tranh xu ly dong thoi |
| Evidence | Quan ly va xac minh chung cu |
| Urgency Scoring | Tinh diem/muc do khan cap |
| Dispatch Cases | Hang doi va dieu phoi thu cong |
| Smart Dispatch | Dieu phoi thong minh |
| Dispatch Tasks | Vong doi nhiem vu dieu phoi |
| Commander Dashboard | Tong quan, heatmap va timeline |

## 6. Kiem tra build

Lenh kiem tra backend:

```powershell
cd backend
mvn test
```

Neu Maven wrapper hoat dong tren may cua ban, co the dung:

```powershell
cd backend
.\mvnw.cmd test
```
