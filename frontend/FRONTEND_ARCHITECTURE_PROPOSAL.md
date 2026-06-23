# Đề xuất kiến trúc Frontend

> Tài liệu này mô tả hiện trạng và kiến trúc mục tiêu cho frontend của **Hệ thống Tiếp nhận và Điều phối Thông tin Tố giác Tội phạm** tại thời điểm khảo sát ngày 23/06/2026. Đây là tài liệu định hướng; không phản ánh việc đã refactor hay đã triển khai các thư mục, route và feature được đề xuất.

## 1. Phạm vi và nguyên tắc khảo sát

Phạm vi khảo sát trực tiếp là toàn bộ `frontend/`, gồm cấu hình, dependency, source code, route, style, static asset và biến môi trường (chỉ kiểm tra tên biến, không ghi giá trị). Tài liệu cũng đối chiếu `docs/01-project-scope.md`, `docs/02-use-cases.md`, `docs/03-state-machine.md`, `docs/05-api-contract.md`, `docs/06-permission-matrix.md` và `docs/08-frontend-integration.md` để nhận diện feature nghiệp vụ tương lai.

Quy ước trạng thái trong tài liệu:

- **Hiện có**: đã thấy trong source frontend.
- **Đề xuất gần**: phù hợp MVP và đã có API hoặc contract hỗ trợ.
- **Đề xuất giai đoạn sau**: có trong phạm vi nghiệp vụ nhưng frontend hoặc backend chưa sẵn sàng.
- Nội dung không có bằng chứng trong code hoặc tài liệu được ghi rõ là **chưa xác định trong codebase**.

## 2. Hiện trạng frontend

### 2.1. Nền tảng và cấu hình

| Hạng mục | Kết quả khảo sát |
|---|---|
| Framework | Next.js `16.2.9`, React `19.2.4` |
| Router | App Router vì route nằm trong `src/app/` |
| Ngôn ngữ | TypeScript, bật `strict`; `allowJs` vẫn đang là `true` nhưng source hiện tại chỉ có `.ts`/`.tsx` |
| React Compiler | Đã bật trong `next.config.ts` |
| Styling | Tailwind CSS 4 qua `@tailwindcss/postcss`, utility class trong JSX và CSS global tại `src/app/globals.css` |
| Alias import | Có `@/*` trỏ đến `./src/*` |
| HTTP client | Wrapper tự viết trên Fetch API tại `src/services/apiClient.ts`; không dùng Axios |
| State | Chỉ dùng `useState` cục bộ; chưa có Context, reducer, Zustand/Redux hay thư viện server-state |
| Lint/build | Có script `lint`, `build`; chưa thấy test script hoặc test framework |
| Biến môi trường | Có `.env.local` với `NEXT_PUBLIC_API_BASE_URL`; `config/env.ts` có fallback `http://localhost:8080` |

### 2.2. Cấu trúc đang có

```text
frontend/
├── public/                         # Các SVG mặc định của create-next-app
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Route /
│   │   └── login/
│   │       └── page.tsx           # Route /login
│   ├── components/
│   │   ├── layout/                # Đang rỗng
│   │   ├── shared/                # Đang rỗng
│   │   └── ui/                    # Đang rỗng
│   ├── config/
│   │   └── env.ts
│   ├── features/
│   │   ├── auth/services/authService.ts
│   │   └── health/services/healthService.ts
│   ├── services/
│   │   ├── apiClient.ts
│   │   └── endpoints.ts
│   ├── types/
│   │   └── auth.ts
│   └── utils/                     # Đang rỗng
├── .env.local
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

### 2.3. Route và page hiện có

| Route | Kiểu | Trách nhiệm hiện tại |
|---|---|---|
| `/` | Client Component | Trang kiểm tra nền tảng, gọi health API, tự quản lý loading/result/error và render UI |
| `/login` | Client Component | Form đăng nhập, gọi auth API, tự lưu token vào `localStorage` và hiển thị message |

Chưa có route group, nested layout nghiệp vụ, loading/error boundary, protected route hoặc route theo role. Toàn bộ hai page đều có `"use client"`; chưa có cách phân tách Server Component và Client Component ngoài việc biến cả page thành client.

### 2.4. Component, hook, state và style

- Chưa có component dùng chung hoặc component feature được tách thành file; UI hiện nằm trực tiếp trong hai page.
- `components/ui`, `components/layout`, `components/shared` đã được tạo nhưng đang rỗng. Đây là khung hợp lý nên giữ và điền dần theo nhu cầu thật.
- Chưa có custom hook. Logic gọi API, trạng thái form và loading/error nằm ngay trong page.
- Chưa có state toàn cục. Với quy mô hiện tại, đây chưa phải vấn đề và chưa cần thêm Redux/Zustand.
- Tailwind utility là cách styling chính. `globals.css` định nghĩa màu nền/chữ, font token và dark mode theo hệ điều hành. Chưa có design token nghiệp vụ hoặc thư viện component.
- `public/` chỉ có asset mẫu của create-next-app; chưa có asset nghiệp vụ.

### 2.5. API và auth hiện tại

Luồng hiện tại:

```text
page
  → feature service
    → endpoints dùng chung
      → apiClient (Fetch)
        → API Gateway qua NEXT_PUBLIC_API_BASE_URL
```

Điểm tốt nên giữ:

- Component không gọi `fetch` trực tiếp mà đi qua feature service.
- Base URL đã được gom vào `config/env.ts`.
- Endpoint hiện được gom tại `services/endpoints.ts`.
- `apiClient` đã có generic response, các method cơ bản, gắn Bearer token tùy chọn và xử lý response `204`.
- Import alias `@/` đã được dùng nhất quán.

### 2.6. Điểm chưa nhất quán và rủi ro hiện hữu

Các mục dưới đây là ghi nhận kiến trúc, không phải thay đổi code trong bước này:

1. **Login chưa khớp API contract**: page gửi `{ email, password }`, trong khi `docs/05-api-contract.md` mô tả `{ username, password }`.
2. **Response chưa khớp wrapper backend**: code đọc `response.accessToken`, còn contract trả `{ success, message, data: { accessToken, ... } }`. `apiClient` hiện trả toàn bộ JSON và chưa unwrap `data`.
3. **Type auth đặt chưa đúng phạm vi**: `src/types/auth.ts` chỉ phục vụ feature auth nhưng nằm ở global types; cấu trúc `user` cũng khác contract (`email/role` so với `username/roles`).
4. **Token bị xử lý ở nhiều tầng**: login page tự ghi `localStorage`, còn `apiClient` tự đọc. Chưa có `tokenStorage`/auth session làm nguồn sự thật duy nhất.
5. **Auth opt-in dễ bị quên**: mỗi request protected phải truyền `auth: true`; chưa có protected client mặc định hoặc cơ chế policy rõ ràng.
6. **Chưa có logout, refresh, kiểm tra hết hạn, khôi phục session, route guard hoặc phân quyền giao diện**. Refresh-token endpoint/cơ chế refresh hiện **chưa xác định trong codebase và API contract**.
7. **Xử lý lỗi làm mất dữ liệu nghiệp vụ**: `apiClient` chỉ tạo `Error(message)`, chưa giữ `errorCode`, HTTP status và field errors. Contract lưu ý phần lớn lỗi nghiệp vụ hiện có thể cùng trả HTTP 400.
8. **`Content-Type: application/json` bị đặt cho mọi request**: sẽ không phù hợp upload `FormData`, vì browser cần tự tạo multipart boundary.
9. **Khả năng HTTP còn thiếu**: chưa có `PATCH`, query serializer, timeout/cancel, blob download; đây đều là nhu cầu đã xuất hiện trong API contract.
10. **Page đang ôm nhiều trách nhiệm**: route composition, form, gọi API, token, loading/error và markup nằm cùng file. Mới chỉ có hai page nên chưa duplicate nhiều, nhưng pattern này sẽ khó kiểm soát khi thêm màn hình.
11. `HealthResponse` được khai báo ngay trong service trong khi type auth ở global; quy tắc đặt type chưa thống nhất.
12. Endpoint tập trung là phù hợp ở quy mô hiện tại, nhưng một object phẳng duy nhất sẽ khó sở hữu khi nhiều feature cùng phát triển.
13. Metadata và `lang="en"` còn là mặc định create-next-app; chưa phản ánh sản phẩm tiếng Việt.
14. Chưa có validation form, cache/revalidation, test, convention cho loading/error/empty state. Công cụ cụ thể cho các nhu cầu này **chưa xác định trong codebase**.

## 3. Mục tiêu kiến trúc đề xuất

Kiến trúc mục tiêu là **Next.js App Router + feature-oriented architecture ở mức vừa phải**. Không xây dựng nhiều layer hình thức khi dự án còn nhỏ; chỉ tách khi mỗi phần có trách nhiệm rõ ràng.

Kiến trúc cần giúp:

- Mở rộng route và nghiệp vụ mà không biến `app/` thành nơi chứa toàn bộ logic.
- Cho AI và developer mới một vị trí mặc định rõ ràng trước khi tạo file.
- Tránh duplicate component, service, hook, type và constant.
- Tách route composition, nghiệp vụ theo feature và hạ tầng dùng chung.
- Kiểm soát dependency khi số lượng màn hình, role và API tăng.
- Làm PR nhỏ hơn, dễ review, dễ tìm nguyên nhân lỗi và dễ bảo trì.
- Phản ánh đúng ranh giới nghiệp vụ nhưng không sao chép máy móc cấu trúc microservice backend.

## 4. Cấu trúc thư mục mục tiêu

Giữ `src/`, `app/`, alias `@/`, `features/`, `services/`, `config/` và ba nhóm component đã có. Chuẩn hóa dần theo cấu trúc sau:

```text
frontend/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── report/page.tsx
│   │   │   └── tracking/page.tsx
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx
│   │   │   ├── cases/page.tsx
│   │   │   ├── cases/[caseId]/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── admin/...
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── health/
│   │   ├── public-reports/
│   │   ├── cases/
│   │   ├── evidence/
│   │   ├── dispatch/
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── crime-catalog/
│   │   └── urgency-rules/
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── apiError.ts
│   │   ├── endpoints.ts
│   │   └── tokenStorage.ts
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   ├── config/
│   │   └── env.ts
│   └── assets/                  # Chỉ tạo khi có asset cần import/bundle
├── .env.local
├── package.json
└── tsconfig.json
```

Route group `(public)`, `(auth)`, `(protected)` không làm đổi URL. Chỉ nên tạo chúng khi bắt đầu có layout/guard riêng; không cần di chuyển hai route hiện tại ngay lập tức.

Không bắt buộc mọi feature có đủ năm thư mục con. Ví dụ feature chỉ có một service thì có thể giữ đúng như `health/services/healthService.ts`; tạo `hooks/`, `types/`, `components/` khi thực sự có file thuộc trách nhiệm đó.

## 5. Vai trò và quy tắc của từng thư mục

### 5.1. `src/app/`

- **Dùng cho**: định nghĩa route, layout, metadata, loading/error boundary và composition cấp trang của App Router.
- **Tạo file khi**: cần URL hoặc convention file của Next.js như `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`.
- **Ví dụ**: `app/(protected)/cases/[caseId]/page.tsx` lấy param và ghép `CaseDetailScreen`.
- **Không đặt**: HTTP call thô, DTO dài, business rule, component nghiệp vụ lớn hoặc util dùng lại.
- Page nên mỏng. Ưu tiên Server Component mặc định; chỉ đánh dấu Client Component cho nhánh thực sự cần state, event hoặc browser API.

### 5.2. `src/components/ui/`

- **Dùng cho**: primitive thuần giao diện, ít hoặc không biết nghiệp vụ.
- **Tạo file khi**: có nhu cầu dùng lại thực tế ở nhiều màn hình hoặc cần chuẩn hóa accessibility/style.
- **Ví dụ**: `Button.tsx`, `Input.tsx`, `Modal.tsx`, `Table.tsx`, `Card.tsx`.
- **Không đặt**: `CaseTable`, `UrgencyRuleForm`, gọi API, kiểm tra role hay endpoint.

### 5.3. `src/components/layout/`

- **Dùng cho**: khung giao diện toàn app hoặc khu vực lớn.
- **Tạo file khi**: nhiều route dùng cùng header/sidebar/navigation shell.
- **Ví dụ**: `AppHeader.tsx`, `AppSidebar.tsx`, `ProtectedShell.tsx`.
- **Không đặt**: form nghiệp vụ hoặc logic riêng của một feature.

### 5.4. `src/components/shared/`

- **Dùng cho**: component dùng xuyên feature, có thể chứa logic hiển thị nhẹ nhưng không thuộc một domain cụ thể.
- **Tạo file khi**: ít nhất hai feature có nhu cầu giống nhau và API component đã đủ ổn định.
- **Ví dụ**: `LoadingState.tsx`, `ErrorState.tsx`, `EmptyState.tsx`, `ConfirmDialog.tsx`, `PermissionGate.tsx`.
- **Không đặt**: component chỉ dùng một nơi hoặc component mang ngôn ngữ nghiệp vụ như `CaseStatusTimeline`.

### 5.5. `src/features/`

- **Dùng cho**: module theo năng lực nghiệp vụ/frontend, sở hữu component, hook, service, type và util nội bộ.
- **Tạo feature khi**: có một luồng nghiệp vụ độc lập, bộ API/type riêng hoặc nhiều màn hình cùng chia sẻ logic domain.
- **Ví dụ**: `auth`, `cases`, `dashboard`, `crime-catalog`.
- **Không đặt**: primitive UI, helper hoàn toàn generic hoặc cấu hình hạ tầng toàn app.
- Không tách feature chỉ vì backend có một microservice; ranh giới frontend đi theo trải nghiệm và ownership của màn hình.

### 5.6. `features/[feature]/components/`

- **Dùng cho**: component chỉ phục vụ feature đó.
- **Tạo file khi**: cần tách page/screen hoặc có khối UI nghiệp vụ có tên rõ.
- **Ví dụ**: `cases/components/CaseTable.tsx`, `auth/components/LoginForm.tsx`.
- **Không đặt**: `Button`, `Modal` hoặc component dùng chung không còn phụ thuộc domain.

### 5.7. `features/[feature]/services/`

- **Dùng cho**: hàm truy cập API của feature và mapping DTO nếu cần.
- **Tạo file khi**: feature có endpoint riêng.
- **Ví dụ**: `cases/services/caseService.ts`, `auth/services/authService.ts`.
- **Không đặt**: state React, toast, redirect hoặc JSX.

### 5.8. `features/[feature]/hooks/`

- **Dùng cho**: orchestration phía React chỉ thuộc feature, gồm state tương tác, query/mutation wrapper nếu sau này dùng thư viện server-state.
- **Tạo file khi**: logic được dùng lại hoặc page/component đang quá tải.
- **Ví dụ**: `auth/hooks/useAuth.ts`, `cases/hooks/useCases.ts`, `cases/hooks/useCaseLock.ts`.
- **Không đặt**: HTTP implementation thấp tầng hoặc hook generic như `useDebounce`.

### 5.9. `features/[feature]/types/`

- **Dùng cho**: entity, enum, request/response DTO, filter và view model riêng feature.
- **Tạo file khi**: type không có ý nghĩa ngoài feature.
- **Ví dụ**: `cases/types/case.types.ts`, `auth/types/auth.types.ts`.
- **Không đặt**: `ApiResponse<T>` hoặc pagination type dùng toàn app.

### 5.10. `src/services/`

- **Dùng cho**: hạ tầng giao tiếp dùng chung, không thuộc domain.
- **Tạo file khi**: mọi feature cần cùng một cơ chế.
- **Ví dụ**: `apiClient.ts`, `apiError.ts`, `tokenStorage.ts`, `endpoints.ts`.
- **Không đặt**: `caseService`, `userService` hoặc component.

### 5.11. `src/hooks/`

- **Dùng cho**: hook generic dùng từ hai feature trở lên.
- **Ví dụ**: `useDebounce.ts`, `usePagination.ts`, `useMediaQuery.ts`.
- **Không đặt**: hook chứa khái niệm case, report, evidence hoặc auth cụ thể.

### 5.12. `src/types/`

- **Dùng cho**: contract kỹ thuật dùng toàn app.
- **Ví dụ**: `api.types.ts` chứa `ApiResponse<T>`, `ApiErrorResponse`; `pagination.types.ts` chứa `PageResponse<T>`.
- **Không đặt**: type chỉ dùng trong một feature. Theo quy tắc này, auth type hiện tại về đích nên thuộc `features/auth/types/`.

### 5.13. `src/utils/`

- **Dùng cho**: hàm thuần, không phụ thuộc React/UI và tái sử dụng toàn app.
- **Ví dụ**: `formatDateTime.ts`, `buildQueryString.ts`, `downloadBlob.ts`.
- **Không đặt**: API call, mutable global state hoặc business rule chỉ của một feature.

### 5.14. `src/constants/`

- **Dùng cho**: giá trị ổn định dùng nhiều nơi.
- **Ví dụ**: `routes.ts`, `messages.ts`, `storageKeys.ts`.
- **Không đặt**: giá trị từ môi trường, dữ liệu tải từ API hoặc object chỉ dùng trong một component.

### 5.15. `src/config/`

- **Dùng cho**: đọc, kiểm tra và xuất cấu hình runtime/build-time.
- **Ví dụ**: `env.ts` với `NEXT_PUBLIC_API_BASE_URL`.
- **Không đặt**: endpoint nghiệp vụ, route UI hoặc secret server trong biến có tiền tố `NEXT_PUBLIC_`.

### 5.16. `public/` và `src/assets/`

- `public/`: file được phục vụ nguyên trạng bằng URL tuyệt đối, ví dụ `/images/logo.svg`; không chứa file nhạy cảm.
- `src/assets/`: chỉ tạo khi asset cần được import và bundle cùng source, ví dụ marker map hoặc illustration nội bộ.
- Không lưu evidence người dùng upload trong frontend repository.
- Các SVG mẫu hiện tại có thể giữ đến khi có kế hoạch dọn asset; không cần xóa trong đợt chuẩn hóa đầu.

## 6. Shared component và feature component

Quyết định theo thứ tự:

1. Component có thuật ngữ hoặc rule của một domain không? Nếu có, đặt trong feature.
2. Component chỉ là primitive giao diện và không biết domain? Đặt trong `components/ui` khi có nhu cầu dùng lại.
3. Component dùng chung có logic hiển thị nhẹ nhưng không thuộc domain? Cân nhắc `components/shared`.
4. Component tạo khung điều hướng/layout? Đặt trong `components/layout`.
5. Nếu mới chỉ dùng ở một feature, giữ trong feature. Chỉ cân nhắc nâng lên shared khi từ hai feature trở lên cần cùng contract.

| Loại | Ví dụ phù hợp | Ví dụ không phù hợp |
|---|---|---|
| UI | `Button`, `Input`, `Modal`, `Table`, `Card` | `CaseTable`, `UrgencyBadge` có rule nghiệp vụ |
| Layout | `AppSidebar`, `AppHeader`, `ProtectedShell` | `LoginForm` |
| Shared | `LoadingState`, `EmptyState`, `ConfirmDialog` | `CaseLockWarning` chỉ dùng trong cases |
| Feature | `LoginForm`, `ReportForm`, `CaseTable`, `EvidenceList`, `HeatmapPanel` | Primitive không biết nghiệp vụ |

Không tạo shared component chỉ để “phòng khi cần”. Trùng hai đoạn markup nhỏ chưa chắc là cùng abstraction; ưu tiên đúng ownership hơn giảm số dòng bằng mọi giá.

## 7. Feature/module phù hợp với dự án

### 7.1. Feature hiện có

| Feature | Chức năng | Route liên quan | Component có thể có | Service | Type |
|---|---|---|---|---|---|
| `auth` | Đăng nhập cán bộ, nền tảng session/token | `/login` | `LoginForm`, sau này `AuthGuard`/`PermissionGate` | `authService.login`, sau này `logout/getSession` nếu contract có | `LoginRequest`, `LoginResponse`, `AuthUser`, `Role` |
| `health` | Kiểm tra kết nối frontend–API Gateway phục vụ phát triển/monitoring đơn giản | `/` hiện tại; không nhất thiết là route sản phẩm | `HealthCheckPanel` nếu còn nhu cầu | `healthService.check` | `HealthResponse` |

### 7.2. Feature đề xuất gần theo MVP và API contract

| Feature | Chức năng chính | Route dự kiến | Component dự kiến | Service dự kiến | Type/interface dự kiến |
|---|---|---|---|---|---|
| `public-reports` | Người dân gửi tin báo và tra cứu bằng tracking code | `/report`, `/tracking` | `ReportForm`, `EvidenceUploader`, `LocationPicker`, `TrackingForm`, `TrackingResult` | `getPublicCrimeTypes`, `createReport`, `getReportStatus` | `CreateReportRequest`, `CreateReportResponse`, `PublicReportStatus`, `CrimeTypeOption` |
| `cases` | Officer xem danh sách/chi tiết, nhận xử lý, cập nhật trạng thái và quản lý case lock | `/cases`, `/cases/[caseId]` | `CaseTable`, `CaseFilters`, `CaseDetail`, `CaseStatusActions`, `CaseLockBanner` | `getCases`, `getCaseDetail`, `acceptCase`, `updateCaseStatus`, các hàm lock | `CaseSummary`, `CaseDetail`, `CaseStatus`, `CaseFilters`, `CaseLock` |
| `evidence` | Hiển thị metadata và tải bằng chứng có phân quyền | Thường ghép trong `/cases/[caseId]` | `EvidenceList`, `EvidencePreview`, `EvidenceDownloadButton` | `downloadEvidence` | `EvidenceMetadata`, `EvidenceFileType` |
| `dashboard` | Overview, timeline, heatmap cho Commander/Admin | `/dashboard` | `OverviewCards`, `ReportTimeline`, `CrimeHeatmap`, `DashboardFilters` | `getOverview`, `getTimeline`, `getHeatmap` | `DashboardOverview`, `TimelineEvent`, `HeatmapPoint`, `HeatmapFilters` |
| `users` | Admin quản lý user/role/trạng thái và tạo hồ sơ officer | `/admin/users`, có thể `/admin/officers/new` | `UserTable`, `UserForm`, `RoleEditor`, `UserStatusToggle`, `OfficerProfileForm` | `getUsers`, `createUser`, `updateUserRoles`, `updateUserStatus`, `createOfficer` | `AdminUser`, `CreateUserRequest`, `UpdateRolesRequest`, `CreateOfficerRequest` |
| `crime-catalog` | Admin quản lý loại tội phạm | `/admin/crime-types` | `CrimeTypeTable`, `CrimeTypeForm` | `getCrimeTypes`, `createCrimeType`, `updateCrimeType` | `CrimeType`, `CrimeCategory`, `UpsertCrimeTypeRequest` |
| `urgency-rules` | Admin quản lý rule tính điểm nguy cấp | `/admin/urgency-rules` | `UrgencyRuleTable`, `UrgencyRuleForm` | `getUrgencyRules`, `createUrgencyRule`, `updateUrgencyRule` | `UrgencyRule`, `UpsertUrgencyRuleRequest`, `UrgencyLevel` |

`Role`, `CaseStatus`, `UrgencyLevel` có thể được export từ feature sở hữu hoặc một domain types rõ ràng. Không tạo hai enum khác nhau chỉ vì hai API cùng trả một giá trị.

### 7.3. Feature đề xuất cho giai đoạn sau

| Feature | Lý do để sau | Nội dung dự kiến |
|---|---|---|
| `dispatch` | Tài liệu xác nhận API pending/assign chưa có controller/gateway route | Route `/dispatch`; `PendingCaseTable`, `AssignmentForm`; `getPendingCases`, `assignCase`; `DispatchTask`, `AssignmentRequest` |
| `reporter-identity` | Endpoint giải mã danh tính chưa sẵn sàng và cần audit/quyền nghiêm ngặt | Có thể là nhánh của `cases` thay vì feature riêng nếu chỉ có một panel; type `ReporterIdentity`; service chỉ mở khi backend hoàn thiện |
| `police-units` | Chưa có API lấy toàn bộ police unit để chọn `unitId` | Có thể bắt đầu là phần của `users`/officer form; chỉ tách feature khi có quản trị đơn vị đầy đủ |
| `notifications`, `analytics`, `ai-assistance` | Được mô tả là mở rộng sau MVP, chưa có frontend implementation/contract đầy đủ | Thông báo trạng thái, phân tích nâng cao, AI summary/spam suggestion |

Không đề xuất `profile`, chat realtime hoặc mobile module ở giai đoạn hiện tại vì chưa có bằng chứng triển khai/API đủ rõ.

## 8. Kiến trúc xử lý API

### 8.1. Pattern thống nhất

Nên tiếp tục dùng `apiClient` chung trên Fetch API; chưa có lý do đủ mạnh để thêm Axios. Trách nhiệm được chia như sau:

```text
config/env.ts
  └── đọc và validate base URL

services/apiClient.ts
  ├── ghép base URL
  ├── serialize request phù hợp JSON/FormData
  ├── gắn auth header
  ├── parse ApiResponse<T>, 204, blob
  └── ném ApiError có status/errorCode/message

services/endpoints.ts
  └── endpoint factory hoặc namespace ổn định

features/*/services/*.ts
  └── hàm API có tên theo use case, dùng DTO của feature
```

Base URL tiếp tục lấy từ `NEXT_PUBLIC_API_BASE_URL` qua `config/env.ts`. Frontend chỉ gọi API Gateway, không gọi port microservice. Fallback localhost có thể dùng cho local development, nhưng production nên fail rõ nếu thiếu cấu hình thay vì âm thầm gọi localhost.

Endpoint có thể giữ tập trung trong `services/endpoints.ts` ở MVP, nhưng tổ chức theo namespace/factory:

```ts
export const endpoints = {
  auth: { login: "/api/auth/login" },
  cases: {
    list: "/api/officer/cases",
    detail: (caseId: number) => `/api/officer/cases/${caseId}`,
  },
} as const;
```

Nếu file này trở nên quá lớn hoặc nhiều team cùng sửa, cho phép feature sở hữu endpoint nội bộ trong service của nó; không đồng thời khai báo cùng endpoint ở hai nơi.

### 8.2. Contract request/response

Type dùng chung:

```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}
```

Feature service nên trả dữ liệu mà caller cần và thống nhất việc unwrap ở một nơi. Ví dụ:

```ts
export function getCases(params: GetCasesParams): Promise<PageResponse<CaseSummary>> {
  return apiClient.get(endpoints.cases.list, { query: params, auth: true });
}
```

Tên DTO phải thể hiện chiều dữ liệu: `CreateReportRequest`, `CreateReportResponse`, `UpdateCaseStatusRequest`. Không dùng một interface cho cả form state, request backend và response nếu ba cấu trúc khác nhau.

### 8.3. Token và lỗi chung

- Gom đọc/ghi/xóa token vào `services/tokenStorage.ts` hoặc auth session adapter; page không truy cập trực tiếp storage.
- Chỉ code chạy ở browser mới được dùng `localStorage`. Lựa chọn localStorage hiện tại có rủi ro XSS; phương án tốt hơn về bảo mật là cookie `HttpOnly`, nhưng cần backend/API Gateway hỗ trợ. Không tự đổi cơ chế chỉ từ frontend.
- `apiClient` phải giữ `status`, `errorCode`, `message`; UI map thông báo theo `errorCode` khi cần. Không suy luận mọi lỗi nghiệp vụ chỉ từ status 400.
- Khi 401, phát một luồng session-expired thống nhất: xóa session và điều hướng login. Không redirect từ service domain.
- Không tự đặt `Content-Type` khi body là `FormData`.
- Bổ sung `PATCH`, query params, `AbortSignal`, blob download khi feature tương ứng bắt đầu triển khai.
- Component/page không gọi `fetch` trực tiếp. Component gọi hook hoặc feature service; service không hiển thị toast và không điều hướng.

## 9. Kiến trúc auth

### 9.1. Cấu trúc mục tiêu

```text
features/auth/
├── components/LoginForm.tsx
├── hooks/useAuth.ts
├── services/authService.ts
├── types/auth.types.ts
└── utils/authRedirect.ts        # Chỉ khi có rule redirect theo role

services/tokenStorage.ts
components/shared/PermissionGate.tsx
app/(protected)/layout.tsx
```

### 9.2. Luồng đề xuất

1. `LoginForm` quản lý input/validation giao diện.
2. `useAuth` điều phối mutation đăng nhập và trạng thái session.
3. `authService.login` chỉ gọi API với đúng `LoginRequest` và trả dữ liệu auth đã chuẩn hóa.
4. Session adapter lưu token ở một nơi duy nhất. Trong ngắn hạn có thể bọc `localStorage` hiện có; dài hạn ưu tiên cookie `HttpOnly` nếu backend hỗ trợ.
5. `apiClient` lấy token qua adapter và gắn `Authorization: Bearer ...` cho request protected.
6. Protected layout/guard xác minh có session trước khi render. `PermissionGate` chỉ ẩn/hiện UI theo role; backend vẫn là nơi thực thi phân quyền thật.
7. Logout gọi endpoint nếu backend bổ sung, sau đó luôn xóa session local và điều hướng `/login`.
8. Khi token hết hạn/401: chỉ thử refresh nếu có contract refresh chính thức; nếu chưa có, xóa session và yêu cầu đăng nhập lại.

Hiện tại chưa có endpoint refresh/logout, middleware hay cách xác minh token trong codebase. Không được tự giả định có refresh token chỉ vì `LoginResponse` cũ khai báo field tùy chọn.

### 9.3. Lưu ý App Router

`localStorage` không thể được đọc trong Server Component hoặc Next middleware. Nếu tiếp tục lưu token ở localStorage, route guard chỉ có thể chạy phía client và có nguy cơ nháy nội dung. Cookie `HttpOnly` cho phép bảo vệ sớm hơn nhưng là thay đổi contract liên tầng cần thống nhất với backend. Đây phải là quyết định bảo mật riêng, không lẫn vào commit di chuyển file.

## 10. UI và design system nhẹ

Không cần đưa một design-system framework mới vào ngay. Trước mắt xây nền nhỏ trên Tailwind hiện có:

```text
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   └── Card.tsx
├── layout/
│   ├── AppHeader.tsx
│   ├── AppSidebar.tsx
│   └── ProtectedShell.tsx
└── shared/
    ├── LoadingState.tsx
    ├── ErrorState.tsx
    ├── EmptyState.tsx
    └── ConfirmDialog.tsx
```

Quy tắc:

- `ui` thuần giao diện, nhận props và không gọi API/đọc role.
- `layout` tạo khung điều hướng tổng thể.
- `shared` có thể chứa logic hiển thị nhẹ dùng nhiều feature.
- Feature component ghép các primitive và mang ngôn ngữ nghiệp vụ.
- Chuẩn hóa variant, focus state, disabled/loading và accessibility trước khi tăng số lượng component.
- Token màu, spacing và typography dùng Tailwind theme/CSS variables; không rải mã màu nghiệp vụ khắp JSX.

## 11. Types và interfaces

Quy tắc ownership:

```text
features/cases/types/case.types.ts       # Case, CaseStatus, request/response của cases
features/auth/types/auth.types.ts        # LoginRequest, LoginResponse, AuthUser
types/api.types.ts                       # ApiResponse<T>, ApiErrorResponse
types/pagination.types.ts                # PageResponse<T>, PageParams
```

- Type riêng feature ở trong feature; type toàn app mới đặt tại `src/types`.
- Không định nghĩa lại `CaseStatus` ở `cases`, `dashboard` và `public-reports`. Chọn một nguồn sở hữu rồi import.
- Tách domain model, transport DTO và form model khi cấu trúc khác nhau.
- Dùng tên có hậu tố rõ như `Request`, `Response`, `Params`, `Filters`, `FormValues`.
- Không dùng optional cho mọi field để né việc khớp contract. Optional phải phản ánh đúng API.

Ví dụ:

```ts
export interface CreateReportRequest {
  crimeTypeId: number;
  description: string;
  isHappeningNow: boolean;
  hasWeapon: boolean;
}

export interface CreateReportResponse {
  trackingCode: string;
  status: CaseStatus;
  urgencyLevel: UrgencyLevel;
}
```

## 12. Hooks và quản lý state

- Hook riêng feature: `features/cases/hooks/useCases.ts`, `features/cases/hooks/useCaseLock.ts`, `features/auth/hooks/useAuth.ts`.
- Hook toàn app: `hooks/useDebounce.ts`, `hooks/usePagination.ts`.
- Một hook nên có một mục đích chính; không gom session, toast, navigation và toàn bộ API vào một “god hook”.
- Tên hook query/mutation cần rõ hành động: `useCases`, `useAcceptCase`, `useUpdateCaseStatus`.
- Form state cục bộ tiếp tục dùng React state khi đơn giản.
- Auth/user session là ứng viên cho Context hoặc auth provider nhỏ.
- Dữ liệu server nhiều màn hình, cache/invalidation và polling lock có thể cần thư viện server-state sau này. Hiện frontend chưa có thư viện này; chỉ thêm khi use case đủ rõ, không thêm Redux chỉ để chuẩn hóa thư mục.

## 13. Constants và config

Cấu trúc gợi ý:

```text
config/env.ts                 # Đọc/validate NEXT_PUBLIC_API_BASE_URL
constants/routes.ts          # ROUTES.LOGIN, ROUTES.CASES, route factory
constants/messages.ts        # Chỉ message thật sự lặp lại
constants/storageKeys.ts     # Tên key storage trong giai đoạn còn dùng localStorage
services/endpoints.ts        # API endpoint/factory
```

Không hard-code rải rác:

- API base URL và endpoint.
- Frontend route quan trọng.
- Storage key `accessToken`.
- Role (`OFFICER`, `DISPATCHER`, `COMMANDER`, `ADMIN`).
- Case status và urgency level.

Không biến `constants/` thành kho chứa mọi literal. Label chỉ dùng trong một component có thể ở cạnh component; danh mục do backend quản lý phải lấy từ API.

## 14. Dependency direction và import

Hướng phụ thuộc cho phép:

```text
app (route composition)
 ├──────────────→ features
 ├──────────────→ components/layout, components/shared
 └──────────────→ services/config (chỉ khi là hạ tầng route-level)

features
 ├──────────────→ components/ui, components/shared
 ├──────────────→ services
 ├──────────────→ hooks/types/utils/constants dùng chung
 └──────────────→ nội bộ chính feature

services ───────→ config, types, utils thuần
components/ui ──→ types/utils thuần
utils/types/constants: tầng lá, không phụ thuộc UI hoặc feature
```

Quy tắc bắt buộc:

- `components/ui` không import từ `features`.
- `services` không import React component/hook.
- `utils` không phụ thuộc UI.
- Feature không import file nội bộ sâu của feature khác. Nếu thực sự chia sẻ contract, nâng contract đó lên shared/domain rõ ràng hoặc expose public entry có chủ đích.
- Không tạo vòng lặp giữa feature.
- Dùng alias `@/` cho import xuyên khu vực; relative import ngắn được phép trong cùng thư mục/feature.
- Tránh barrel `index.ts` tràn lan vì dễ che vòng lặp và làm ownership mơ hồ; chỉ dùng public entry khi có lợi ích rõ.

## 15. Quy trình thêm màn hình mới: danh sách tin báo của Officer

1. Xác nhận route `/cases`, role được phép và contract `GET /api/officer/cases`.
2. Tạo `app/(protected)/cases/page.tsx` mỏng, chỉ đọc search params và compose màn hình.
3. Tạo/chuẩn hóa `features/cases/types/case.types.ts`: `CaseSummary`, `CaseFilters`, `PageResponse` dùng chung nếu cần.
4. Khai báo endpoint một lần và tạo `features/cases/services/caseService.ts`.
5. Tạo `useCases` nếu cần quản lý fetch/cache/filter phía client; không tạo hook nếu Server Component/service call đã đủ.
6. Tạo `CaseTable`, `CaseFilters`, `UrgencyBadge` trong feature; dùng `Button`, `Table`, `Card` có sẵn thay vì tạo bản sao.
7. Xử lý đủ loading, error, empty; giữ `errorCode` để thông báo đúng lỗi nghiệp vụ.
8. Kiểm tra phân quyền UI và dữ liệu, pagination size tối đa 50, responsive và keyboard accessibility.
9. Kiểm tra route detail/link, query params và trạng thái back/forward.
10. Chạy lint và build; chạy test nếu dự án đã bổ sung test framework.

Checklist trước khi tạo file mới:

- File này đã tồn tại dưới tên khác chưa?
- Nó thuộc route, feature hay shared infrastructure?
- Chỉ một feature dùng nó hay ít nhất hai feature?
- Type/endpoint/status này đã có nguồn sở hữu chưa?
- Việc thêm dependency mới có thực sự cần thiết không?

## 16. Chiến lược migrate từ hiện trạng

Mỗi giai đoạn phải là các PR nhỏ, có lint/build và không trộn di chuyển file với thay đổi nghiệp vụ lớn.

### Giai đoạn 1 — Chuẩn hóa nhẹ

1. Thống nhất guideline từ tài liệu này; sau đó tạo `FRONTEND_GUIDELINES.md` ngắn, dùng như checklist hằng ngày.
2. Xác nhận contract login thực tế với backend: `username`, response wrapper và role array.
3. Củng cố `apiClient` hiện có thay vì thay thư viện: wrapper/errorCode, JSON/FormData, `PATCH`, query và blob theo nhu cầu.
4. Gom token/storage key sau một adapter; chưa cần đổi cơ chế lưu token trong cùng PR.
5. Chuẩn hóa endpoint theo namespace; không di chuyển hàng loạt file.
6. Tạo các type dùng chung thật sự như `ApiResponse<T>` và `PageResponse<T>`.
7. Giữ nguyên hai route và các thư mục đang có; chỉ tách `LoginForm`/health panel khi có issue riêng.

### Giai đoạn 2 — Tách theo feature

1. Đưa auth type về ownership của `features/auth/types` trong một PR có kiểm tra import.
2. Tách UI/login orchestration thành component/hook auth khi bắt đầu hoàn thiện session.
3. Xây feature theo thứ tự MVP: `public-reports` → `cases`/`evidence` → `dashboard` → admin.
4. Mỗi feature sở hữu component, service, hook, type; page chỉ compose.
5. Chỉ tạo route group/protected layout khi có từ hai route protected trở lên hoặc có guard/layout thật.
6. Chưa triển khai UI gọi dispatcher/reporter identity/police-unit list khi backend chưa sẵn sàng.

### Giai đoạn 3 — Làm sạch và tối ưu

1. Tìm duplicate component/service/type sau khi đã có ít nhất hai use case thật.
2. Nâng abstraction ổn định lên `components/shared`, `hooks` hoặc `types` dùng chung.
3. Chuẩn hóa naming, import boundary và xóa code/asset scaffold không còn dùng.
4. Tách component lớn theo trách nhiệm, không theo số dòng máy móc.
5. Đánh giá server-state library, form validation, test strategy và design tokens dựa trên pain point thực tế.
6. Tối ưu Server/Client Component boundary, cache và bundle sau khi có số liệu hoặc màn hình đủ phức tạp.

## 17. Rủi ro cần tránh

- Di chuyển quá nhiều file làm vỡ import và che khuất thay đổi hành vi.
- Đổi route structure, auth mechanism, API client và UI cùng một commit.
- Tạo shared component quá sớm, dẫn đến props phức tạp và coupling ngầm.
- Tách feature quá nhỏ theo từng endpoint hoặc từng entity backend.
- Duplicate service hoặc khai báo endpoint ở cả global và feature mà không có nguồn sở hữu.
- Hard-code endpoint, role, status, route và storage key trong component.
- Đưa component nghiệp vụ vào `components/ui`.
- Cho `app/page.tsx` tiếp tục tích tụ form, token, API và business rule.
- Quên response wrapper và `errorCode`; chỉ dựa HTTP 400 để phân loại lỗi.
- Đặt `Content-Type: application/json` cho `FormData` hoặc xử lý binary như JSON.
- Coi ẩn nút theo role là biện pháp bảo mật; backend vẫn phải enforce permission/data scope.
- Lưu hoặc log thông tin định danh người tố giác, token, evidence URL nhạy cảm.
- Bật UI cho API dispatcher, reporter identity hoặc police-unit list trước khi backend có route/contract hoạt động.
- Dùng localStorage trong Server Component/middleware hoặc giả định refresh token đã hoạt động.
- AI tự tạo thư mục/layer mới ngoài guideline, tự refactor quá phạm vi issue hoặc “dọn tiện” file không liên quan.
- Thêm state/design-system library chỉ để có vẻ chuẩn hóa mà chưa có nhu cầu.

## 18. Quy tắc dành cho AI và developer khi tạo code

1. Đọc tài liệu này và tìm file tương tự trước khi tạo file.
2. Không tạo folder con rỗng cho đủ sơ đồ; chỉ tạo khi có file thật.
3. Route mới vào `app/`; nghiệp vụ vào feature; primitive dùng lại vào component shared phù hợp.
4. Không gọi API trực tiếp trong component, không khai báo lại endpoint/type đã có.
5. Không tự đổi public contract, auth storage hoặc dependency mà issue không yêu cầu.
6. Nếu không xác định được ownership, giữ code gần nơi sử dụng và ghi chú trong PR thay vì nâng lên shared sớm.
7. Mọi refactor kiến trúc phải tách khỏi thay đổi hành vi nếu có thể.
8. PR phải nêu route/feature bị ảnh hưởng và kết quả lint/build/test.

## 19. Kết luận

Nên áp dụng **feature-oriented architecture nhẹ trên Next.js App Router**, giữ nguyên `src/`, alias `@/`, Fetch-based `apiClient`, `config/env.ts`, `features/` và ba nhóm `components` hiện có. Đây là nền móng đúng hướng và chưa cần thay framework, router, styling hay thêm state library.

Ưu tiên chuẩn hóa đầu tiên là contract API/login, response wrapper và error model; sau đó gom token/session, hoàn thiện khả năng JSON/FormData/PATCH/blob của API client, rồi phát triển feature theo thứ tự MVP. Việc tách route group, shared component và thư viện state chỉ thực hiện khi có use case thật.

Bước tiếp theo nên là tạo `frontend/FRONTEND_GUIDELINES.md` rút gọn từ tài liệu này, tập trung vào quy tắc placement, naming, import boundary, checklist tạo màn hình và checklist PR. Việc đó nên là một nhiệm vụ riêng; tài liệu hiện tại không sửa logic, không di chuyển và không đổi tên bất kỳ file source nào.
