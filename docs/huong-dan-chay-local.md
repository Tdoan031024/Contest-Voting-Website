# HƯỚNG DẪN KHỞI CHẠY DỰ ÁN DƯỚI LOCAL (LOCAL DEVELOPMENT GUIDE)

Tài liệu này hướng dẫn chi tiết cách cài đặt môi trường, cấu hình cơ sở dữ liệu và khởi chạy toàn bộ hệ thống dự án **Contest Voting Platform (HUIT Startup)** dưới môi trường local để phát triển và thử nghiệm.

---

## 1. Kiến trúc & Cấu trúc Dự án
Dự án được phát triển dưới dạng **Monorepo** sử dụng **npm workspaces**, bao gồm các thành phần sau:
* **`apps/api`**: Backend API viết bằng **NestJS**, sử dụng **Prisma ORM** để tương tác với cơ sở dữ liệu MySQL.
* **`apps/web`**: Frontend chính cho người dùng bình chọn, viết bằng **Next.js** (chạy mặc định ở port `3000`).
* **`apps/admin`**: Giao diện Quản trị viên (Admin Panel) để quản lý thí sinh, lượt bình chọn, cấu hình hệ thống, viết bằng **Next.js** (chạy mặc định ở port `3001`).
* **`packages/shared`**: Thư viện dùng chung (Types, DTOs, Utilities) dạng TypeScript package.

---

## 2. Chuẩn bị Môi trường (Prerequisites)
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt các công cụ sau:
1. **Node.js**: Phiên bản **18.x** hoặc **20.x** (khuyến nghị bản LTS).
2. **npm**: Đi kèm với Node.js (khuyên dùng npm 9.x hoặc mới hơn).
3. **MySQL Server**: Bạn có thể chạy MySQL cục bộ thông qua:
   * **Laragon** (Khuyên dùng trên Windows vì tiện lợi và dễ quản lý database).
   * **XAMPP**.
   * **Docker** (chạy container MySQL).
   * Cài đặt độc lập **MySQL Community Server**.

---

## 3. Các Bước Cài Đặt và Khởi Chạy

### Bước 1: Cài đặt Dependencies
Từ thư mục gốc (root) của dự án, mở Terminal (PowerShell hoặc Command Prompt) và chạy lệnh:
```bash
npm install
```
Lệnh này sẽ tự động phân tích và cài đặt tất cả các thư viện cần thiết cho cả 3 ứng dụng (`api`, `web`, `admin`) và package `shared`.

---

### Bước 2: Cấu hình Cơ sở dữ liệu (Database Setup)

1. Khởi động MySQL Server của bạn (Laragon / XAMPP / Docker...).
2. Truy cập vào công cụ quản lý MySQL (ví dụ: phpMyAdmin, HeidiSQL, DBeaver) và tạo một database trống tên là:
   ```sql
   CREATE DATABASE contest_voting_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Tạo file cấu hình môi trường `.env` ở thư mục gốc của dự án (nếu chưa có). Nội dung mặc định:
   ```env
   DATABASE_URL="mysql://root@localhost:3306/contest_voting_db"
   ```
   * *Lưu ý*: Nếu MySQL của bạn có mật khẩu hoặc chạy ở port khác, hãy thay đổi URL tương ứng: `mysql://username:password@localhost:port/contest_voting_db`.

---

### Bước 3: Đồng bộ và Khởi tạo Database Schema (Prisma)
Prisma ORM cần đồng bộ hóa cấu trúc database và sinh mã (generate client).
Chạy lệnh sau tại thư mục gốc để đẩy schema vào database và sinh Prisma client:
```bash
# Di chuyển vào thư mục api
cd apps/api

# Đồng bộ schema lên database
npx prisma db push

# Hoặc chạy migrations chính thức:
npx prisma migrate dev --name init

# Sinh mã Prisma Client
npx prisma generate
```

> [!NOTE]
> Dự án được tích hợp cơ chế **Tự động Seed dữ liệu (Auto-Seed)**. Khi backend (`apps/api`) khởi chạy lần đầu tiên, NestJS sẽ tự động đọc dữ liệu mẫu từ file [contest_voting_db.json](file:///d:/HUIT_PROJECT/Contest%20Voting%20Platform/Contest-Voting-Platform/apps/api/contest_voting_db.json) và đưa các bản ghi thí sinh (Candidates), nhà tài trợ (Sponsors), timeline (TimelineEvent), banner (Banners) và tài khoản admin mặc định vào cơ sở dữ liệu MySQL của bạn.

---

### Bước 4: Tạo Tài khoản Admin mặc định
Nếu hệ thống chưa tự động tạo, hoặc bạn muốn khôi phục tài khoản quản trị về mặc định:
* Tài khoản mặc định:
  * **Username**: `Startup.Huitmedia`
  * **Password**: `Huit@media2019`
* Để reset mật khẩu admin, chạy script sau trong thư mục `apps/api`:
  ```bash
  node reset-admin.js
  ```

---

### Bước 5: Build Package Dùng Chung (Shared Package)
Do các ứng dụng frontend và backend sử dụng các kiểu dữ liệu từ `@huitfest/shared`, bạn cần build package này trước khi chạy dự án.
Chạy lệnh build từ thư mục gốc:
```bash
npm run build
```
*(Lệnh này sẽ build toàn bộ workspace bao gồm cả package `shared`)*.

---

### Bước 6: Khởi Chạy Các Ứng Dụng ở Chế Độ Phát Triển (Development)
Từ thư mục gốc của dự án, bạn có thể mở 3 tab terminal để chạy đồng thời các ứng dụng, hoặc chạy từng ứng dụng cần thiết:

#### 1. Khởi chạy Backend API (Port 5000)
```bash
npm run dev:api
```
* API sẽ chạy tại địa chỉ: `http://localhost:5000`
* Tích hợp cơ chế tự động theo dõi thay đổi code (Watch mode).

#### 2. Khởi chạy Giao diện Bình chọn Web chính (Port 3000)
```bash
npm run dev:web
```
* Trang web người dùng bình chọn sẽ chạy tại địa chỉ: `http://localhost:3000`

#### 3. Khởi chạy Trang Quản trị Admin Panel (Port 3001)
```bash
npm run dev:admin
```
* Trang admin quản lý hệ thống sẽ chạy tại địa chỉ: `http://localhost:3001`
* Đăng nhập bằng tài khoản: `Startup.Huitmedia` / `Huit@media2019`

---

## 4. Các Biến Môi Trường Chi Tiết (Environment Variables)

### 📂 Thư mục gốc (`/.env`)
* `DATABASE_URL`: Đường dẫn kết nối MySQL database.
  * Mặc định: `mysql://root@localhost:3306/contest_voting_db`

### 📂 Thư mục `apps/admin/.env.local`
* `ADMIN_SESSION_SECRET`: Khóa bí mật dùng để mã hóa session đăng nhập quản trị (Mặc định: `HuitMedia2026`).
* `ADMIN_API_URL`: URL gọi API backend (Mặc định ở local: `http://127.0.0.1:5000`).

### 📂 Thư mục `apps/web/.env` hoặc `apps/web/.env.local`
* `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Cấu hình ID client đăng nhập Google (nếu có dùng OAuth).

---

## 5. Các Lệnh Thường Dùng (CLI Commands Cheat Sheet)

| Lệnh | Vị trí chạy | Mô tả |
| :--- | :--- | :--- |
| `npm install` | Thư mục gốc | Cài đặt toàn bộ dependencies cho dự án |
| `npm run build` | Thư mục gốc | Build tất cả package và ứng dụng trong monorepo |
| `npm run dev:api` | Thư mục gốc | Khởi chạy API backend trong chế độ dev |
| `npm run dev:web` | Thư mục gốc | Khởi chạy frontend web người dùng bình chọn |
| `npm run dev:admin` | Thư mục gốc | Khởi chạy frontend quản trị viên admin |
| `npx prisma db push` | `apps/api/` | Cập nhật nhanh cấu trúc schema Prisma lên MySQL |
| `npx prisma studio` | `apps/api/` | Mở giao diện Web GUI để xem/sửa dữ liệu trực tiếp trong database |
| `node reset-admin.js` | `apps/api/` | Reset tài khoản admin về username: `Startup.Huitmedia`, password: `Huit@media2019` |

---

## 6. Xử lý Lỗi Thường Gặp (Troubleshooting)

### 1. Lỗi kết nối Database `PrismaClientKnownRequestError`
* **Nguyên nhân**: MySQL chưa khởi động, port bị chiếm dụng, hoặc thông tin URL trong `.env` không chính xác.
* **Cách khắc phục**:
  1. Kiểm tra xem Laragon/XAMPP/MySQL Service đã chạy chưa.
  2. Dùng công cụ kết nối thử với credentials tương ứng xem có thành công không.
  3. Kiểm tra lại chuỗi kết nối `DATABASE_URL` trong file `.env` ở thư mục gốc.

### 2. Không nhận dạng được các module từ `@huitfest/shared`
* **Nguyên nhân**: Chưa build package `shared` hoặc thư mục `dist` của packages/shared bị lỗi/thiếu.
* **Cách khắc phục**: Chạy lệnh build lại từ thư mục gốc của dự án:
  ```bash
  npm run build
  ```

### 3. Cổng thanh toán Sepay (Bình chọn trả phí) ở môi trường Local
* **Thông tin**: Ở local, hệ thống mặc định bật chế độ test hoặc sử dụng API key mẫu. Khi thực hiện thanh toán gói điểm bình chọn trả phí, NestJS sẽ tự động tạo một giao dịch giả lập (`TX-DEMO-...`) để hoàn thành việc bình chọn mà không cần gọi API thật từ Sepay.
* **Cấu hình**: Trong cấu hình hệ thống (admin panel), bạn có thể kiểm tra cài đặt `isTestMode` hoặc API key.
