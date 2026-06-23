# Đánh giá toàn diện trang Admin — Contest Voting Platform

**Ngày đánh giá:** 23/06/2026  
**Phạm vi:** Dashboard, đăng nhập, quản lý dự án, chi tiết dự án, người dùng, nhà tài trợ, banner, giới thiệu, timeline, hướng dẫn, cấu hình hệ thống; đồng thời rà soát middleware, API quản trị, dữ liệu bình chọn và thanh toán.  
**Tiêu chuẩn:** Sản phẩm quản trị thương mại hiện đại, ưu tiên tính đúng nghiệp vụ, bảo mật, khả năng kiểm toán, tốc độ thao tác, accessibility và trải nghiệm tương tự các SaaS cao cấp.

> **Phương pháp:** Đã kiểm tra source code, route, DOM SSR, responsive CSS, middleware, Prisma schema, API và production build. Các request runtime chỉ ở chế độ đọc, không tạo/sửa/xóa dữ liệu. Công cụ xem trực tiếp theo viewport không kết nối được trong phiên review, do đó cần chạy thêm visual regression thật trước khi phát hành.

---

## Kết luận nhanh

**Trang Admin chưa đầy đủ và chưa an toàn để vận hành production.**

- Giao diện có bố cục sạch, sidebar rõ và bao phủ khá nhiều màn hình CRUD.
- Các chức năng quản lý nội dung cơ bản đã hoạt động: dự án, người dùng, nhà tài trợ, banner, timeline, giới thiệu, hướng dẫn và cấu hình.
- Tuy nhiên, hệ thống còn thiếu các nghiệp vụ quan trọng nhất của nền tảng bình chọn có thanh toán: quản lý giao dịch, đối soát, lịch sử phiếu, chống gian lận, audit log, phân quyền, phiên đăng nhập, version nội dung và workflow duyệt/publish.
- Nghiêm trọng hơn, API quản trị chưa được bảo vệ đúng cách; dữ liệu người dùng và thao tác phá hủy có thể được gọi trực tiếp ngoài giao diện Admin.
- Cấu hình thanh toán nhạy cảm hiện có nguy cơ bị trả qua endpoint công khai.
- Logic bình chọn đang ở trạng thái test, không bảo đảm tính toàn vẹn của kết quả.

# **Điểm hoàn thiện tổng thể: 42/100**

Nếu chỉ xét bề ngoài, giao diện đạt khoảng **68/100**. Khi tính cả nghiệp vụ, bảo mật, dữ liệu và khả năng vận hành thương mại, điểm giảm còn **42/100**.

---

# 1. Điểm mạnh hiện tại

## 1.1. Phạm vi chức năng CRUD khá rộng

- Có dashboard tổng quan số dự án, tổng phiếu, dự án dẫn đầu và trạng thái cổng bình chọn.
- Dự án có danh sách, tìm kiếm, lọc bảng/vòng, tạo, sửa, xóa và trang chi tiết riêng.
- Hồ sơ dự án bao phủ nhiều trường nghiệp vụ: nhóm, trưởng nhóm, thành viên, trường/đơn vị, lĩnh vực, cố vấn, nhu cầu hỗ trợ, kỳ vọng, cam kết sở hữu trí tuệ và ảnh trưng bày.
- Người dùng có tìm kiếm, lọc provider, xem chi tiết, tạo, sửa, khóa và xóa.
- Nhà tài trợ có tier, logo, mô tả và thông tin liên hệ.
- Banner có trạng thái hiển thị/ẩn và hỗ trợ ảnh/video.
- Timeline có vòng thi, mốc quan trọng và trạng thái hoạt động.
- Trang giới thiệu có trình soạn thảo nội dung mở rộng và nhiều nhóm dữ liệu.
- Trang hướng dẫn quản lý được các bước, ảnh minh họa và bảng quy đổi điểm.
- Trang cài đặt tập trung cổng bình chọn, đăng ký, liên hệ, Sepay, bảo trì và reset phiếu.

## 1.2. Cấu trúc giao diện cơ bản hợp lý

- Sidebar chia nhóm “Quản lý”, “Quản lý giao diện” và “Cài đặt”, giúp người dùng hiểu phạm vi chức năng.
- Desktop có content container giới hạn chiều rộng, tránh kéo bảng/form quá rộng.
- Có sidebar thu gọn và khả năng điều chỉnh chiều rộng.
- Mobile/tablet đã có navigation thay thế ở Header.
- Card, input, button và badge dùng chung đã được tạo trong `components.tsx`.
- Nhiều bảng có horizontal scroll để tránh vỡ layout.
- Các control chính phần lớn có trạng thái hover/focus cơ bản.

## 1.3. Trạng thái và phản hồi

- Có toast provider dùng chung.
- Các thao tác xóa có xác nhận; reset toàn bộ phiếu có xác nhận hai lần.
- Một số form có `required`, email, tel, min/max và thông báo lỗi từ API.
- Upload có preview ở nhiều màn hình.
- Build production và TypeScript hiện chạy thành công.

## 1.4. Xác thực giao diện có nền tảng đúng

- Cookie phiên Admin dùng `httpOnly`, `sameSite=lax` và `secure` ở production.
- Protected layout xác minh chữ ký HMAC và thời hạn của session token.
- Mật khẩu Admin và người dùng được hỗ trợ bcrypt.
- Route protected chuyển hướng về trang đăng nhập khi không có phiên hợp lệ.

---

# 2. Mức độ đầy đủ theo từng module nghiệp vụ

| Module | Hiện có | Còn thiếu quan trọng | Mức hoàn thiện |
|---|---|---|---:|
| Đăng nhập Admin | Username/password, remember me, cookie phiên | Rate limit, lockout, 2FA, đổi/quên mật khẩu thật, quản lý phiên, secret bắt buộc | 45% |
| Dashboard | Tổng phiếu, dự án, top dự án, cổng bình chọn | Doanh thu, giao dịch, xu hướng theo thời gian, cảnh báo, hoạt động gần đây, health check thật | 45% |
| Dự án | CRUD, tìm kiếm, lọc, hồ sơ chi tiết, ảnh | Workflow duyệt, publish, import/export, bulk action, phân trang, lịch sử sửa, tài liệu hồ sơ | 65% |
| Người dùng | CRUD, khóa, provider, thông tin liên hệ | Vote history, session revoke, reset password, consent, bulk action, export, privacy controls | 50% |
| Bình chọn | Chỉnh tổng điểm dự án, mở/đóng cổng | Trang quản lý từng phiếu, chống gian lận, hoàn tác, điều chỉnh có lý do, idempotency | 15% |
| Thanh toán | Cấu hình Sepay | Danh sách giao dịch, đối soát, refund, pending/failed, webhook log, doanh thu, export | 10% |
| Nhà tài trợ | CRUD, tier, logo, liên hệ | Thứ tự hiển thị, active/inactive, thời hạn hợp đồng, giá trị tài trợ, preview website | 60% |
| Banner | CRUD, upload, active/inactive | Thứ tự, vị trí, lịch hiển thị, ảnh mobile, alt text, crop/compress, click analytics | 55% |
| Timeline | CRUD, vòng thi, important/active | DateTime chuẩn, sắp xếp kéo-thả, kiểm tra trùng, tự tính mốc hiện tại | 55% |
| Giới thiệu | Nội dung chi tiết, rich text, ảnh/QR | Draft/publish, version, rollback, preview responsive, lịch sử người sửa | 60% |
| Hướng dẫn | Bước, ảnh và bảng quy đổi | Thêm/xóa/sắp xếp section linh hoạt, version, preview, validation gói điểm | 60% |
| Cấu hình | Gate, registration, contact, payment, maintenance | Phân quyền thay đổi, secret write-only, test connection, audit, rollback, environment separation | 40% |
| Quản trị viên | Có bảng `AdminUser` và trường role | Không có UI quản lý Admin, RBAC thực tế, mời Admin, vô hiệu hóa, 2FA | 15% |
| Audit & vận hành | Log console rời rạc | Audit log, incident log, backup/restore, job status, metrics, cảnh báo | 5% |

---

# 3. Vấn đề cần cải thiện theo mức độ ảnh hưởng

## 3.1. P0 — Phải xử lý trước khi đưa hệ thống lên production

### P0-01 — API quản trị không có xác thực/ủy quyền

Các endpoint `/api/admin/*` trong backend không có guard. Admin frontend gọi trực tiếp API mà không gửi session hoặc token quản trị.

Kiểm tra runtime chỉ đọc xác nhận endpoint danh sách người dùng Admin trả HTTP 200 khi không có phiên đăng nhập. Điều này đồng nghĩa các endpoint tạo, sửa, xóa, upload và reset vote cũng không có lớp bảo vệ tại controller.

**Ảnh hưởng:** Người ngoài có thể đọc dữ liệu cá nhân hoặc thay đổi/xóa dữ liệu nếu truy cập được API.

### P0-02 — Endpoint cấu hình công khai làm lộ dữ liệu nhạy cảm

`GET /api/settings` trả nguyên object cấu hình, bao gồm trường API key thanh toán và thông tin tài khoản nhận tiền. Khóa thanh toán còn có giá trị hard-code trong source/fallback.

**Ảnh hưởng:** Rò rỉ secret, khả năng truy cập trái phép dữ liệu giao dịch và mất an toàn thanh toán.

> Cần xoay vòng/thu hồi khóa đang dùng ngay sau khi triển khai bản sửa. Không chỉ xóa khỏi source vì khóa cũ vẫn đã bị lộ.

### P0-03 — Logic bình chọn đang ở chế độ test và có thể cộng điểm không hợp lệ

- `getFreeVoteQuota()` trả hạn mức rất lớn cố định.
- `isTestMode` hiện bật, cho phép bỏ qua xác thực thanh toán.
- Điểm bình chọn có thể lấy từ `body.points` do client gửi thay vì chỉ lấy từ package phía server.
- Token người dùng trả về dạng dự đoán được và không được dùng để bảo vệ endpoint vote.
- Public vote endpoint không xác minh người dùng thực sự sở hữu `userId` gửi lên.

**Ảnh hưởng:** Kết quả bình chọn và doanh thu không đáng tin cậy; có thể bị tăng điểm hàng loạt mà không thanh toán.

### P0-04 — Dữ liệu phiếu/giao dịch bị chia giữa MySQL và file JSON

- Tổng điểm nằm trong MySQL.
- VoteRecord trong MySQL chỉ giữ ít trường.
- Chi tiết package, points, amount, user và transaction lại ghi vào file JSON.
- Ghi file không có transaction hoặc lock.

**Ảnh hưởng:** Hai nguồn dữ liệu có thể lệch nhau; request đồng thời có thể làm mất bản ghi hoặc hỏng file; không thể đối soát đáng tin cậy.

### P0-05 — Reset vote tạo dữ liệu không nhất quán

Reset chỉ đặt `Candidate.votes = 0`, nhưng không reset/đánh dấu vote history và transactions. Sau reset, tổng điểm và lịch sử không còn khớp nhau.

**Ảnh hưởng:** Báo cáo, điều tra và đối soát sau sự cố không thể giải thích được.

### P0-06 — Upload file không có bảo vệ đầy đủ

- Endpoint upload không yêu cầu xác thực.
- Không giới hạn dung lượng phía server.
- Không whitelist MIME/extension an toàn.
- Upload chung giữ tên file gốc nên có thể ghi đè file cùng tên.
- File được copy vào cả public của web và admin.
- Xóa record không xóa/đánh dấu file liên quan.

**Ảnh hưởng:** Lạm dụng lưu trữ, ghi đè asset, phát tán file nguy hiểm và tạo nhiều file mồ côi.

### P0-07 — Secret phiên có fallback công khai

`ADMIN_SESSION_SECRET` có giá trị fallback hard-code. Nếu môi trường production quên cấu hình biến này, người biết source có thể tạo session hợp lệ.

**Ảnh hưởng:** Bypass đăng nhập Admin.

### P0-08 — Không có audit log cho thao tác quản trị

Không lưu ai đã sửa gì, trước/sau ra sao, lúc nào, IP/session nào. Đặc biệt nguy hiểm với chỉnh vote, khóa người dùng, cấu hình thanh toán, mở/đóng cổng và reset toàn hệ thống.

**Ảnh hưởng:** Không truy trách nhiệm, không điều tra được sự cố và không rollback an toàn.

## 3.2. P1 — Thiếu nghiệp vụ quan trọng và làm giảm chất lượng vận hành

| ID | Vấn đề | Ảnh hưởng |
|---|---|---|
| P1-01 | Có role Admin nhưng không áp dụng RBAC | Mọi Admin có cùng quyền, kể cả reset vote và sửa thanh toán |
| P1-02 | Không có trang giao dịch/đối soát | Không biết pending, success, failed, duplicate hoặc cần refund |
| P1-03 | Không có trang lịch sử từng phiếu | Không thể tra cứu phiếu theo user, dự án, package, thời gian |
| P1-04 | Không có chống gian lận và cảnh báo | Không phát hiện vote bất thường theo tài khoản, IP, thiết bị, tốc độ |
| P1-05 | Dashboard ghi “realtime” nhưng chỉ tải một lần | Nhãn và trạng thái tạo niềm tin sai |
| P1-06 | “Máy chủ hoạt động” dựa vào dữ liệu có/không, không phải health check | Có thể báo xanh dù một phần hệ thống lỗi |
| P1-07 | Không có phân trang, server-side filter/sort | Danh sách lớn sẽ chậm và tốn bộ nhớ |
| P1-08 | Không có import/export CSV/Excel | Vận hành cuộc thi nhiều hồ sơ phải nhập thủ công |
| P1-09 | Không có bulk action | Khóa, phân vòng, publish hoặc export nhiều record mất thời gian |
| P1-10 | Admin được sửa trực tiếp tổng vote | Không có lý do, maker-checker hoặc bản ghi điều chỉnh |
| P1-11 | Không có draft/review/publish/version cho nội dung | Mọi thay đổi có thể lên website ngay và không rollback được |
| P1-12 | Không cảnh báo khi có thay đổi chưa lưu | Dễ mất nội dung dài ở Giới thiệu/Hướng dẫn/Cấu hình |
| P1-13 | Settings dùng dữ liệu mặc định cũ nếu API lỗi | Admin có thể vô tình ghi đè cấu hình production bằng dữ liệu mẫu |
| P1-14 | Timeline lưu ngày dưới dạng chuỗi tự do | Không sort/tính trạng thái/validate timezone đáng tin cậy |
| P1-15 | Có thể có nhiều mốc cùng được đánh dấu “hiện tại” | Website và Admin không xác định nguồn sự thật duy nhất |
| P1-16 | Rich text dùng `document.execCommand` đã lỗi thời | Hành vi không ổn định, khó kiểm soát HTML đầu ra |
| P1-17 | Không dùng DTO/ValidationPipe whitelist ở backend | Payload sai/ngoài dự kiến lọt vào business logic |
| P1-18 | CORS mặc định mở rộng | Tăng bề mặt tấn công API |
| P1-19 | Login không có rate limit/lockout/2FA | Dễ brute force tài khoản Admin |
| P1-20 | Không có đổi mật khẩu, revoke session và quản lý thiết bị | Khó xử lý tài khoản bị lộ |
| P1-21 | Hỗ trợ mật khẩu Admin dạng plain text legacy | Kéo dài rủi ro mật khẩu không được hash |
| P1-22 | Xóa record là hard delete | Không có thùng rác, phục hồi hoặc thời gian giữ dữ liệu |
| P1-23 | Không có optimistic concurrency/version | Hai Admin có thể ghi đè thay đổi của nhau |
| P1-24 | Không có loading/error/retry nhất quán | API lỗi thường chỉ ra danh sách trống, khó phân biệt “không có dữ liệu” và “lỗi” |

## 3.3. P1 — Vấn đề giao diện và trải nghiệm

| ID | Vấn đề | Khu vực |
|---|---|---|
| UI-01 | Hệ màu xanh dương toàn cục nhưng nhiều trang dùng xanh lá/cam/nâu | Dashboard, Project, Users, Timeline, Settings |
| UI-02 | `html { font-size: 120% }` làm scale rem khó dự đoán | Toàn Admin |
| UI-03 | Nhiều chữ 9–11 px, đặc biệt meta/label | Sidebar, bảng, modal, toast |
| UI-04 | Button hệ thống cao 42 px, nhiều nút page chỉ 32–40 px | Toàn Admin |
| UI-05 | Mobile navigation là hàng ngang 9 mục | Header mobile/tablet |
| UI-06 | Bảng rộng 800–1100 px chỉ có horizontal scroll | Dự án, Users, Timeline |
| UI-07 | Không sticky header/cột thao tác | Bảng dữ liệu dài |
| UI-08 | Modal không có `role=dialog`, focus trap, Escape, restore focus, scroll lock | Hầu hết màn hình CRUD |
| UI-09 | Toggle không có `role=switch` và tên/trạng thái truy cập | Settings, Banner |
| UI-10 | Sidebar resize chỉ dùng chuột, không có keyboard/ARIA | App shell |
| UI-11 | Nút logout chỉ xuất hiện khi hover ở một số trạng thái | Sidebar |
| UI-12 | Header chạy hiệu ứng typewriter lặp vô hạn | App shell |
| UI-13 | Login có “Quên mật khẩu” giả bằng `href="#"` | Login |
| UI-14 | Login hiển thị “Máy chủ đang hoạt động” cố định | Login |
| UI-15 | Label login không liên kết `htmlFor/id`; nút hiện mật khẩu thiếu ARIA | Login |
| UI-16 | Form dài trong một modal lớn, không chia bước/section sticky | Dự án |
| UI-17 | Không có inline validation và summary lỗi | Form CRUD |
| UI-18 | Native `confirm()` xen kẽ toast tùy biến | Toàn Admin |
| UI-19 | Toast thiếu live region/role và nút đóng 44 px | AlertProvider |
| UI-20 | Không có chế độ responsive dạng card cho bảng | Mobile |
| UI-21 | Content padding 24 px trên mobile làm vùng đọc hẹp | App shell |
| UI-22 | Không có safe-area cho modal/header trên thiết bị tai thỏ | Mobile |

## 3.4. P2 — Chi tiết hoàn thiện

- Thuật ngữ “thí sinh”, “ứng viên”, “dự án”, “phiếu” và “điểm” đang dùng lẫn lộn.
- Vẫn còn default “HUIT's Iconic 2024” và năm 2025 trong các màn hình HUIT Startup 2026.
- Dashboard dùng “vote” tiếng Anh xen tiếng Việt.
- Không có breadcrumb hoặc tên trang động; Header luôn hiển thị một H1 chung.
- Không lưu filter/search vào URL nên Back/Forward không khôi phục trạng thái.
- Cột bảng chưa sort được bằng header.
- Không có row selection.
- Badge trạng thái đôi khi chỉ phân biệt bằng màu.
- Sponsor không có thứ tự hiển thị; kết quả phụ thuộc database.
- Banner không có alt text riêng cho accessibility.
- Favicon/logo khoảng 2 MB; thư mục Admin public có 169 file khoảng 22,5 MB và nhiều asset trùng.
- Google Font được tải từ mạng dù đã có nhiều font local trong public.
- Login phụ thuộc texture từ website ngoài.
- `next.config` bỏ qua lỗi TypeScript và lint khi build.
- Utility chặn DevTools không tạo bảo mật thật và làm khó hỗ trợ kỹ thuật.
- Không có test tự động cho business logic, auth, CRUD và responsive.

---

# 4. Giải pháp đề xuất có thể triển khai code ngay

## 4.1. Bảo vệ toàn bộ API quản trị

Tạo `AdminAuthGuard` ở NestJS và áp dụng cho controller/module Admin. Không dùng việc “ẩn route bằng frontend” như một cơ chế bảo mật.

```ts
@Controller('admin')
@UseGuards(AdminSessionGuard, RolesGuard)
export class AdminController {
  @Get('web-users')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getWebUsers() {}

  @Post('settings/reset-votes')
  @Roles('SUPER_ADMIN')
  resetVotes() {}
}
```

Yêu cầu:

- Session/JWT phải được backend xác minh trên mọi request Admin.
- Tách public controller và admin controller.
- Không chấp nhận cookie chỉ vì “có tồn tại”.
- Không có fallback secret trong production; ứng dụng phải fail startup nếu thiếu secret.
- Session lưu `adminId`, `role`, `issuedAt`, `expiresAt`, `sessionId`.
- Hỗ trợ revoke session và logout tất cả thiết bị.

## 4.2. Đóng lỗ hổng cấu hình nhạy cảm

Tách hai DTO:

```ts
type PublicSettings = Pick<SystemSettings,
  'eventTitle' | 'startDate' | 'endDate' | 'isGateOpen' |
  'registrationUrl' | 'supportZaloUrl'
>;

type AdminSettings = SystemSettings;
```

- `GET /settings` chỉ trả public fields.
- `GET /admin/settings` yêu cầu quyền Admin.
- API key không trả lại nguyên giá trị; UI chỉ thấy `••••••••abcd`.
- Update secret theo kiểu write-only: để trống nghĩa là giữ nguyên.
- Chuyển secret sang secret manager/environment, không lưu source hoặc JSON public.
- Xoay vòng khóa thanh toán đã lộ.

## 4.3. Viết lại luồng bình chọn theo nguyên tắc fail-closed

```ts
const votePackage = await packageRepo.findActiveById(dto.packageId);
const points = votePackage.points; // tuyệt đối không lấy dto.points

await prisma.$transaction(async (tx) => {
  await tx.paymentTransaction.create({ data: verifiedPayment });
  await tx.voteRecord.create({ data: verifiedVote });
  await tx.candidate.update({
    where: { id: candidate.id },
    data: { votes: { increment: points } },
  });
});
```

- Không cho `body.points` quyết định điểm.
- Xác thực token người dùng và lấy `userId` từ token, không lấy từ body.
- Free quota lưu database với unique `(userId, voteDate)`.
- Production bắt buộc `isTestMode=false`; nếu thiếu Sepay key phải từ chối giao dịch.
- Tạo payment intent riêng với mã ngẫu nhiên, hết hạn và amount cố định.
- Xác thực webhook chữ ký, idempotency key và unique transaction ID.
- Không polling POST tạo vote; dùng GET status của payment intent.
- Có trạng thái `PENDING`, `VERIFIED`, `FAILED`, `EXPIRED`, `REFUNDED`.

## 4.4. Hợp nhất dữ liệu vào database

Bổ sung model:

```prisma
model VoteRecord {
  id            String   @id @default(uuid())
  candidateId   String
  userId        String?
  packageId     String
  points        Int
  voteType      String
  paymentId     String?
  ipHash        String?
  userAgentHash String?
  createdAt     DateTime @default(now())
}

model PaymentTransaction {
  id          String   @id
  userId      String?
  candidateId String
  packageId   String
  amount      Int
  status      String
  provider    String
  providerRef String?  @unique
  createdAt   DateTime @default(now())
  verifiedAt  DateTime?
}

model AuditLog {
  id           String   @id @default(uuid())
  adminId      String
  action       String
  entityType   String
  entityId     String?
  beforeJson   Json?
  afterJson    Json?
  reason       String?
  ipHash       String?
  createdAt    DateTime @default(now())
}
```

Loại bỏ file JSON như nguồn dữ liệu giao dịch chính.

## 4.5. Bổ sung các module Admin còn thiếu

### Bình chọn & giao dịch

- Danh sách phiếu với filter theo thời gian, dự án, user, package, loại free/paid.
- Danh sách giao dịch với status, amount, memo, provider reference.
- Trang chi tiết đối soát: giao dịch ↔ vote ↔ candidate ↔ user.
- Chức năng retry verify, mark reviewed, refund note.
- Export CSV/XLSX theo khoảng thời gian.
- Dashboard doanh thu và tỷ lệ thành công.

### Chống gian lận

- Cảnh báo nhiều vote trong thời gian ngắn.
- Một transaction dùng nhiều lần.
- Nhiều account cùng phone/device/IP hash.
- Vote tăng đột biến theo dự án.
- Điều chỉnh vote phải nhập lý do và cần quyền `SUPER_ADMIN`.
- Không sửa trực tiếp `Candidate.votes`; dùng adjustment record cộng/trừ.

### Quản trị viên

- Danh sách Admin, mời Admin, khóa, đổi role.
- Role đề xuất: `SUPER_ADMIN`, `CONTENT_MANAGER`, `PROJECT_REVIEWER`, `FINANCE`, `SUPPORT`, `VIEWER`.
- Đổi mật khẩu, reset mật khẩu, 2FA, session/device list.

### Audit & vận hành

- Audit log filter theo Admin/action/entity/time.
- Health dashboard cho DB, API, payment provider, upload storage.
- Backup và restore có version.
- Incident banner và maintenance workflow.

## 4.6. Workflow dự án

Thay status chuỗi tự do bằng enum:

```ts
type ProjectStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'NEEDS_REVISION'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'ARCHIVED';
```

- Tách “trạng thái hồ sơ”, “vòng thi” và “trạng thái hiển thị”.
- Mỗi transition có người thực hiện, thời gian, ghi chú.
- Có checklist hồ sơ còn thiếu.
- Bulk assign vòng/bảng/status.
- Import Excel có bước mapping, validation và preview trước khi commit.
- Export danh sách theo filter.
- Soft delete và thùng rác.

## 4.7. Workflow nội dung

- Mọi nội dung có `draftVersion` và `publishedVersion`.
- Nút “Lưu bản nháp”, “Xem trước”, “Gửi duyệt”, “Xuất bản”.
- Preview mở website thật với token preview và viewport Desktop/Tablet/Mobile.
- Lưu version history và rollback.
- Cảnh báo unsaved changes khi rời trang.
- Thay `document.execCommand` bằng TipTap/Lexical/ProseMirror.
- Sanitize HTML ở backend bằng allowlist.

## 4.8. Timeline và Banner

Timeline:

- Lưu `startAt`, `endAt` dưới dạng UTC/ISO; hiển thị timezone Asia/Ho_Chi_Minh.
- Tự xác định current milestone theo ngày.
- Drag-and-drop sắp xếp; validation không cho end trước start.
- Calendar preview.

Banner:

- Thêm `position`, `sortOrder`, `startsAt`, `endsAt`.
- Có desktop asset, mobile asset và alt text.
- Kiểm tra tỷ lệ/kích thước, crop preview, nén WebP/AVIF.
- Thống kê impression/click nếu cần đo hiệu quả.

## 4.9. Upload an toàn

- Chỉ cho phép JPEG, PNG, WebP và MP4 đã xác minh magic bytes.
- Giới hạn ảnh 5 MB, video theo chính sách riêng.
- Đổi tên thành UUID; không dùng tên file gốc làm storage key.
- Lưu vào object storage/private bucket; trả signed URL khi cần.
- Scan file, strip metadata, re-encode ảnh.
- Không copy một file vào hai app public.
- Theo dõi reference count và job dọn file mồ côi.

## 4.10. Validation backend

```ts
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

- Dùng DTO riêng cho create/update.
- Validate email, phone, URL, enum, length, date range và unique constraint.
- Không trả stack/internal API URL cho client.
- Chuẩn hóa error response gồm `code`, `message`, `fieldErrors`, `requestId`.

## 4.11. Điều hướng và responsive Admin

Desktop:

- Sidebar cố định 240–280 px; chỉ giữ collapse 72 px, bỏ resize tự do hoặc làm resize truy cập được.
- Header hiển thị tên trang hiện tại và breadcrumb, không chạy typewriter.
- Bảng có sticky header và sticky actions.

Tablet/mobile:

- Thay hàng navigation ngang 9 mục bằng hamburger + drawer có nhóm.
- Mobile ưu tiên data card; chỉ dùng table scroll cho dữ liệu thực sự dạng bảng.
- Filter mở bằng bottom sheet.
- CTA quan trọng sticky bottom khi form dài.
- Padding ngang 16 px và safe-area.
- Target tối thiểu 44 × 44 px.

## 4.12. Design system Admin

- Chọn xanh dương `#0A2FFF` hoặc `#006AD1` làm brand duy nhất.
- Xanh lá chỉ cho success, cam cho warning, đỏ cho destructive.
- Đưa `html` về `font-size: 100%`.
- Body tối thiểu 14 px trong bảng, 16 px trong form dài.
- Label tối thiểu 12–13 px; không dùng nội dung 9 px.
- Chỉ dùng các component: `PageHeader`, `Card`, `DataTable`, `Field`, `Button`, `Badge`, `Dialog`, `EmptyState`, `Skeleton`, `ErrorState`.
- Không viết lại màu/radius/button riêng ở từng page.

## 4.13. Dialog và accessibility

Tạo một Dialog dùng chung:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent aria-labelledby="project-dialog-title">
    <DialogTitle id="project-dialog-title">Cập nhật dự án</DialogTitle>
    <form>{/* fields */}</form>
  </DialogContent>
</Dialog>
```

Tiêu chí:

- `role=dialog`, `aria-modal`, accessible name.
- Focus trap, Escape, restore focus, body scroll lock.
- Toggle dùng `role=switch`, `aria-checked`.
- Toast dùng `aria-live`; error quan trọng dùng `role=alert`.
- Label gắn `htmlFor/id`; nút icon có `aria-label`.
- Focus ring luôn nhìn thấy.

## 4.14. Login Admin

- Bỏ “Quên mật khẩu” nếu chưa có luồng thật, hoặc triển khai reset qua email có token hết hạn.
- Trạng thái server phải lấy từ health endpoint, không hard-code.
- Thêm `autocomplete="username"` và `current-password`.
- Nút hiện mật khẩu có `aria-label`, `aria-pressed`.
- Rate limit theo account + IP, exponential backoff và lockout có kiểm soát.
- 2FA cho `SUPER_ADMIN` và `FINANCE`.
- Không tải texture/font từ bên thứ ba nếu không cần.

## 4.15. Trạng thái dữ liệu và form

Mỗi trang cần đủ:

- `loading`: skeleton đúng layout.
- `error`: thông báo nguyên nhân an toàn + nút thử lại.
- `empty`: giải thích và CTA.
- `success`: toast + timestamp.
- `saving`: disable submit, spinner, chống double-submit.
- Field error hiển thị ngay dưới input.
- Server conflict: cảnh báo record đã được người khác cập nhật.

---

# 5. Kiến trúc thông tin Admin đề xuất

```text
Tổng quan
├── Dashboard
├── Cảnh báo vận hành
└── Hoạt động gần đây

Cuộc thi
├── Dự án
├── Vòng thi & Timeline
├── Kết quả / Xếp hạng
└── Điều chỉnh điểm

Bình chọn & Tài chính
├── Lịch sử bình chọn
├── Giao dịch
├── Đối soát
├── Hoàn tiền
└── Chống gian lận

Người dùng
├── Tài khoản website
├── Phiên đăng nhập
└── Yêu cầu hỗ trợ

Nội dung
├── Banner
├── Giới thiệu
├── Hướng dẫn
├── Nhà tài trợ
└── Bản nháp / Lịch sử xuất bản

Hệ thống
├── Cấu hình công khai
├── Thanh toán & Secret
├── Quản trị viên & Phân quyền
├── Audit log
├── Backup / Restore
└── Health & Logs
```

---

# 6. Lộ trình triển khai ưu tiên

## Giai đoạn 0 — Khóa rủi ro production, 2–4 ngày

1. Tắt test mode và khóa endpoint vote cho đến khi xác thực đúng.
2. Xoay vòng khóa thanh toán đã lộ.
3. Tách public settings, không trả secret.
4. Bắt buộc `ADMIN_SESSION_SECRET`, bỏ fallback.
5. Thêm guard cho toàn bộ `/api/admin/*`.
6. Khóa upload bằng auth, MIME, size và UUID filename.
7. Bỏ `body.points`; derive points từ package server-side.

## Giai đoạn 1 — Bảo đảm dữ liệu, 5–10 ngày

1. Chuyển vote history/transaction từ JSON sang MySQL.
2. Thêm payment intent, idempotency và DB transaction.
3. Làm free quota thật.
4. Tạo audit log.
5. Sửa reset vote thành workflow có snapshot/adjustment.
6. Thêm DTO validation và error contract.

## Giai đoạn 2 — Hoàn thiện nghiệp vụ Admin, 1–2 tuần

1. Trang Votes, Transactions, Reconciliation và Fraud.
2. RBAC và quản lý Admin.
3. Workflow dự án và content publish.
4. Pagination, bulk action, import/export.
5. Health dashboard và recent activities.

## Giai đoạn 3 — Nâng UI/UX, 5–8 ngày

1. Đồng nhất design system xanh dương.
2. Drawer mobile, responsive data cards, sticky table.
3. Dialog/accessibility chuẩn.
4. Loading/error/empty/saving states.
5. Login, toast, form validation và unsaved changes.

## Giai đoạn 4 — Kiểm thử phát hành

- Unit test business logic vote/payment/quota.
- Integration test auth/RBAC/CRUD/idempotency.
- E2E cho đăng nhập, duyệt dự án, publish, bình chọn, đối soát.
- Accessibility WCAG AA.
- Visual regression tại 360, 390, 768, 1024, 1366 và 1440 px.
- Penetration test tập trung Admin API, upload, session và payment.

---

# 7. Điểm hoàn thiện chi tiết

| Hạng mục | Điểm /100 | Nhận định |
|---|---:|---|
| Thẩm mỹ tổng thể | 68 | Sạch, hiện đại vừa đủ; màu và typography chưa thống nhất |
| Điều hướng Desktop | 72 | Sidebar rõ; resize và logout còn vấn đề |
| Tablet/Mobile | 52 | Dùng được nhưng navigation ngang và bảng rộng chưa tối ưu |
| Accessibility | 40 | Modal, switch, focus, label và toast cần nâng cấp lớn |
| CRUD nội dung | 68 | Bao phủ rộng nhưng thiếu workflow/version/bulk |
| Quản lý dự án | 65 | Hồ sơ khá đầy đủ; thiếu duyệt, audit, import/export |
| Người dùng | 50 | Có CRUD/khóa; thiếu lịch sử, session, privacy và reset password |
| Bình chọn & chống gian lận | 15 | Logic test và thiếu màn hình vận hành |
| Thanh toán & đối soát | 10 | Chỉ có cấu hình, chưa có module vận hành tài chính |
| Bảo mật | 12 | API Admin và secret có rủi ro nghiêm trọng |
| Toàn vẹn dữ liệu | 25 | MySQL + JSON, reset lệch lịch sử, thiếu transaction/idempotency |
| Audit & khả năng vận hành | 10 | Gần như chưa có audit/backup/health/incident |
| Khả năng bảo trì | 46 | Nhiều page 500–1.200 dòng, component/modal lặp, màu hard-code |
| Hiệu năng | 70 | Bundle vừa phải; asset trùng/nặng và bảng client-side chưa scale |

# **Điểm tổng: 42/100 — Có thể demo nội bộ, chưa đủ điều kiện vận hành production**

## Mốc điểm dự kiến sau cải tiến

- Hoàn thành P0: **55–60/100**, hệ thống giảm rủi ro nghiêm trọng.
- Hoàn thành P0 + nền tảng dữ liệu/audit: **70–75/100**.
- Bổ sung giao dịch, đối soát, RBAC, workflow và responsive UX: **85+/100**.
- Sau E2E, accessibility, visual regression và penetration test: có thể hướng tới **90+/100**.

---

# 8. Kết luận cuối

Trang Admin hiện **đẹp hơn một công cụ CRUD cơ bản**, nhưng chưa phải một hệ thống quản trị bình chọn thương mại hoàn chỉnh. Vấn đề không nằm ở việc thêm shadow, gradient hay animation; phần cần đầu tư trước là xác thực API, tính đúng của điểm bình chọn, đối soát thanh toán, audit log và workflow vận hành.

Không nên mở cuộc thi bình chọn thật hoặc nhận thanh toán production với trạng thái hiện tại. Sau khi khóa toàn bộ P0, Admin mới nên được cải tiến tiếp về giao diện và tiện ích vận hành.
