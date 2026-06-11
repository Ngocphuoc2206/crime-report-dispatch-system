# 01. Project Scope

## 1. Tên đề tài

Hệ thống Tiếp nhận và Điều phối Thông tin Tố giác Tội phạm

---

## 2. Mục tiêu của hệ thống

Hệ thống được xây dựng nhằm hỗ trợ tiếp nhận, quản lý và điều phối thông tin tố giác tội phạm từ người dân đến đúng đơn vị hoặc cán bộ có thẩm quyền xử lý.

Hệ thống tập trung vào các mục tiêu chính:

- Cho phép người dân gửi tin báo tội phạm kèm bằng chứng như hình ảnh, video hoặc ghi âm.
- Bảo vệ thông tin định danh của người tố giác bằng cơ chế mã hóa.
- Tự động tính điểm nguy cấp của tin báo dựa trên các tiêu chí nghiệp vụ.
- Tự động điều phối tin báo đến đơn vị hoặc cán bộ phù hợp theo địa bàn, ca trực và mức độ nguy cấp.
- Cho phép cán bộ trực ban tiếp nhận, khóa hồ sơ và cập nhật trạng thái xử lý.
- Cho phép chỉ huy theo dõi tình hình tin báo thông qua dashboard tổng quan.

---

## 3. Phạm vi MVP

Phiên bản MVP tập trung vào một luồng nghiệp vụ chính từ lúc người dân gửi tin báo cho đến khi cán bộ trực ban tiếp nhận và chuyển trạng thái xử lý.

Luồng MVP:

1. Người dân gửi tin báo tội phạm.
2. Người dân đính kèm bằng chứng như hình ảnh hoặc video.
3. Hệ thống mã hóa thông tin định danh người tố giác.
4. Hệ thống tạo mã tra cứu ẩn danh cho người dân.
5. Hệ thống tính điểm nguy cấp của tin báo.
6. Hệ thống xác định địa bàn và đơn vị phù hợp.
7. Hệ thống điều phối tin báo cho cán bộ hoặc đơn vị đang có khả năng tiếp nhận.
8. Cán bộ trực ban đăng nhập vào hệ thống.
9. Cán bộ xem danh sách tin báo được giao.
10. Cán bộ nhận xử lý tin báo.
11. Hệ thống tạo khóa hồ sơ tạm thời để tránh xử lý trùng lặp.
12. Cán bộ chuyển trạng thái tin báo sang “Đang xác minh”.
13. Người dân tra cứu tiến độ xử lý bằng mã tra cứu ẩn danh.

---

## 4. Các chức năng bắt buộc trong MVP

### 4.1. Chức năng dành cho người dân

- Gửi tin báo tội phạm.
- Nhập thông tin mô tả vụ việc.
- Cung cấp vị trí xảy ra vụ việc.
- Đính kèm file bằng chứng.
- Nhập thông tin liên hệ.
- Nhận mã tra cứu ẩn danh sau khi gửi tin báo.
- Tra cứu trạng thái xử lý tin báo bằng mã tra cứu.

### 4.2. Chức năng dành cho cán bộ trực ban

- Đăng nhập vào hệ thống.
- Xem danh sách tin báo thuộc phạm vi xử lý.
- Xem chi tiết tin báo.
- Nhận xử lý tin báo.
- Chuyển trạng thái tin báo sang “Đang xác minh”.
- Xem bằng chứng liên quan đến tin báo.

### 4.3. Chức năng dành cho điều phối viên

- Xem danh sách tin báo chờ điều phối.
- Xem mức độ nguy cấp của từng tin báo.
- Gán tin báo cho đơn vị hoặc cán bộ phù hợp.
- Điều phối lại tin báo khi cần thiết.

### 4.4. Chức năng dành cho chỉ huy

- Xem dashboard tổng quan.
- Xem số lượng tin báo theo trạng thái.
- Xem số lượng tin báo theo mức độ nguy cấp.
- Xem danh sách tin báo mới nhất.
- Xem dữ liệu vị trí tin báo trên bản đồ hoặc dạng thống kê.

### 4.5. Chức năng dành cho quản trị viên

- Quản lý danh mục nhóm loại tội phạm.
- Quản lý loại tội phạm cụ thể.
- Quản lý đơn vị công an.
- Quản lý cán bộ.
- Quản lý rule tính điểm nguy cấp.

---

## 5. Các chức năng chưa làm trong MVP

Để tránh mở rộng phạm vi quá lớn, phiên bản MVP chưa triển khai các chức năng sau:

- Livestream video hiện trường theo thời gian thực.
- Chat realtime giữa người tố giác và điều tra viên.
- Dự báo xu hướng tội phạm bằng mô hình machine learning phức tạp.
- Mobile application riêng.
- Tích hợp bản đồ nâng cao với PostGIS.
- Hệ thống thông báo SMS/Email thực tế.
- Tích hợp với hệ thống nghiệp vụ công an bên ngoài.

Các chức năng này có thể được xem là hướng mở rộng sau khi hệ thống lõi hoạt động ổn định.

---

## 6. Các tính năng điểm cộng có thể phát triển sau MVP

Sau khi hoàn thành luồng chính, hệ thống có thể mở rộng thêm:

- AI summary: tự động tóm tắt nội dung trình báo cho cán bộ.
- AI spam detection: gợi ý tin báo có dấu hiệu giả mạo hoặc spam.
- Crime analytics: thống kê số lượng tin báo theo tháng, quý, địa bàn, loại tội phạm.
- Heatmap: hiển thị mật độ tin báo theo khu vực.
- Chat bổ sung bằng chứng: cho phép người dân gửi thêm hình ảnh/video sau khi đã tạo tin báo.
- Notification: gửi thông báo khi trạng thái tin báo thay đổi.

Trong phạm vi đề tài, ưu tiên triển khai AI summary và dashboard analytics nếu còn thời gian.

---

## 7. Các vai trò trong hệ thống

Hệ thống có các vai trò chính sau:

| Role | Mô tả |
|---|---|
| CITIZEN | Người dân gửi tin báo và tra cứu tiến độ |
| DUTY_OFFICER | Cán bộ trực ban tiếp nhận và xác minh tin báo |
| DISPATCHER | Cán bộ điều phối, gán tin báo cho đơn vị hoặc cán bộ phù hợp |
| COMMANDER | Chỉ huy theo dõi toàn bộ tình hình qua dashboard |
| ADMIN | Quản trị hệ thống, danh mục, người dùng và rule nghiệp vụ |

---

## 8. Phạm vi quyền hạn theo vai trò

| Chức năng | Citizen | Duty Officer | Dispatcher | Commander | Admin |
|---|---:|---:|---:|---:|---:|
| Gửi tin báo | Có | Không | Không | Không | Không |
| Tra cứu tiến độ bằng mã ẩn danh | Có | Không | Không | Không | Không |
| Xem tin báo được giao | Không | Có | Có | Có | Có |
| Nhận xử lý tin báo | Không | Có | Không | Không | Không |
| Cập nhật trạng thái xử lý | Không | Có | Có | Có | Không |
| Điều phối/gán tin báo | Không | Không | Có | Có | Không |
| Xem dashboard tổng quan | Không | Không | Không | Có | Có |
| Quản lý danh mục | Không | Không | Không | Không | Có |
| Quản lý rule tính điểm nguy cấp | Không | Không | Không | Không | Có |

---

## 9. Luồng demo chính

Luồng demo chính của hệ thống:

1. Người dân truy cập trang gửi tin báo.
2. Người dân chọn loại tội phạm là “Cướp giật”.
3. Người dân nhập mô tả vụ việc.
4. Người dân đánh dấu vụ việc đang diễn ra.
5. Người dân đánh dấu có vũ khí.
6. Người dân nhập vị trí xảy ra vụ việc.
7. Người dân upload video bằng chứng.
8. Người dân nhập thông tin liên hệ.
9. Hệ thống tiếp nhận tin báo.
10. Hệ thống mã hóa thông tin người tố giác.
11. Hệ thống sinh mã tra cứu ẩn danh.
12. Hệ thống tính điểm nguy cấp.
13. Hệ thống xác định mức nguy cấp là CRITICAL.
14. Hệ thống tìm đơn vị hoặc cán bộ phù hợp theo địa bàn và ca trực.
15. Hệ thống tạo nhiệm vụ điều phối.
16. Cán bộ trực ban đăng nhập.
17. Cán bộ nhìn thấy tin báo mới được giao.
18. Cán bộ bấm “Nhận xử lý”.
19. Hệ thống khóa hồ sơ tạm thời.
20. Hệ thống chuyển trạng thái tin báo sang “Đang xác minh”.
21. Người dân nhập mã tra cứu và thấy trạng thái “Tin báo đang được xác minh”.

---

## 10. Trạng thái chính của tin báo

Tin báo trong hệ thống có các trạng thái chính:

| Trạng thái | Ý nghĩa |
|---|---|
| NEW_RECEIVED | Tin báo mới được tiếp nhận |
| UNDER_VERIFICATION | Tin báo đang được cán bộ xác minh |
| TRANSFERRED_TO_INVESTIGATION | Tin báo đã được chuyển cơ quan điều tra |
| RESOLVED | Tin báo đã được xử lý |
| SPAM_OR_FAKE | Tin báo giả, spam hoặc không hợp lệ |

Luồng trạng thái cơ bản:

```text
NEW_RECEIVED
→ UNDER_VERIFICATION
→ TRANSFERRED_TO_INVESTIGATION
→ RESOLVED
```

Luồng loại bỏ tin giả:

```text
NEW_RECEIVED
→ SPAM_OR_FAKE
```

Hoặc:

```text
UNDER_VERIFICATION
→ SPAM_OR_FAKE
```

## 11. Công nghệ sử dụng

Backend
- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- MariaDB
- Flyway
- Docker

Frontend
- React hoặc Next.js
- TypeScript
- Axios hoặc Fetch API
- React Router nếu dùng React Vite
- Leaflet cho bản đồ
- Recharts hoặc Chart.js cho biểu đồ

Infrastructure
- Docker
- Docker Compose
- MariaDB
- Redis
- MinIO

## 12. Kiến trúc triển khai

Trong phạm vi hiện tại, backend được tổ chức theo hướng microservice.

Backend được chia thành các service:

- api-gateway
- auth-service
- report-service
- evidence-service
- urgency-service

Vai trò chính:

- api-gateway là điểm vào duy nhất cho frontend và route request đến các service phía sau.
- auth-service quản lý đăng nhập, user, role và JWT.
- report-service quản lý tin báo, danh mục tội phạm và thông tin định danh đã mã hóa.
- evidence-service quản lý metadata và file bằng chứng.
- urgency-service quản lý rule và API tính điểm nguy cấp.

Dữ liệu được tách theo database/schema sở hữu của từng service:

- crime_auth
- crime_report
- crime_evidence
- crime_urgency

## 13. Tiêu chí hoàn thành MVP

MVP được xem là hoàn thành khi đáp ứng được các tiêu chí sau:

- Người dân gửi được tin báo.
- Người dân upload được bằng chứng.
- Hệ thống tạo được mã tra cứu ẩn danh.
- Thông tin người tố giác được mã hóa trong database.
- Tin báo được tính điểm nguy cấp tự động.
- Tin báo được điều phối về đơn vị hoặc cán bộ phù hợp.
- Cán bộ trực ban xem được tin báo được giao.
- Cán bộ nhận xử lý được tin báo.
- Hệ thống khóa hồ sơ khi cán bộ đang xử lý.
- Trạng thái tin báo được cập nhật chính xác.
- Người dân tra cứu được tiến độ xử lý.
- Dashboard hiển thị được thống kê cơ bản.
- Hệ thống chạy được bằng Docker Compose.

## 14. Rủi ro kỹ thuật và hướng xử lý

| Rủi ro | Hướng xử lý |
|---|---|
| Phạm vi đề tài quá rộng | Chỉ tập trung MVP trước, các tính năng nâng cao để sau |
| Upload video nặng | Giới hạn dung lượng file trong MVP |
| Mã hóa dữ liệu sai cách | Tách bảng định danh riêng và dùng AES-GCM |
| Phân quyền phức tạp | Xây dựng permission matrix từ đầu |
| Race condition khi nhiều cán bộ cùng xử lý | Dùng case lock và optimistic locking |
