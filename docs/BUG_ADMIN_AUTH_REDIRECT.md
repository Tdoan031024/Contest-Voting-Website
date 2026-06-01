# Bug Log: Lỗi không tự động chuyển hướng về trang đăng nhập Admin

**Ngày ghi nhận**: 31/05/2026
**Mô đun**: `apps/admin`
**Trạng thái**: Đã giải quyết (Resolved)

## 1. Mô tả lỗi (Bug Description)
Khi người dùng truy cập trực tiếp vào đường dẫn quản trị `http://localhost:3001/admin`, hệ thống không tự động chặn lại và chuyển hướng (redirect) về trang `/admin/login` như mong đợi. Thay vào đó, người dùng có thể truy cập thẳng vào trang Dashboard dù chưa thực hiện thao tác đăng nhập.

## 2. Nguyên nhân (Root Causes)

Sau quá trình debug, lỗi này bắt nguồn từ sự kết hợp của 3 yếu tố:

1.  **Xung đột do cấu hình `basePath`**: 
    - Ứng dụng Next.js đang được cấu hình `basePath: '/admin'` (trong `next.config.js`).
    - Khi có cấu hình này, đối tượng `request.nextUrl.pathname` bên trong Middleware có thể bị Next.js tự động cắt bỏ tiền tố `/admin`, khiến việc so khớp đường dẫn bằng `if (pathname === '/admin/login')` bị sai lệch.
2.  **Cookie tồn đọng (Stale Cookie)**:
    - Trình duyệt lưu giữ cookie xác thực cũ (`admin_session`) từ các phiên bản thử nghiệm trước đó.
    - Middleware đọc được cookie này và cho rằng người dùng "đã đăng nhập", dẫn đến việc cho qua thay vì chặn lại.
3.  **Vấn đề bộ nhớ đệm (Caching)**:
    - Trong môi trường dev, Next.js Middleware đôi lúc bị cache hoặc không cập nhật ngay logic mới nếu không khởi động lại server.
    - Trình duyệt có xu hướng cache các hành vi redirect (như HTTP 307), khiến việc test luồng xác thực mới bị nhiễu.

## 3. Cách giải quyết (Solutions)

Để giải quyết triệt để và đảm bảo tính bảo mật, một cơ chế **bảo vệ kép (Dual-layer Protection)** đã được áp dụng:

### Bước 1: Đổi tên Cookie thành định danh độc nhất
Sử dụng tên cookie mới hoàn toàn: `HUIT_AUTH_V1` thay cho tên cũ. Điều này giúp dọn dẹp hoàn toàn các ảnh hưởng từ session cũ còn kẹt trên trình duyệt của máy test.

### Bước 2: Chuẩn hóa logic Middleware (Server-side)
Cập nhật `apps/admin/middleware.ts` để kiểm tra bao quát các trường hợp đường dẫn:
```typescript
const isLoginPage = pathname === '/login' || pathname === '/admin/login' || pathname.endsWith('/login');
```
Đồng thời đảm bảo sử dụng `URL` tuyệt đối khi gọi `NextResponse.redirect` để tránh lỗi vòng lặp chuyển hướng.

### Bước 3: Bổ sung lớp bảo vệ Client-side (Fallback)
Cập nhật `apps/admin/app/ClientShell.tsx` để kiểm tra cookie ngay trên trình duyệt khi component được mount.
- Nếu không tìm thấy chuỗi `HUIT_AUTH_V1=true` trong `document.cookie` và người dùng không ở trang login, lập tức dùng `window.location.href = '/admin/login'` để ép chuyển hướng.
- Việc sử dụng `window.location.href` thay vì `router.push()` trong lúc Login/Logout giúp ép trình duyệt tải lại trang toàn bộ (Full-page reload), khiến Middleware bắt buộc phải nhận diện lại trạng thái session mới nhất.

## 4. Bài học rút ra (Takeaways)
- Khi dùng Next.js có cấu hình `basePath`, luôn cẩn trọng với biến `pathname` trong Middleware.
- Quản lý xác thực (Authentication) luôn cần lớp bảo vệ dự phòng ở Client-side phòng khi Server-side cấu hình route bị lọt khe.
- Khi thay đổi logic authentication trong môi trường dev, cần sử dụng chế độ Ẩn danh (Incognito) hoặc đổi tên Cookie để tránh lỗi do cache gây ra.
