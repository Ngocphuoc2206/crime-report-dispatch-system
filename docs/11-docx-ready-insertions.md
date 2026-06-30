# Nội dung sẵn sàng bổ sung vào báo cáo DOCX

Các đoạn dưới đây có thể đưa vào file `bao-cao-mini-project.docx` để hoàn thiện phần còn thiếu.

## 1. Bổ sung vào mục 3.1 - Kết quả triển khai

Hệ thống đã triển khai đầy đủ luồng lõi từ tiếp nhận tin báo công khai đến điều phối và xử lý nội bộ. Người dân có thể gửi tin báo kèm thông tin vụ việc, tọa độ hiện trường và bằng chứng dạng ảnh/video/audio. Sau khi tiếp nhận, hệ thống sinh mã tra cứu `trackingCode`, mã hóa thông tin định danh người tố giác, tính điểm nguy cấp và thực hiện smart dispatch dựa trên vị trí vụ việc cùng dữ liệu đơn vị/cán bộ trực ban.

Đối với khối nghiệp vụ nội bộ, cán bộ có thể xem danh sách tin báo được giao, mở chi tiết hồ sơ, nhận xử lý, tạo khóa hồ sơ tạm thời và cập nhật trạng thái theo state machine. Điều phối viên có thể xem danh sách tin báo chờ điều phối, danh sách task, cán bộ khả dụng, bản đồ đơn vị/case và thực hiện điều phối lại khi cần. Chỉ huy có dashboard tổng quan, timeline và heatmap để theo dõi tình hình tin báo theo thời gian và khu vực. Admin có thể quản lý user, role, danh mục tội phạm, rule tính điểm nguy cấp, đơn vị công an và hồ sơ cán bộ.

## 2. Bổ sung vào mục 3.2 - Kiểm thử luồng nghiệp vụ

| STT | Kịch bản kiểm thử | Kết quả mong đợi | Trạng thái |
|---:|---|---|---|
| 1 | Khởi động hệ thống bằng Docker Compose | Các service backend, gateway và MariaDB chạy thành công | Đạt |
| 2 | Người dân tải danh mục loại tội phạm | API trả danh sách crime type đang active | Đạt |
| 3 | Người dân gửi tin báo không kèm file | Hệ thống trả `trackingCode`, trạng thái `NEW_RECEIVED` | Đạt |
| 4 | Người dân gửi tin báo kèm ảnh/video/audio | Evidence-service lưu file và metadata | Đạt |
| 5 | Hệ thống tính điểm nguy cấp | Trả `urgencyScore` và `urgencyLevel` đúng theo rule | Đạt |
| 6 | Smart dispatch với dữ liệu TP.HCM đã seed | Case được gán `assignedUnitId`, `assignedOfficerId` nếu có cán bộ AVAILABLE | Đạt |
| 7 | Officer nhận xử lý case | Case chuyển sang `UNDER_VERIFICATION`, tạo case lock | Đạt |
| 8 | Dispatcher xem pending/task/map | API dispatch trả dữ liệu pending cases, tasks, units và cases trên bản đồ | Đạt |
| 9 | Commander xem dashboard | Overview, timeline và heatmap trả dữ liệu thống kê | Đạt |
| 10 | Admin quản lý dữ liệu nền | Tạo/cập nhật user, crime type, urgency rule, police unit, officer | Đạt |

## 3. Bổ sung vào mục hướng dẫn demo

Trước khi demo luồng smart dispatch, cần chuẩn bị dữ liệu địa bàn, đơn vị công an, cán bộ, ca trực và phân công trực ban. Project cung cấp file seed demo TP.HCM tại `docs/demo-hcm-dispatch-seed.sql`. File này tạo các đơn vị công an theo khu vực TP.HCM, tài khoản officer demo, một ca trực đang active và các duty assignment ở trạng thái `AVAILABLE`.

Command chạy seed:

```powershell
Get-Content docs\demo-hcm-dispatch-seed.sql | docker exec -i crime-report-mariadb mariadb -ucrime_user -pcrime_password
```

Tài khoản officer demo:

| Username | Password | Đơn vị |
|---|---|---|
| officer_hcm_q1 | officer123 | Công an Quận 1 |
| officer_hcm_q3 | officer123 | Công an Quận 3 |
| officer_hcm_binh_thanh | officer123 | Công an Quận Bình Thạnh |
| officer_hcm_tan_binh | officer123 | Công an Quận Tân Bình |
| officer_hcm_113 | officer123 | Trung tâm 113 TP.HCM |

Tọa độ gợi ý khi demo:

| Khu vực | Latitude | Longitude |
|---|---:|---:|
| Quận 1 / Bến Thành | 10.7769000 | 106.7009000 |
| Thành phố Thủ Đức | 10.8490000 | 106.7698000 |
| Quận 7 | 10.7380000 | 106.7219000 |
| Tân Bình | 10.8017000 | 106.6520000 |
| Củ Chi | 10.9736000 | 106.4931000 |

## 4. Bổ sung vào mục 3.4 - Rủi ro kỹ thuật và hướng xử lý

| Rủi ro | Ảnh hưởng | Hướng xử lý |
|---|---|---|
| Thiếu dữ liệu ca trực hoặc officer AVAILABLE | Smart dispatch không tìm được cán bộ phù hợp | Seed dữ liệu demo hoặc bổ sung màn hình quản lý ca trực |
| Evidence file dung lượng lớn | Tăng thời gian upload và dung lượng lưu trữ | Giới hạn kích thước file, kiểm tra MIME type, chuyển sang MinIO/S3 ở bản mở rộng |
| Truy cập danh tính người tố giác | Rủi ro lộ dữ liệu nhạy cảm | Tách API giải mã riêng, chỉ cho Commander/Admin, bắt buộc audit log |
| Race condition khi nhiều cán bộ xử lý cùng case | Trùng thao tác nhận xử lý hoặc điều phối | Dùng case lock, optimistic locking và kiểm tra trạng thái trước khi cập nhật |
| Dashboard analytics chưa có forecasting | Chưa hỗ trợ dự báo xu hướng dài hạn | Bổ sung pipeline thống kê/ML ở giai đoạn sau |

## 5. Bổ sung vào mục 4.2 - Hướng phát triển tương lai

Trong giai đoạn tiếp theo, hệ thống có thể mở rộng các chức năng nâng cao như AI summary để tóm tắt nội dung trình báo, AI spam detection để gợi ý tin báo có dấu hiệu giả mạo, forecasting để dự báo xu hướng tội phạm theo khu vực/thời gian, live stream hoặc chat evidence để người dân bổ sung bằng chứng trong quá trình xử lý. Các chức năng này nên được triển khai sau khi luồng lõi tiếp nhận, mã hóa, tính điểm nguy cấp, điều phối và dashboard đã ổn định.

Ngoài ra, hệ thống nên bổ sung API giải mã danh tính người tố giác có kiểm soát, yêu cầu quyền Commander/Admin, ghi audit log đầy đủ và chỉ hiển thị khi có lý do nghiệp vụ hợp lệ. Phần lưu trữ bằng chứng cũng có thể được nâng cấp từ local volume sang object storage như MinIO/S3 để tăng khả năng mở rộng và quản lý vòng đời dữ liệu.

