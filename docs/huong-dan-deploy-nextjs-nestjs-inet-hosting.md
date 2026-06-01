# HƯỚNG DẪN DEPLOY WEB NEXT.JS / NESTJS / EXPRESS LÊN HOSTING iNET CÓ HỖ TRỢ NODE.JS

## 1. Mục tiêu

Tài liệu này hướng dẫn cách cấu hình để website sử dụng:

- Next.js cho frontend
- NestJS hoặc Express cho backend Node.js
- MySQL làm database
- GitHub để quản lý source code
- Hosting iNET có hỗ trợ Node.js
- Tên miền iNET
- GitHub Actions để tự động deploy khi push code vào nhánh `main`

Mục tiêu cuối cùng:

```bash
git push origin main
```

Sau khi push code lên GitHub, hệ thống sẽ tự động cập nhật source code trên hosting iNET và website trên tên miền sẽ thay đổi theo.

---

## 2. Mô hình triển khai

Mô hình tổng quát:

```text
GitHub Repository
        ↓ push main
GitHub Actions
        ↓ SSH vào hosting iNET
Hosting iNET Node.js
        ↓
Frontend Next.js + Backend NestJS/Express
        ↓
Domain iNET
```

Nên tách frontend và backend thành 2 ứng dụng Node.js riêng:

```text
domain.com      → Frontend Next.js
api.domain.com  → Backend NestJS / Express
```

Ví dụ:

```text
https://yourdomain.com      → giao diện người dùng
https://api.yourdomain.com  → API backend
```

---

## 3. Yêu cầu cần có

Trước khi deploy, cần chuẩn bị:

```text
1. Hosting iNET có hỗ trợ Node.js
2. Có quyền truy cập cPanel/iNET Hosting
3. Có tên miền đang quản lý ở iNET
4. Có GitHub Repository chứa source code
5. Hosting có hỗ trợ SSH hoặc Git Version Control
6. Có database MySQL trên hosting hoặc database riêng
```

Trong cPanel cần kiểm tra có các mục sau:

```text
Setup Node.js App
Git Version Control
Terminal hoặc SSH Access
MySQL Databases
Subdomains
```

Nếu có mục `Setup Node.js App` thì hosting có thể chạy ứng dụng Node.js.

---

## 4. Cấu trúc source code đề xuất

Nên tổ chức source code như sau:

```text
my-project
├── frontend
│   ├── package.json
│   ├── next.config.js
│   ├── server.js
│   ├── src
│   └── public
│
├── backend
│   ├── package.json
│   ├── src
│   ├── dist
│   └── prisma
│
└── .github
    └── workflows
        └── deploy.yml
```

Trong đó:

```text
frontend → dự án Next.js
backend  → dự án NestJS hoặc Express
```

---

## 5. Cấu hình tên miền và subdomain

### 5.1. Domain chính cho frontend

Domain chính dùng để chạy giao diện:

```text
yourdomain.com
www.yourdomain.com
```

### 5.2. Subdomain cho backend API

Tạo subdomain trong cPanel:

```text
api.yourdomain.com
```

Subdomain này dùng để chạy backend NestJS hoặc Express.

---

## 6. Cấu hình DNS ở iNET

Nếu domain và hosting đều ở iNET, thường DNS đã được trỏ sẵn về hosting.

Nếu cần cấu hình thủ công, thêm các bản ghi DNS như sau:

```text
Type: A
Name: @
Value: IP_HOSTING
```

```text
Type: A
Name: www
Value: IP_HOSTING
```

```text
Type: A
Name: api
Value: IP_HOSTING
```

Trong đó `IP_HOSTING` là địa chỉ IP của hosting iNET.

Kết quả mong muốn:

```text
yourdomain.com      → hosting iNET
www.yourdomain.com  → hosting iNET
api.yourdomain.com  → hosting iNET
```

---

## 7. Cấu hình frontend Next.js

### 7.1. Thêm file server.js

Trong thư mục `frontend`, tạo file:

```text
frontend/server.js
```

Nội dung:

```js
const { createServer } = require("http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`Next.js running on port ${port}`);
  });
});
```

File này giúp Next.js chạy được trên môi trường Node.js App của cPanel.

---

### 7.2. Cấu hình package.json frontend

Trong `frontend/package.json`, cần có script:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "node server.js"
  }
}
```

---

### 7.3. Biến môi trường frontend

Tạo biến môi trường:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Biến này dùng để frontend gọi API backend.

---

## 8. Cấu hình backend NestJS / Express

### 8.1. Backend NestJS

Với NestJS, sau khi build, file chạy chính thường là:

```text
dist/main.js
```

Trong `backend/package.json`, cần có:

```json
{
  "scripts": {
    "start": "node dist/main.js",
    "build": "nest build"
  }
}
```

Nếu dùng Express, file chạy có thể là:

```text
server.js
app.js
dist/server.js
```

Tùy theo cấu trúc dự án.

---

### 8.2. Biến môi trường backend

Backend cần các biến môi trường như:

```env
DATABASE_URL=mysql://username:password@localhost:3306/database_name
JWT_SECRET=your_secret_key
PORT=4000
NODE_ENV=production
```

Nếu dùng Prisma:

```bash
npx prisma generate
npx prisma migrate deploy
```

Hoặc nếu chưa dùng migration:

```bash
npx prisma db push
```

---

## 9. Tạo Node.js App trong cPanel iNET

Vào cPanel:

```text
Setup Node.js App → Create Application
```

---

### 9.1. Tạo app cho frontend

Cấu hình frontend:

```text
Node.js version: 18 hoặc 20
Application mode: Production
Application root: apps/my-project/frontend
Application URL: yourdomain.com
Application startup file: server.js
```

Sau đó chạy trong Terminal hoặc giao diện cPanel:

```bash
cd ~/apps/my-project/frontend
npm install
npm run build
```

Sau khi build xong, restart Node.js App.

---

### 9.2. Tạo app cho backend

Cấu hình backend:

```text
Node.js version: 18 hoặc 20
Application mode: Production
Application root: apps/my-project/backend
Application URL: api.yourdomain.com
Application startup file: dist/main.js
```

Sau đó chạy:

```bash
cd ~/apps/my-project/backend
npm install
npm run build
npx prisma generate
```

Sau khi build xong, restart Node.js App.

---

## 10. Đưa source code lên GitHub

Nếu dự án chưa có Git, chạy:

```bash
git init
git add .
git commit -m "init project"
git branch -M main
git remote add origin https://github.com/username/my-project.git
git push -u origin main
```

Nếu đã có repo GitHub thì chỉ cần push code lên nhánh `main`.

---

## 11. Clone source code về hosting iNET

Nếu cPanel có `Git Version Control`, có thể clone repo trực tiếp.

Ví dụ source nằm ở:

```text
/home/username/apps/my-project
```

Hoặc clone bằng SSH/Terminal:

```bash
cd ~/apps
git clone git@github.com:username/my-project.git
```

Cấu trúc sau khi clone:

```text
/home/username/apps/my-project/frontend
/home/username/apps/my-project/backend
```

---

## 12. Cấu hình auto deploy bằng GitHub Actions

### 12.1. Tạo file deploy.yml

Trong repo tạo file:

```text
.github/workflows/deploy.yml
```

Nội dung mẫu:

```yaml
name: Deploy to iNET Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOSTING_HOST }}
          username: ${{ secrets.HOSTING_USER }}
          key: ${{ secrets.HOSTING_SSH_KEY }}
          port: 22
          script: |
            cd /home/username/apps/my-project
            git pull origin main

            cd frontend
            npm install
            npm run build

            cd ../backend
            npm install
            npm run build
            npx prisma generate

            echo "Deploy completed"
```

Cần thay:

```text
username    → username hosting thật
my-project  → tên thư mục dự án thật
```

---

### 12.2. Thêm GitHub Secrets

Vào GitHub repo:

```text
Settings → Secrets and variables → Actions → New repository secret
```

Thêm các biến:

```text
HOSTING_HOST      = IP hoặc hostname SSH của hosting iNET
HOSTING_USER      = username hosting
HOSTING_SSH_KEY   = private key SSH
```

Nếu SSH dùng port khác 22 thì sửa lại trong file `deploy.yml`.

---

## 13. Restart Node.js App sau khi deploy

Sau khi build xong, cần restart app Node.js.

Một số hosting cPanel hỗ trợ restart bằng cách cập nhật file:

```bash
touch tmp/restart.txt
```

Có thể thêm vào cuối script GitHub Actions:

```bash
mkdir -p ~/apps/my-project/frontend/tmp
mkdir -p ~/apps/my-project/backend/tmp

touch ~/apps/my-project/frontend/tmp/restart.txt
touch ~/apps/my-project/backend/tmp/restart.txt
```

Ví dụ file deploy đầy đủ hơn:

```yaml
name: Deploy to iNET Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOSTING_HOST }}
          username: ${{ secrets.HOSTING_USER }}
          key: ${{ secrets.HOSTING_SSH_KEY }}
          port: 22
          script: |
            cd /home/username/apps/my-project
            git pull origin main

            cd frontend
            npm install
            npm run build
            mkdir -p tmp
            touch tmp/restart.txt

            cd ../backend
            npm install
            npm run build
            npx prisma generate
            mkdir -p tmp
            touch tmp/restart.txt

            echo "Deploy completed"
```

Nếu cách `touch tmp/restart.txt` không hoạt động, cần restart thủ công trong cPanel:

```text
Setup Node.js App → Restart
```

---

## 14. Quy trình làm việc sau khi hoàn tất

Sau khi cấu hình xong, mỗi lần cần cập nhật website:

```bash
git add .
git commit -m "update website"
git push origin main
```

GitHub Actions sẽ tự động:

```text
1. SSH vào hosting iNET
2. Pull code mới nhất từ GitHub
3. Cài package nếu có thay đổi
4. Build frontend
5. Build backend
6. Generate Prisma nếu có
7. Restart Node.js App
```

Sau đó website trên tên miền sẽ tự cập nhật.

---

## 15. Kiểm tra lỗi thường gặp

### Lỗi 1: Website không cập nhật sau khi push

Kiểm tra:

```text
GitHub Actions có chạy thành công không?
Hosting đã pull code mới chưa?
Node.js App đã restart chưa?
Có cache trình duyệt không?
```

Thử hard reload:

```text
Ctrl + F5 trên Windows
Cmd + Shift + R trên macOS
```

---

### Lỗi 2: Frontend không gọi được API

Kiểm tra biến môi trường:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

Kiểm tra backend có bật CORS không.

Ví dụ NestJS:

```ts
app.enableCors({
  origin: ["https://yourdomain.com", "https://www.yourdomain.com"],
  credentials: true,
});
```

---

### Lỗi 3: Backend không kết nối được MySQL

Kiểm tra:

```text
DATABASE_URL đúng chưa?
Database user/password đúng chưa?
Database host là localhost hay host riêng?
User MySQL đã được cấp quyền chưa?
```

Ví dụ:

```env
DATABASE_URL=mysql://db_user:db_password@localhost:3306/db_name
```

---

### Lỗi 4: Không chạy được npm run build

Kiểm tra:

```text
Node.js version có đúng không?
Package có thiếu không?
Hosting có đủ RAM không?
Có lỗi TypeScript hoặc ESLint không?
```

Có thể test local trước:

```bash
npm install
npm run build
```

---

### Lỗi 5: GitHub Actions SSH thất bại

Kiểm tra:

```text
HOSTING_HOST đúng chưa?
HOSTING_USER đúng chưa?
HOSTING_SSH_KEY đúng chưa?
Hosting có bật SSH không?
IP GitHub Actions có bị chặn không?
Port SSH có phải 22 không?
```

---

## 16. Lưu ý quan trọng

Hosting Node.js trên cPanel phù hợp với dự án nhỏ và vừa.

Nếu website có các tính năng nặng như:

```text
Socket.IO realtime nhiều người dùng
Upload ảnh/video lớn
Traffic cao
Cron job nặng
Xử lý dữ liệu lớn
Nhiều API phức tạp
```

thì nên cân nhắc chuyển sang VPS để ổn định và chủ động hơn.

Tuy nhiên, nếu dự án là website bình chọn, admin, đăng nhập, API, MySQL ở mức vừa phải thì hosting iNET có Node.js vẫn có thể sử dụng được.

---

## 17. Tóm tắt ngắn gọn

Cần làm các bước chính:

```text
1. Tạo subdomain api.yourdomain.com
2. Tạo Node.js App cho frontend Next.js
3. Tạo Node.js App cho backend NestJS/Express
4. Cấu hình biến môi trường
5. Clone source code từ GitHub về hosting
6. Build frontend và backend
7. Cấu hình GitHub Actions để auto deploy
8. Push code vào main để website tự cập nhật
```

Sau khi hoàn tất, quy trình deploy chỉ còn:

```bash
git add .
git commit -m "update"
git push origin main
```

Website sẽ tự động cập nhật theo source code mới.
