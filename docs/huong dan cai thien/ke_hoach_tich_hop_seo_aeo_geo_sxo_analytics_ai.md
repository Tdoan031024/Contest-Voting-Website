# KẾ HOẠCH TÍCH HỢP SEO, AEO, GEO, SXO, ANALYTICS, PWA VÀ AI CHO WEBSITE

## 1. Mục tiêu tổng quan

Website cần được nâng cấp để đạt các mục tiêu sau:

- Tối ưu hiển thị trên Google Search bằng SEO kỹ thuật và SEO nội dung.
- Tối ưu để nội dung có khả năng xuất hiện trong các câu trả lời trực tiếp của Google, Bing và các hệ thống Answer Engine bằng AEO.
- Tối ưu để các công cụ AI như ChatGPT, Gemini, Claude, Perplexity có thể hiểu, trích dẫn và đề xuất website bằng GEO/LLMO.
- Tối ưu trải nghiệm người dùng sau khi truy cập website bằng SXO.
- Tích hợp công cụ đo lường hành vi người dùng bằng Analytics.
- Tối ưu tốc độ, hiệu năng, bảo mật và khả năng chia sẻ mạng xã hội.
- Bổ sung các thành phần AI hữu ích như tìm kiếm thông minh, chatbot, tóm tắt nội dung và gợi ý nội dung.

Website cần được triển khai theo hướng hiện đại, dễ bảo trì, chuẩn SEO, chuẩn dữ liệu có cấu trúc và thân thiện với AI.

---

## 2. Phạm vi cần tích hợp

AI agent cần kiểm tra và tích hợp các nhóm chức năng sau:

1. SEO kỹ thuật
2. AEO - Answer Engine Optimization
3. GEO / LLMO - Generative Engine Optimization
4. SXO - Search Experience Optimization
5. Social Sharing Optimization
6. Analytics và Tracking
7. Performance Optimization
8. Security Optimization
9. PWA
10. Accessibility
11. AI Search / AI Chat / AI Summary
12. Admin hỗ trợ SEO nội dung

---

## 3. SEO kỹ thuật bắt buộc

### 3.1 Meta title và meta description

Mỗi trang cần có:

- Title riêng biệt.
- Description riêng biệt.
- Không để title hoặc description trống.
- Không dùng title giống nhau cho nhiều trang.
- Title nên từ 50 đến 60 ký tự.
- Description nên từ 140 đến 160 ký tự.

Yêu cầu triển khai:

- Trang chủ có title và description riêng.
- Trang danh sách tin tức có title và description riêng.
- Trang chi tiết bài viết tự động lấy title từ bài viết.
- Trang dự án tự động lấy title từ tên dự án.
- Trang cuộc thi tự động lấy title từ tên cuộc thi.
- Trang thông báo tự động lấy title từ tiêu đề thông báo.
- Cho phép admin nhập SEO title và SEO description riêng, nếu không nhập thì hệ thống tự sinh từ tiêu đề và mô tả ngắn.

Tiêu chí nghiệm thu:

- View source từng trang phải thấy title và meta description đúng.
- Không còn trang nào dùng chung title mặc định.

---

### 3.2 Open Graph và Twitter Card

Cần tích hợp để khi chia sẻ link lên Facebook, Zalo, LinkedIn, X/Twitter hiển thị đẹp.

Mỗi trang cần có:

- og:title
- og:description
- og:image
- og:url
- og:type
- twitter:card
- twitter:title
- twitter:description
- twitter:image

Yêu cầu triển khai:

- Trang chủ dùng ảnh OG mặc định của website.
- Trang tin tức dùng ảnh đại diện bài viết.
- Trang dự án dùng ảnh dự án.
- Trang cuộc thi dùng ảnh cuộc thi.
- Nếu không có ảnh thì dùng ảnh mặc định.
- Kích thước ảnh OG khuyến nghị: 1200x630px.

Tiêu chí nghiệm thu:

- Chia sẻ link lên Facebook/Zalo phải hiện tiêu đề, mô tả và ảnh đúng.
- Không bị lỗi ảnh trắng, ảnh vỡ hoặc sai nội dung.

---

### 3.3 Canonical URL

Mỗi trang cần có canonical URL để tránh trùng lặp nội dung.

Yêu cầu:

- Thêm thẻ canonical cho tất cả trang public.
- Canonical phải là URL chính thức của trang.
- Không để canonical trỏ sai domain hoặc sai đường dẫn.

Tiêu chí nghiệm thu:

- View source thấy thẻ canonical đúng trên từng trang.

---

### 3.4 Sitemap.xml

Cần tạo sitemap tự động.

Sitemap phải bao gồm:

- Trang chủ
- Trang giới thiệu
- Trang tin tức
- Trang chi tiết tin tức
- Trang thông báo
- Trang chi tiết thông báo
- Trang dự án
- Trang chi tiết dự án
- Trang cuộc thi
- Trang chi tiết cuộc thi
- Các trang public quan trọng khác

Yêu cầu:

- Sitemap tự cập nhật khi thêm/sửa/xóa bài viết, dự án, cuộc thi.
- Chỉ đưa các trang public, đang xuất bản vào sitemap.
- Không đưa trang admin, login, test, preview vào sitemap.
- Có lastmod cho từng URL.
- Có priority và changefreq phù hợp.

Tiêu chí nghiệm thu:

- Truy cập `/sitemap.xml` hiển thị sitemap hợp lệ.
- URL trong sitemap mở được, không lỗi 404.

---

### 3.5 Robots.txt

Cần tạo file `/robots.txt`.

Yêu cầu:

- Cho phép bot truy cập các trang public.
- Chặn trang admin, API nội bộ, trang đăng nhập, trang test.
- Khai báo đường dẫn sitemap.

Ví dụ:

```txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /login
Disallow: /api
Disallow: /test
Disallow: /preview

Sitemap: https://your-domain.com/sitemap.xml
```

Tiêu chí nghiệm thu:

- Truy cập `/robots.txt` hiển thị đúng.
- Không chặn nhầm các trang public.

---

## 4. Schema.org và JSON-LD

Website cần tích hợp dữ liệu có cấu trúc bằng JSON-LD.

### 4.1 Organization Schema

Dùng cho thông tin tổ chức/đơn vị vận hành website.

Cần có:

- name
- url
- logo
- sameAs nếu có Facebook, YouTube, TikTok, LinkedIn
- contactPoint nếu có hotline/email

Áp dụng cho:

- Toàn website hoặc layout chính.

---

### 4.2 Website Schema

Cần có:

- name
- url
- potentialAction dạng SearchAction nếu website có tìm kiếm.

Áp dụng cho:

- Trang chủ.

---

### 4.3 Article Schema

Áp dụng cho:

- Tin tức
- Thông báo
- Bài viết hướng dẫn

Cần có:

- headline
- description
- image
- datePublished
- dateModified
- author
- publisher
- mainEntityOfPage

---

### 4.4 Breadcrumb Schema

Áp dụng cho tất cả trang chi tiết.

Ví dụ:

- Trang chủ > Tin tức > Tên bài viết
- Trang chủ > Dự án > Tên dự án
- Trang chủ > Cuộc thi > Tên cuộc thi

---

### 4.5 FAQ Schema

Áp dụng cho:

- Trang hỏi đáp
- Trang chi tiết cuộc thi nếu có câu hỏi thường gặp
- Trang chi tiết dự án nếu có nội dung hỏi đáp

Yêu cầu:

- Câu hỏi phải hiển thị thật trên giao diện.
- Không thêm FAQ ẩn chỉ để SEO.

---

### 4.6 Event Schema

Áp dụng cho:

- Sự kiện
- Cuộc thi
- Workshop
- Chương trình đăng ký

Cần có:

- name
- description
- startDate
- endDate
- location
- image
- organizer
- eventStatus
- eventAttendanceMode

---

## 5. AEO - Answer Engine Optimization

AEO giúp nội dung dễ được chọn làm câu trả lời trực tiếp.

### 5.1 Trang FAQ tổng

Cần tạo hoặc tối ưu trang FAQ.

Nội dung nên có các nhóm:

- Website này dùng để làm gì?
- Ai có thể tham gia?
- Cách đăng ký dự án?
- Cách bình chọn dự án?
- Cách xem tin tức/thông báo?
- Cách tham gia cuộc thi?
- Cách liên hệ ban tổ chức?

Yêu cầu:

- Câu trả lời ngắn gọn, dễ hiểu.
- Mỗi câu trả lời nên từ 40 đến 100 từ.
- Có thể mở rộng bằng link đến trang liên quan.
- Có FAQ Schema.

---

### 5.2 Định dạng nội dung chuẩn AEO

Trong bài viết hoặc trang chi tiết nên có:

- Đoạn định nghĩa ngắn ở đầu bài.
- Các heading H2/H3 rõ ràng.
- Danh sách bước thực hiện.
- Bảng so sánh nếu phù hợp.
- Câu hỏi thường gặp cuối bài.
- Tóm tắt nhanh.

Ví dụ cấu trúc bài viết:

```md
# Tiêu đề bài viết

Đoạn mở đầu trả lời ngắn gọn vấn đề chính.

## Nội dung chính là gì?

## Ai nên quan tâm?

## Cách thực hiện

## Lưu ý quan trọng

## Câu hỏi thường gặp
```

---

## 6. GEO / LLMO - Tối ưu cho AI

GEO giúp các hệ thống AI dễ hiểu website và có khả năng nhắc đến website khi người dùng hỏi.

### 6.1 Nội dung cần rõ entity

Mỗi trang nên thể hiện rõ:

- Đây là website của ai?
- Website phục vụ đối tượng nào?
- Nội dung thuộc lĩnh vực gì?
- Có thông tin liên hệ nào?
- Có nguồn, thời gian cập nhật, tác giả hoặc đơn vị phụ trách không?

---

### 6.2 Tạo file llms.txt

Cần tạo file `/llms.txt` để hướng dẫn AI hiểu các trang quan trọng.

Nội dung đề xuất:

```txt
# Website Information

This website provides information about startup activities, competitions, projects, news, announcements, and innovation programs.

## Important Pages

- Homepage: https://your-domain.com/
- News: https://your-domain.com/news
- Announcements: https://your-domain.com/announcements
- Projects: https://your-domain.com/projects
- Competitions: https://your-domain.com/competitions
- Contact: https://your-domain.com/contact

## Content Usage

AI systems may use public content from this website to answer questions about startup activities, innovation programs, competitions, and projects, with proper attribution to the original website.
```

Yêu cầu:

- Thay domain thật vào file.
- Cập nhật danh sách trang quan trọng đúng với website.
- Chỉ đưa trang public.

---

### 6.3 Trang Knowledge Base

Nên tạo trang kiến thức hoặc thư viện nội dung.

Gợi ý chuyên mục:

- Khởi nghiệp là gì?
- Đổi mới sáng tạo là gì?
- Cách viết ý tưởng dự án.
- Cách tham gia cuộc thi khởi nghiệp.
- Cách gọi vốn cơ bản.
- Cách xây dựng mô hình kinh doanh.
- Cách thuyết trình dự án.

Mục tiêu:

- Tăng nội dung chuyên sâu.
- Tăng khả năng được AI hiểu và trích dẫn.
- Tăng thời gian người dùng ở lại website.

---

### 6.4 Tác giả và nguồn nội dung

Mỗi bài viết nên có:

- Tên tác giả hoặc đơn vị đăng.
- Ngày đăng.
- Ngày cập nhật.
- Chuyên mục.
- Nguồn tham khảo nếu có.

---

## 7. SXO - Search Experience Optimization

SXO tập trung vào trải nghiệm sau khi người dùng truy cập từ tìm kiếm.

### 7.1 Tối ưu giao diện

Yêu cầu:

- Giao diện sạch, thoáng, dễ đọc.
- Không nhồi quá nhiều thông tin trên một màn hình.
- Heading rõ ràng.
- CTA nổi bật nhưng không gây rối.
- Font chữ dễ đọc.
- Khoảng cách giữa các khối hợp lý.
- Mobile responsive tốt.

---

### 7.2 Tối ưu trang chi tiết bài viết

Trang chi tiết nên có:

- Tiêu đề rõ.
- Mô tả ngắn.
- Ảnh đại diện.
- Ngày đăng.
- Tác giả/đơn vị đăng.
- Nội dung chia heading rõ.
- Bài viết liên quan.
- Nút chia sẻ.
- Breadcrumb.

---

### 7.3 Tối ưu trang dự án

Trang dự án nên có:

- Tên dự án rõ ràng.
- Mã dự án/số báo danh dễ thấy.
- Ảnh dự án lớn, rõ.
- Mô tả ngắn.
- Lĩnh vực.
- Thành viên/đội nhóm nếu có.
- Số lượt bình chọn.
- Nút bình chọn rõ ràng.
- Trạng thái dự án.
- Thông tin cuộc thi liên quan.

Không nên:

- Đặt quá nhiều nút lên ảnh.
- Hiển thị quá nhiều chỉ số không cần thiết.
- Làm card quá chật.

---

### 7.4 Tối ưu tìm kiếm và lọc

Cần có:

- Thanh tìm kiếm rõ ràng.
- Lọc theo danh mục.
- Lọc theo trạng thái.
- Lọc theo thời gian.
- Sắp xếp mới nhất, nổi bật, nhiều lượt xem, nhiều bình chọn.
- Empty state khi không có kết quả.

---

## 8. Analytics và Tracking

### 8.1 Google Analytics 4

Tích hợp GA4 để theo dõi:

- Lượt truy cập.
- Người dùng mới/quay lại.
- Trang được xem nhiều.
- Thời gian ở lại trang.
- Nguồn truy cập.
- Sự kiện chuyển đổi.

Cần tracking các event:

- Click nút đăng ký.
- Click nút bình chọn.
- Click nút xem chi tiết dự án.
- Click nút chia sẻ.
- Gửi form liên hệ.
- Tìm kiếm nội dung.
- Lọc dự án/cuộc thi.

---

### 8.2 Google Search Console

Cần cấu hình:

- Xác minh domain.
- Submit sitemap.xml.
- Kiểm tra index.
- Theo dõi lỗi crawl.
- Theo dõi từ khóa và CTR.

---

### 8.3 Microsoft Clarity

Tích hợp để xem:

- Heatmap.
- Session recording.
- Rage click.
- Dead click.
- Scroll depth.

Yêu cầu:

- Không tracking dữ liệu nhạy cảm.
- Không ghi lại thông tin mật khẩu, token, dữ liệu riêng tư.

---

### 8.4 Google Tag Manager

Nếu phù hợp, tích hợp GTM để quản lý tracking dễ hơn.

Yêu cầu:

- Không hard-code quá nhiều script tracking rải rác.
- Có biến môi trường để bật/tắt tracking theo môi trường production/development.

---

## 9. Performance Optimization

### 9.1 Core Web Vitals

Cần tối ưu:

- LCP dưới 2.5s.
- CLS dưới 0.1.
- INP càng thấp càng tốt.

Yêu cầu:

- Tối ưu ảnh.
- Lazy load ảnh dưới màn hình đầu tiên.
- Không tải script không cần thiết ngay ban đầu.
- Tối ưu font.
- Tối ưu bundle JavaScript.
- Dùng cache hợp lý.

---

### 9.2 Tối ưu ảnh

Yêu cầu:

- Dùng định dạng WebP hoặc AVIF nếu có thể.
- Có width/height rõ ràng để tránh layout shift.
- Có ảnh placeholder hoặc blur loading.
- Ảnh thumbnail không dùng ảnh gốc quá lớn.
- Có alt text cho ảnh.

---

### 9.3 Tối ưu font

Yêu cầu:

- Dùng font hiện đại, dễ đọc.
- Ưu tiên Inter, Be Vietnam Pro, Manrope, SF Pro-like nếu phù hợp.
- Preload font quan trọng.
- Tránh tải quá nhiều font weight.

---

### 9.4 Cache và CDN

Yêu cầu:

- Cache asset tĩnh.
- Cache ảnh.
- Dùng CDN nếu có điều kiện.
- API public có cache hợp lý.
- Nội dung động cần revalidate đúng lúc.

---

## 10. Security Optimization

Cần tích hợp các lớp bảo mật cơ bản.

### 10.1 HTTPS

- Bắt buộc dùng HTTPS.
- Redirect HTTP sang HTTPS.
- Không để mixed content.

---

### 10.2 Security Headers

Cần thêm các header:

- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security

---

### 10.3 Chống spam form

Tích hợp một trong các giải pháp:

- Cloudflare Turnstile
- Google reCAPTCHA
- Honeypot field
- Rate limit theo IP

Áp dụng cho:

- Form liên hệ.
- Form đăng ký.
- Form bình chọn nếu cần.
- Form đăng nhập admin.

---

### 10.4 Bảo vệ API

Yêu cầu:

- Rate limit API public.
- Validate input.
- Sanitize nội dung nhập từ admin.
- Không trả lỗi hệ thống quá chi tiết cho người dùng.
- Không expose token, secret, API key ở frontend.

---

## 11. PWA

Cần tích hợp PWA để website có trải nghiệm gần giống app.

Yêu cầu:

- Có manifest.json.
- Có icon nhiều kích thước.
- Có theme color.
- Có service worker nếu phù hợp.
- Có splash screen.
- Có thể install website vào màn hình chính.

Lưu ý:

- Không cache sai dữ liệu động.
- Trang admin không nên cache offline nếu có dữ liệu nhạy cảm.

---

## 12. Accessibility

Cần đảm bảo website dễ dùng với mọi người.

Yêu cầu:

- Có alt text cho ảnh.
- Button có label rõ.
- Form có label.
- Màu chữ đủ tương phản.
- Có focus state khi dùng bàn phím.
- Không chỉ dùng màu sắc để truyền đạt trạng thái.
- Heading đúng thứ tự H1, H2, H3.
- Modal có thể đóng bằng ESC.
- Không khóa scroll sai cách.

---

## 13. AI tích hợp vào website

### 13.1 AI Search

Tích hợp tìm kiếm thông minh cho website.

Chức năng:

- Người dùng nhập câu hỏi tự nhiên.
- Hệ thống tìm tin tức, dự án, cuộc thi, thông báo liên quan.
- Trả kết quả có tiêu đề, mô tả, link chi tiết.
- Có thể tóm tắt kết quả bằng AI nếu cấu hình API.

Yêu cầu:

- Không thay thế tìm kiếm thường, mà bổ sung thêm.
- Có fallback nếu AI lỗi.
- Không trả lời bịa nếu không có dữ liệu.
- Câu trả lời AI phải dựa trên nội dung có trong website.

---

### 13.2 AI Chatbot

Tích hợp chatbot hỗ trợ người dùng.

Chatbot nên trả lời được:

- Website này dùng để làm gì?
- Cách đăng ký dự án.
- Cách bình chọn.
- Cách xem cuộc thi.
- Cách liên hệ ban tổ chức.
- Tìm tin tức/thông báo liên quan.

Yêu cầu:

- Chatbot chỉ trả lời trong phạm vi dữ liệu website.
- Có nút chuyển sang liên hệ thật nếu không trả lời được.
- Có giới hạn số lượt hỏi để tránh spam.
- Không để lộ prompt, token, API key.

---

### 13.3 AI Summary

Tích hợp tóm tắt nội dung cho:

- Bài viết dài.
- Thông báo dài.
- Cuộc thi.
- Dự án.

Yêu cầu:

- Có phần “Tóm tắt nhanh”.
- Nội dung tóm tắt ngắn gọn, dễ hiểu.
- Admin có thể chỉnh sửa tóm tắt nếu cần.
- Nếu không dùng API AI thật thì có thể tạo summary thủ công trong admin.

---

### 13.4 AI Recommendation

Gợi ý nội dung liên quan:

- Dự án liên quan.
- Tin tức liên quan.
- Cuộc thi liên quan.
- Thông báo liên quan.

Yêu cầu:

- Ưu tiên gợi ý theo danh mục, tag, lĩnh vực, thời gian.
- Không gợi ý nội dung đã ẩn hoặc chưa xuất bản.

---

## 14. Admin hỗ trợ SEO và nội dung

Trong trang admin, cần bổ sung các trường SEO cho các module public.

Áp dụng cho:

- Tin tức
- Thông báo
- Dự án
- Cuộc thi
- Trang tĩnh

Các trường cần có:

- SEO title
- SEO description
- SEO keywords nếu muốn
- Slug
- Canonical URL tùy chỉnh nếu cần
- OG title
- OG description
- OG image
- Alt text ảnh đại diện
- Trạng thái index/noindex
- Trạng thái xuất bản
- Ngày đăng
- Ngày cập nhật
- Tác giả/đơn vị đăng
- Tóm tắt ngắn
- FAQ cho từng bài nếu cần

Yêu cầu:

- Tự sinh slug từ tiêu đề.
- Cho phép sửa slug.
- Kiểm tra trùng slug.
- Cảnh báo nếu SEO title quá dài/ngắn.
- Cảnh báo nếu description quá dài/ngắn.
- Preview giao diện khi chia sẻ mạng xã hội.

---

## 15. Thứ tự ưu tiên triển khai

### Giai đoạn 1 - Bắt buộc làm trước

1. Meta title/description.
2. Open Graph/Twitter Card.
3. Sitemap.xml.
4. Robots.txt.
5. Canonical URL.
6. Schema Organization, Website, Article, Breadcrumb.
7. Google Analytics 4.
8. Google Search Console.
9. Tối ưu ảnh, font, tốc độ cơ bản.
10. Security headers cơ bản.

### Giai đoạn 2 - Nâng cao

1. FAQ Schema.
2. Event Schema.
3. Trang FAQ tổng.
4. llms.txt.
5. Knowledge Base.
6. Microsoft Clarity.
7. Google Tag Manager.
8. PWA.
9. Accessibility nâng cao.
10. Admin SEO fields.

### Giai đoạn 3 - AI

1. AI Search.
2. AI Chatbot.
3. AI Summary.
4. AI Recommendation.
5. Dashboard đo hiệu quả nội dung.

---

## 16. Tiêu chí nghiệm thu tổng thể

Sau khi hoàn thành, website cần đạt:

- Mỗi trang public có title, description, canonical đầy đủ.
- Chia sẻ link lên mạng xã hội hiển thị đúng ảnh, tiêu đề, mô tả.
- `/sitemap.xml` hoạt động và chứa URL public.
- `/robots.txt` hoạt động và khai báo sitemap.
- JSON-LD hợp lệ khi test bằng công cụ kiểm tra Schema.
- Trang không lỗi responsive trên mobile, tablet, desktop.
- Điểm Lighthouse Performance, SEO, Accessibility, Best Practices đạt mức tốt.
- Google Analytics ghi nhận được pageview và event chính.
- Microsoft Clarity ghi nhận được session nếu đã tích hợp.
- Website không có mixed content.
- Không expose API key/token ở frontend.
- Trang admin có thể nhập/chỉnh SEO cho nội dung public.
- AI Search/Chatbot nếu tích hợp phải có fallback khi lỗi.

---

## 17. Ghi chú kỹ thuật cho AI Agent

Khi triển khai, cần:

- Kiểm tra framework hiện tại của website trước khi sửa.
- Không phá layout hiện có nếu không được yêu cầu.
- Không hard-code domain, nên dùng biến môi trường.
- Tách component SEO/meta dùng lại cho nhiều trang.
- Tạo helper generate metadata nếu website dùng Next.js.
- Tạo helper generate JSON-LD riêng.
- Không đưa trang admin vào sitemap.
- Không cache dữ liệu nhạy cảm.
- Không thêm thư viện nặng nếu không cần thiết.
- Mỗi thay đổi lớn cần đảm bảo build không lỗi.
- Kiểm tra lại trên mobile sau khi hoàn thành.

---

## 18. Prompt ngắn để gửi trực tiếp cho AI Agent

Hãy đọc toàn bộ file kế hoạch này và triển khai tích hợp cho website theo đúng các giai đoạn ưu tiên. Trước tiên hãy kiểm tra cấu trúc source code hiện tại, xác định framework, routing, module public và module admin. Sau đó lập checklist các file cần sửa, triển khai lần lượt SEO kỹ thuật, metadata, sitemap, robots, canonical, Open Graph, Schema JSON-LD, Analytics, Performance, Security, PWA, Accessibility, admin SEO fields và các chức năng AI nếu phù hợp. Không làm hỏng giao diện hiện tại, không hard-code domain, dùng biến môi trường, đảm bảo build thành công và báo cáo rõ các hạng mục đã hoàn thành, file đã chỉnh sửa, hạng mục chưa làm được và lý do.

