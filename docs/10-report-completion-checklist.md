# Report completion checklist

Tài liệu này dùng để đối chiếu trước khi nộp báo cáo mini-project.

## 1. Phần đã đủ để đưa vào báo cáo

| Nhóm nội dung | Trạng thái | Ghi chú |
|---|---|---|
| Kiến trúc microservice | Đã có | API Gateway, auth/report/evidence/urgency/dispatch service, MariaDB schema riêng |
| ERD | Đã có | Có thể dùng PlantUML trong `docs/plantuml/03-erd.puml` |
| State machine tin báo | Đã có | `NEW_RECEIVED`, `UNDER_VERIFICATION`, `TRANSFERRED_TO_INVESTIGATION`, `RESOLVED`, `SPAM_OR_FAKE` |
| Public report | Đã có | Gửi tin báo, tracking code, upload evidence ảnh/video/audio |
| Mã hóa danh tính | Đã có | AES-GCM, lưu ciphertext/IV/key version trong `reporter_identity` |
| Urgency scoring | Đã có | Tính điểm theo loại tội phạm, đang diễn ra, vũ khí, bị thương, video evidence |
| Smart dispatch | Đã có | Cần seed unit/officer/shift/assignment trước khi demo |
| Officer workflow | Đã có | Xem case, accept, lock, update status |
| Dispatcher workflow | Đã có | Pending cases, dispatch, task list, reassign/recall/status, map/dashboard |
| Commander dashboard | Đã có | Overview, timeline, heatmap |
| Admin | Đã có | User, crime type, urgency rule, police unit, officer profile |
| Docker Compose | Đã có | Cần mô tả rõ command chạy và các service/database |

## 2. Phần bắt buộc bổ sung vào DOCX

| Mục | Nội dung cần bổ sung |
|---|---|
| Thông tin sinh viên | Điền email còn thiếu ở trang bìa |
| Hình 3.1 | Ảnh chụp form người dân gửi tin báo và màn hình trả tracking code |
| Hình 3.2 | Ảnh chụp commander dashboard gồm overview/timeline/heatmap |
| Dữ liệu demo TP.HCM | Nêu seed `docs/demo-hcm-dispatch-seed.sql`, tài khoản officer demo và điều kiện `AVAILABLE` |
| API dispatch | Sửa prefix cũ `/api/dispatcher/**` thành `/api/dispatch/**` |
| Kết quả kiểm thử | Thêm bảng test: lint/build/API public report/evidence/dispatch/dashboard/admin |
| Giới hạn hệ thống | Ghi rõ reporter identity decrypt, AI, forecasting, live stream/chat là hướng phát triển nếu chưa demo được |

## 3. Command nên đưa vào phần hướng dẫn demo

```powershell
docker compose up -d --build
Get-Content docs\demo-hcm-dispatch-seed.sql | docker exec -i crime-report-mariadb mariadb -ucrime_user -pcrime_password
```

## 4. Kịch bản demo đề xuất

1. Admin kiểm tra/tạo đơn vị công an và officer.
2. Chạy seed TP.HCM để bảo đảm có ca trực và cán bộ AVAILABLE.
3. Người dân gửi tin báo tại tọa độ Quận 1, kèm ảnh hoặc video bằng chứng.
4. Hệ thống trả `trackingCode`, `urgencyScore`, `urgencyLevel`.
5. Smart dispatch gán case về đơn vị/cán bộ phù hợp.
6. Dispatcher xem pending/task/map và điều phối lại nếu cần.
7. Officer đăng nhập, nhận xử lý case, lock hồ sơ và chuyển trạng thái `UNDER_VERIFICATION`.
8. Commander xem overview, timeline và heatmap.
9. Người dân tra cứu trạng thái bằng tracking code.

## 5. Nội dung không nên ghi là đã hoàn thành

Các mục sau chỉ nên đặt ở phần hướng phát triển nếu chưa có backend/frontend hoàn chỉnh:

- AI summary.
- AI spam/fake report detection.
- Forecasting dự báo xu hướng tội phạm.
- Live stream/chat evidence thời gian thực.
- API giải mã danh tính reporter có kiểm soát và audit đầy đủ.

