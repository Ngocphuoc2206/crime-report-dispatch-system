# 02. Use Cases

## 1. Tổng quan

Tài liệu này mô tả các use case chính của hệ thống Tiếp nhận và Điều phối Thông tin Tố giác Tội phạm.

Mục tiêu của tài liệu là xác định rõ các actor, hành động, điều kiện đầu vào, luồng xử lý chính, luồng ngoại lệ và kết quả đầu ra của từng chức năng trong phạm vi MVP.

---

## 2. Danh sách actor

| Actor | Mô tả |
|---|---|
| Citizen | Người dân gửi tin báo và tra cứu tiến độ xử lý |
| Officer | Cán bộ trực ban tiếp nhận và xác minh tin báo |
| Dispatcher | Cán bộ điều phối, gán tin báo cho đơn vị hoặc cán bộ phù hợp |
| Commander | Chỉ huy theo dõi tình hình toàn hệ thống |
| Admin | Quản trị viên quản lý danh mục, người dùng và rule nghiệp vụ |
| System | Các xử lý tự động của hệ thống như mã hóa, tính điểm, điều phối |

---

# UC01 - Người dân gửi tin báo

## 1. Mục tiêu

Cho phép người dân gửi thông tin tố giác tội phạm kèm mô tả, vị trí xảy ra vụ việc, thông tin liên hệ và các tệp bằng chứng như hình ảnh hoặc video.

## 2. Actor chính

Citizen

## 3. Actor liên quan

System

## 4. Tiền điều kiện

- Người dân truy cập được trang gửi tin báo.
- Hệ thống đang hoạt động.
- Danh mục loại tội phạm đã được cấu hình sẵn.

## 5. Dữ liệu đầu vào

| Trường dữ liệu | Bắt buộc | Mô tả |
|---|---:|---|
| crimeTypeId | Có | Loại tội phạm/hành vi vi phạm |
| description | Có | Mô tả nội dung vụ việc |
| incidentTime | Không | Thời điểm xảy ra vụ việc |
| isHappeningNow | Có | Vụ việc đang diễn ra hay đã xảy ra |
| hasWeapon | Có | Có vũ khí hay không |
| hasInjuredPerson | Có | Có người bị thương hay không |
| latitude | Có | Vĩ độ vị trí xảy ra vụ việc |
| longitude | Có | Kinh độ vị trí xảy ra vụ việc |
| addressText | Có | Địa chỉ mô tả |
| reporterFullName | Không | Họ tên người tố giác |
| reporterPhone | Không | Số điện thoại người tố giác |
| reporterEmail | Không | Email người tố giác |
| evidenceFiles | Không | File hình ảnh, video hoặc ghi âm |

## 6. Luồng xử lý chính

1. Người dân mở trang gửi tin báo.
2. Người dân chọn loại tội phạm.
3. Người dân nhập mô tả vụ việc.
4. Người dân nhập hoặc chọn vị trí xảy ra vụ việc.
5. Người dân đánh dấu các tiêu chí nguy cấp như có vũ khí, đang diễn ra, có người bị thương.
6. Người dân nhập thông tin liên hệ nếu muốn.
7. Người dân upload file bằng chứng nếu có.
8. Người dân bấm nút gửi tin báo.
9. Hệ thống kiểm tra dữ liệu đầu vào.
10. Hệ thống tạo hồ sơ tin báo mới.
11. Hệ thống mã hóa thông tin định danh người tố giác.
12. Hệ thống lưu file bằng chứng.
13. Hệ thống sinh mã tra cứu ẩn danh.
14. Hệ thống tính điểm nguy cấp.
15. Hệ thống điều phối tin báo đến đơn vị hoặc cán bộ phù hợp.
16. Hệ thống trả về mã tra cứu cho người dân.

## 7. Luồng ngoại lệ (Exception Handler)

### 7.1. Thiếu dữ liệu bắt buộc

Nếu người dân không nhập mô tả hoặc vị trí, hệ thống trả về thông báo lỗi:

```text
Vui lòng nhập đầy đủ thông tin bắt buộc.
```

### 7.2. File bằng chứng không hợp lệ

Nếu file vượt quá dung lượng cho phép hoặc sai định dạng, hệ thống trả về thông báo lỗi:

```text
File bằng chứng không hợp lệ.
```

### 7.3. Không tìm thấy đơn vị phù hợp

Nếu hệ thống chưa tìm thấy đơn vị phù hợp, tin báo vẫn được tạo với trạng thái mới tiếp nhận và được đưa vào danh sách chờ điều phối thủ công.

## 8. Kết quả đầu ra

Hệ thống trả về:

```response
{
  "trackingCode": "TB-2026-000001",
  "status": "NEW_RECEIVED",
  "urgencyLevel": "CRITICAL",
  "message": "Tin báo đã được tiếp nhận"
}
```

##

# UC02 - Người dân tra cứu tiến độ tin báo

## 1. Mục tiêu

Cho phép người dân tra cứu tiến độ xử lý tin báo bằng mã tra cứu ẩn danh.

## 2. Actor chính

Citizen

## 3. Tiền điều kiện

- Tin báo đã được tạo thành công.
- Người dân có mã tra cứu hợp lệ.

## 4. Dữ liệu đầu vào

| Trường dữ liệu | Bắt buộc | Mô tả |
|---|---:|---|
| trackingCode | Có | Mã tra cứu ẩn danh của tin báo |

## 5. Luồng xử lý chính

1. Người dân mở trang tra cứu tiến độ.
2. Người dân nhập mã tra cứu.
3. Người dân bấm nút tra cứu.
4. Hệ thống kiểm tra mã tra cứu.
5. Hệ thống tìm tin báo tương ứng.
6. Hệ thống trả về trạng thái xử lý rút gọn.

## 6. Luồng ngoại lệ (Exception Handler)

### 6.1. Mã tra cứu không tồn tại

Hệ thống trả về:

```response
Không tìm thấy tin báo tương ứng với mã tra cứu.
```

### 6.2. Mã tra cứu sai định dạng

Hệ thống trả về:

```response
Mã tra cứu không hợp lệ.
```

### 7. Kết quả đầu ra

```response
{
  "trackingCode": "TB-2026-000001",
  "status": "UNDER_VERIFICATION",
  "displayStatus": "Tin báo đang được xác minh"
}
```

### 8. Quy tắc bảo mật

API tra cứu công khai không được trả về:

- Thông tin định danh người tố giác.
- Tên cán bộ xử lý.
- Ghi chú nghiệp vụ nội bộ.
- Thông tin chi tiết về điều phối lực lượng.
- Audit log.
- Lịch sử xử lý nội bộ đầy đủ.

##

# UC03 - Hệ thống mã hóa danh tính người tố giác

## 1. Mục tiêu

Đảm bảo thông tin định danh của người tố giác không được lưu dưới dạng plaintext trong database.

## 2. Actor chính

System

## 3. Tiền điều kiện

- Người dân gửi tin báo thành công.
- Dữ liệu định danh có thể bao gồm họ tên, số điện thoại, email hoặc địa chỉ.

## 4. Dữ liệu đầu vào

| Trường dữ liệu | Mô tả |
|---|---|
| fullName | Họ tên người tố giác |
| phone | Số điện thoại |
| email  | email |
| address  | Địa chỉ liên hệ |

## 5. Luồng xử lý chính

1. Hệ thống nhận dữ liệu định danh từ request gửi tin báo.
2. Hệ thống tạo IV riêng cho bản ghi.
3. Hệ thống mã hóa từng trường dữ liệu nhạy cảm bằng thuật toán AES-GCM.
4. Hệ thống lưu dữ liệu đã mã hóa vào bảng reporter_identity.
5. Hệ thống liên kết reporter_identity với case_report.
6. Hệ thống không trả dữ liệu định danh trong response public.

## 6. Kết quả đầu ra
- Dữ liệu định danh được lưu ở dạng mã hóa.
- Bảng case_report không chứa trực tiếp thông tin định danh.
- Bảng reporter_identity chứa dữ liệu đã mã hóa.

## 7. Quy tắc bảo mật
- Không log thông tin định danh ra console.
- Không trả dữ liệu định danh trong API public.
- Chỉ role có quyền đặc biệt mới được truy cập dữ liệu đã giải mã.
- Mọi thao tác xem dữ liệu định danh phải được ghi audit log.

##

# UC04 - Hệ thống tính điểm nguy cấp

## 1. Mục tiêu

Tự động tính điểm nguy cấp của tin báo dựa trên các tiêu chí nghiệp vụ.

## 2. Actor chính

System

## 3. Tiền điều kiện

- Tin báo đã được gửi thành công.
- Hệ thống đã có cấu hình rule tính điểm nguy cấp.

## 4. Dữ liệu đầu vào

| Tiêu chí | Ví dụ |
|---|---|
| Loại tội phạm | Cướp giật |
| Đang diễn ra | Có |
| Có vũ khí | Có |
| Có người bị thương  | Không |
| Có bằng chứng video  | Có |

## 5. Luồng xử lý chính

1. Hệ thống lấy thông tin tin báo.
2. Hệ thống lấy danh sách rule tính điểm đang active.
3. Hệ thống kiểm tra từng rule với dữ liệu tin báo.
4. Nếu rule phù hợp, hệ thống cộng điểm tương ứng.5
5. Hệ thống tính tổng điểm nguy cấp.
6. Hệ thống phân loại mức nguy cấp.
7. Hệ thống lưu urgency_score và urgency_level vào case_report.

## 6. Ví dụ rule

| Điều kiện | Điểm |
|---|---|
| Loại tội phạm là cướp giật | +30 |
| Vụ việc đang diễn ra | +30 |
| Có vũ khí | +40 |
| Có người bị thương  | +30 |
| Có video bằng chứng  | +10 |

## 7. Ví dụ kết quả

```text
Loại tội phạm cướp giật: +30
Đang diễn ra: +30
Có vũ khí: +40
Có video: +10

Tổng điểm: 110
Mức nguy cấp: CRITICAL
```

## 8. Quy tắc phân loại

| Điểm | Mức nguy cấp |
|---|---|
| 0 - 30 | LOW |
| 31 - 60 | MEDIUM |
| 61 - 80 | HIGH |
| Trên 80 | CRITICAL |

## 9. Kết quả đầu ra

```response
{
  "urgencyScore": 110,
  "urgencyLevel": "CRITICAL"
}
```

##

# UC05 - Hệ thống điều phối tin báo

## 1. Mục tiêu

Tự động điều phối tin báo đến đơn vị hoặc cán bộ phù hợp dựa trên địa bàn, khoảng cách địa lý, ca trực và mức độ nguy cấp.

## 2. Actor chính

System

## 3. Actor liên quan

Dispatcher, Officer

## 4. Tiền điều kiện

- Tin báo đã được tạo.
- Tin báo đã có vị trí địa lý.
- Tin báo đã được tính điểm nguy cấp.
- Hệ thống đã có dữ liệu đơn vị công an, cán bộ và ca trực.

## 5. Dữ liệu đầu vào

| Dữ liệu | Mô tả |
|---|---|
| caseId | Mã hồ sơ tin báo |
| latitude | Vĩ độ nơi xảy ra vụ việc |
| longitude | Kinh độ nơi xảy ra vụ việc |
| urgencyLevel | Mức nguy cấp |
| crimeType | Loại tội phạm |
| dutyAssignments | Danh sách cán bộ/tổ công tác đang trực |

## 6. Luồng xử lý chính
1. Hệ thống lấy thông tin vị trí của tin báo.
2. Hệ thống lấy danh sách đơn vị công an đang hoạt động.
3. Hệ thống tính khoảng cách từ vị trí vụ việc đến từng đơn vị.
4. Hệ thống chọn đơn vị gần nhất hoặc đơn vị phụ trách địa bàn.
5. Hệ thống kiểm tra ca trực hiện tại của đơn vị đó.
6. Hệ thống tìm cán bộ hoặc tổ công tác đang AVAILABLE.
7. Nếu mức nguy cấp là CRITICAL, hệ thống ưu tiên đơn vị gần nhất có khả năng tiếp nhận.
8. Hệ thống tạo dispatch_task.
9. Hệ thống cập nhật assigned_unit_id và assigned_officer_id vào case_report.
10. Hệ thống ghi audit log cho hành động điều phối.

## 7. Luồng ngoại lệ (Exception Handler)

## 7.1. Không có cán bộ rảnh

Nếu không có cán bộ rảnh, hệ thống vẫn gán tin báo về đơn vị phụ trách và đặt dispatch_status là WAITING_ASSIGNMENT.

## 7.2. Không xác định được vị trí

Nếu không có tọa độ hợp lệ, hệ thống đưa tin báo vào danh sách chờ điều phối thủ công.

## 7.3. Có nhiều đơn vị phù hợp

Hệ thống ưu tiên theo thứ tự:

- Đơn vị phụ trách địa bàn.
- Đơn vị gần nhất.
- Đơn vị có cán bộ trực AVAILABLE.
- Đơn vị có số lượng case đang xử lý thấp hơn.

## 8. Kết quả đầu ra

```response
{
  "caseId": 1,
  "assignedUnitId": 3,
  "assignedOfficerId": 8,
  "distanceKm": 1.2,
  "dispatchStatus": "ASSIGNED"
}
```

##

# UC06 - Cán bộ trực ban nhận xử lý tin báo

## 1. Mục tiêu

Cho phép cán bộ trực ban nhận xử lý tin báo được giao và chuyển trạng thái hồ sơ sang “Đang xác minh”.

## 2. Actor chính

Officer

## 3. Actor liên quan

System

## 4. Tiền điều kiện

- Cán bộ đã đăng nhập.
- Cán bộ có role OFFICER.
- Tin báo đã được điều phối cho cán bộ hoặc đơn vị của cán bộ.
- Tin báo chưa bị khóa bởi cán bộ khác.

## 5. Luồng xử lý chính

- Cán bộ đăng nhập vào hệ thống.
- Cán bộ mở danh sách tin báo được giao.
- Cán bộ chọn một tin báo mới.
- Cán bộ bấm “Nhận xử lý”.
- Hệ thống kiểm tra quyền của cán bộ.
- Hệ thống kiểm tra tin báo có thuộc phạm vi xử lý của cán bộ không.
- Hệ thống kiểm tra hồ sơ có đang bị khóa bởi người khác không.
- Hệ thống tạo temporary case lock.
- Hệ thống chuyển trạng thái tin báo từ NEW_RECEIVED sang UNDER_VERIFICATION.
- Hệ thống ghi lịch sử thay đổi trạng thái.
- Hệ thống ghi audit log.
- Hệ thống trả về thông báo nhận xử lý thành công.

## 6. Luồng ngoại lệ (Exception Handler)

### 6.1. Tin báo đang bị khóa bởi cán bộ khác

Hệ thống trả về:

```response
Hồ sơ đang được xử lý bởi cán bộ khác.
```

### 6.2. Cán bộ không có quyền xử lý tin báo

Hệ thống trả về:

```response
Bạn không có quyền xử lý tin báo này.
```

### 6.3. Trạng thái không hợp lệ

Nếu tin báo không còn ở trạng thái NEW_RECEIVED, hệ thống không cho phép nhận xử lý.

## 7. Kết quả đầu ra

```response
{
  "caseId": 1,
  "status": "UNDER_VERIFICATION",
  "message": "Đã nhận xử lý tin báo"
}
```

## 8. Quy tắc locking

- Một tin báo tại một thời điểm chỉ được khóa bởi một cán bộ.
- Khóa hồ sơ có thời hạn.
- Nếu hết thời hạn, hệ thống cho phép cán bộ khác nhận xử lý.
- Nếu cán bộ hoàn tất thao tác, hệ thống có thể giải phóng khóa.

## 

# UC07 - Chỉ huy xem dashboard tổng quan

## 1. Mục tiêu

Cho phép chỉ huy theo dõi tình hình tin báo trên toàn hệ thống thông qua dashboard.

## 2. Actor chính

Commander

## 3. Tiền điều kiện

- Chỉ huy đã đăng nhập.
- Chỉ huy có role COMMANDER.

## 4. Luồng xử lý chính

1. Chỉ huy đăng nhập vào hệ thống.
2. Chỉ huy mở trang dashboard.
3. Hệ thống tải thống kê tổng quan.
4. Hệ thống hiển thị tổng số tin báo.
5. Hệ thống hiển thị số tin báo theo trạng thái.
6. Hệ thống hiển thị số tin báo theo mức nguy cấp.
7. Hệ thống hiển thị danh sách tin báo mới nhất.
8. Hệ thống hiển thị dữ liệu bản đồ hoặc heatmap cơ bản.

## 5. Dữ liệu hiển thị

| Nhóm dữ liệu | Mô tả |
|---|---|
| Total Reports | Tổng số tin báo |
| Reports By Status | Số lượng tin báo theo trạng thái |
| Reports By Urgency | Số lượng tin báo theo mức nguy cấp |
| Recent Reports | Danh sách tin báo mới nhất |
| Map Data | Vị trí tin báo theo tọa độ |
| Timeline | Dòng thời gian tiếp nhận và xử lý tin báo |

## 6. Kết quả đầu ra

Dashboard hiển thị các thông tin tổng quan để hỗ trợ chỉ huy theo dõi tình hình an ninh trật tự.

##
