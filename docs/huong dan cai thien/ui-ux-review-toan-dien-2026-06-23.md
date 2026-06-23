# UI/UX Review toàn diện — Contest Voting Platform

**Ngày đánh giá:** 23/06/2026  
**Phạm vi:** Toàn bộ website, gồm trang chủ, giới thiệu, bảng xếp hạng, thể lệ/hướng dẫn, lộ trình, đăng nhập/đăng ký, chi tiết dự án, modal bình chọn và các thành phần dùng chung.  
**Mục tiêu chuẩn:** Chất lượng sản phẩm thương mại hiện đại theo các nguyên tắc thường thấy ở Apple, Linear, Notion, Stripe và SaaS cao cấp: rõ ràng, nhất quán, tiết chế, nhanh, dễ tiếp cận và tạo niềm tin.

> **Lưu ý phương pháp:** Các route chính đã được kiểm tra ở trạng thái đang chạy; đồng thời rà soát DOM SSR, component React, CSS, breakpoint, asset và luồng API. Công cụ chụp ảnh/điều khiển viewport trực tiếp không kết nối được trong phiên review, vì vậy các nhận định thị giác responsive được đối chiếu từ CSS và cấu trúc layout hiện tại. Trước khi phát hành cần chạy lại vòng visual regression thật trên các viewport ở mục 3.18.

---

## Tóm tắt điều hành

Website đã có nền tảng hình ảnh tốt: nhận diện xanh dương/xanh ngọc rõ, nhiều khu vực đã được chăm chút, trang giới thiệu có cấu trúc nội dung khá đầy đủ, bảng xếp hạng và bục vinh danh tạo được cảm giác sự kiện. Tuy nhiên, mức hoàn thiện hiện tại vẫn thấp hơn chuẩn SaaS thương mại ở bốn điểm chính:

1. **Hiệu năng:** video nền gần 50 MB, nhiều ảnh 1–2 MB, phần lớn trang chạy client-side và có nhiều vòng polling.
2. **Accessibility:** modal/drawer chưa quản lý focus và bàn phím đúng chuẩn; một số control thiếu nhãn, trạng thái và vùng chạm tối thiểu.
3. **Tính nhất quán:** hai hệ màu thương hiệu, nhiều cỡ chữ tùy ý, 241 `!important`, phong cách trang chi tiết dự án lệch khỏi phần còn lại.
4. **Độ tin cậy sản phẩm:** thống kê trang chủ đang hiển thị `0`, nút đổi ngôn ngữ chưa thật sự dịch nội dung, “quên mật khẩu” là tương tác giả, checkbox đồng ý điều khoản bình chọn được chọn sẵn.

**Điểm hoàn thiện hiện tại: 63/100.** Giao diện có thể trình diễn tốt, nhưng chưa nên xem là đạt chuẩn sản phẩm thương mại cao cấp cho đến khi xử lý các mục P0 và P1.

## Trạng thái triển khai — cập nhật ngày 23/06/2026

Đã triển khai vòng cải tiến đầu tiên trực tiếp vào frontend:

- Thiết lập lại token màu, semantic color, radius, shadow và focus ring dùng chung.
- Header/container chuyển sang chiều rộng mềm; vùng chạm 44 px; menu mobile có `aria-expanded`, `aria-current`, focus trap, Escape, khóa cuộn và phục hồi focus.
- Loại bỏ polling localStorage/hash dày, bỏ utility chống DevTools và giảm tần suất tải settings/danh sách.
- Hero có H1/CTA HTML thật, carousel control, ảnh `object-cover`, giảm dữ liệu video trên mobile/Save-Data/reduced-motion.
- Thay favicon PNG 2 MB bằng SVG nhẹ; video nội dung chuyển sang `preload="none"`.
- Thống kê trang chủ dùng dữ liệu thật thay vì ba số `0`; dữ liệu fallback đổi sang ngữ cảnh dự án khởi nghiệp.
- Modal bình chọn có dialog semantic, focus trap, Escape, khóa cuộn, stepper, safe-area và consent mặc định chưa chọn.
- Form đăng nhập/đăng ký có label, autocomplete, input mode, loading/disabled state; thay luồng “quên mật khẩu” giả bằng liên hệ hỗ trợ thật.
- Modal đăng ký và gallery có dialog semantic, focus management và điều khiển bàn phím.
- Trang chi tiết dự án được đồng bộ màu xanh dương/xanh ngọc, có breadcrumb, sidebar sticky, feedback clipboard và chữ dễ đọc hơn.
- Bảng xếp hạng có số lượng theo bộ lọc, URL query lưu trạng thái, thời gian cập nhật tĩnh, polling chỉ khi tab hiển thị và touch target 44 px.
- Tab/FAQ trang hướng dẫn được bổ sung ARIA và điều khiển phím mũi tên.
- Timeline xác định mốc hiện tại theo ngày, có `aria-current` và hướng dẫn cuộn trên mobile.
- Footer cho phép địa chỉ xuống dòng, link mạng xã hội mở tab mới an toàn; mobile giảm số action nổi.
- Toast có live region/role phù hợp, cỡ chữ lớn hơn và nút đóng truy cập được.
- Đã chạy TypeScript, production build và kiểm tra HTTP toàn bộ route chính thành công.

Các hạng mục cần vòng tiếp theo vì liên quan asset/source data hoặc kiến trúc lớn: nén/chuyển mã video 49,5 MB, tạo thumbnail production cho từng dự án, chuyển root layout sang Server Component, server-render dữ liệu chi tiết dự án, phân trang/SSE khi dữ liệu lớn và visual regression thật trên toàn bộ viewport.

---

# 1. Điểm mạnh hiện tại

## 1.1. Nhận diện và cảm giác tổng thể

- Bảng màu xanh dương – xanh ngọc phù hợp lĩnh vực giáo dục, đổi mới sáng tạo và công nghệ.
- Font Inter đã được lưu cục bộ với nhiều trọng lượng, phù hợp giao diện sản phẩm số và hỗ trợ tiếng Việt tốt.
- Light theme và dark theme đã có biến màu nền tảng; độ tương phản phần văn bản chính nhìn chung tốt.
- Các card có bo góc, viền và shadow tạo được chiều sâu; bảng xếp hạng và bục vinh danh có điểm nhấn rõ.
- Nội dung không còn cảm giác của một website mẫu đơn giản; đã có các khối thông tin, bộ lọc, timeline, CTA và trạng thái dữ liệu.

## 1.2. Cấu trúc thông tin

- Header bao phủ các route quan trọng và có menu mobile riêng.
- Trang giới thiệu có H1 rõ, tagline, tổng quan, lĩnh vực/quyền lợi, quy mô/đối tượng, lộ trình và các mốc quan trọng.
- Trang thể lệ dùng luồng từng bước, bảng gói bình chọn, FAQ và CTA; cấu trúc phù hợp cho người dùng mới.
- Trang bảng xếp hạng đã có tìm kiếm, lọc nhóm, sắp xếp và tách top 3 khỏi danh sách còn lại.
- Trang chi tiết dự án có đủ thông tin, hình ảnh, thông tin đội thi và hành động bình chọn/chia sẻ.

## 1.3. Responsive nền tảng

- Tailwind đã có các mốc `sm`, `md`, `lg`, `xl`, `2xl` và breakpoint tùy chỉnh cho mobile/desktop nhỏ.
- Footer giảm từ bốn cột xuống hai rồi một cột theo kích thước màn hình.
- Bảng xếp hạng và bục vinh danh đã có cách xếp lại trên mobile.
- Form đăng nhập/đăng ký, modal bình chọn và timeline đã có layout thu gọn theo breakpoint.

## 1.4. Trạng thái và tương tác

- Có skeleton/loading, empty state và fallback dữ liệu ở một số màn hình.
- Có toast/alert dùng chung.
- Countdown và trạng thái đóng/mở đăng ký được tính theo thời gian thay vì chỉ ghi nội dung tĩnh.
- Hiệu ứng chuyển động, hover, count-up và scroll reveal đã tạo cảm giác sinh động.
- Đã có hỗ trợ `prefers-reduced-motion` tại một số khu vực.

## 1.5. Nền tảng kỹ thuật có thể nâng cấp

- Các route và component đã phân tách theo chức năng, nên có thể cải tiến dần mà không phải viết lại toàn bộ.
- CSS đã dùng custom properties cho một phần màu nền, chữ, viền và thương hiệu.
- Hệ thống có API thật cho dự án, cấu hình, gói bình chọn và người dùng; không phải toàn bộ nội dung đều hard-code.

---

# 2. Danh sách vấn đề cần cải thiện

## 2.1. P0 — Phải xử lý trước khi xem là sản phẩm thương mại hoàn chỉnh

| ID | Vấn đề | Khu vực | Ảnh hưởng |
|---|---|---|---|
| P0-01 | Video nền khoảng **49,5 MB**; logo/favicon khoảng **2,07 MB**; nhiều ảnh dự án 1–1,5 MB | Hero, asset toàn site | Tải chậm, tốn dữ liệu mobile, LCP kém, trải nghiệm đầu tiên thiếu cao cấp |
| P0-02 | Modal đăng ký, bình chọn và gallery chưa hoàn chỉnh chuẩn dialog: thiếu `role="dialog"`, `aria-modal`, focus trap, Escape, phục hồi focus và khóa cuộn | Modal | Người dùng bàn phím/screen reader có thể bị mắc kẹt hoặc mất ngữ cảnh |
| P0-03 | Checkbox đồng ý điều khoản bình chọn mặc định là `true` | Modal bình chọn | Không đáp ứng nguyên tắc đồng ý chủ động; giảm độ tin cậy của giao dịch |
| P0-04 | Có tương tác chưa thực: đổi ngôn ngữ chỉ đổi nhãn/lưu localStorage; “Quên mật khẩu” dùng `href="#"`/alert | Header, đăng nhập | Tạo kỳ vọng sai, giống bản demo hơn sản phẩm hoàn thiện |
| P0-05 | Nhiều nội dung quan trọng chỉ xuất hiện sau hydration/client fetch; một số route SSR không có heading nội dung thực | Đăng nhập, chi tiết dự án, bảng xếp hạng | SEO, khả năng truy cập và độ ổn định khi mạng/JS lỗi đều giảm |
| P0-06 | Container header có các chiều rộng cố định và breakpoint chồng lấn (`768/812`, `1122`); có nguy cơ tràn ở khoảng tablet nhỏ | Header, layout | Horizontal overflow hoặc khoảng trống bất thường tại một số viewport |

## 2.2. P1 — Ảnh hưởng lớn đến cảm giác chuyên nghiệp và khả năng sử dụng

| ID | Vấn đề | Khu vực | Ảnh hưởng |
|---|---|---|---|
| P1-01 | Hai bộ màu thương hiệu đang tồn tại: `#0b5bd3/#00a99d` và `#0A2FFF/#79BCC2` | Toàn site | Sắc xanh, trạng thái hover và gradient thiếu nhất quán |
| P1-02 | `globals.css` hơn 3.100 dòng, khoảng 241 `!important`, nhiều style block trong từng page | Toàn site | Cascade khó đoán, sửa một nơi dễ hỏng nơi khác, responsive khó kiểm soát |
| P1-03 | Quá nhiều cỡ chữ tùy ý 10–13 px và hàng chục giá trị `text-[…px]` | Toàn site | Khó đọc trên mobile, hierarchy thiếu ổn định, không đạt cảm giác SaaS cao cấp |
| P1-04 | Nhiều gradient, glow, blur, uppercase, shadow và animation cùng lúc | Toàn site | Giao diện có điểm nhấn nhưng chưa tiết chế; cạnh tranh sự chú ý với nội dung |
| P1-05 | Header cao 80 px; control 38–40 px; drawer chưa có `aria-expanded`, focus trap và Escape | Header/Menu | Vùng chạm nhỏ hơn 44 px; navigation mobile chưa chuẩn accessibility |
| P1-06 | Hero trang chủ chủ yếu là banner/video, H1 bị ẩn thị giác, thiếu value proposition và CTA chính trực tiếp | Hero | Người dùng không hiểu ngay cuộc thi là gì và cần làm gì |
| P1-07 | Banner dùng `object-contain`, có thể tạo khoảng trống/letterbox; carousel thiếu điều khiển rõ ràng | Hero | Hero trông như ảnh nhúng thay vì một phần được thiết kế cho viewport |
| P1-08 | Ba chỉ số thống kê trang chủ đang hiển thị `0` | Trang chủ | Làm giảm mạnh độ tin cậy và cảm giác website chưa có dữ liệu thật |
| P1-09 | Một số animation delay 800–2.200 ms, duration tới 2.800–3.200 ms | Trang chủ/giới thiệu | Người dùng phải chờ nội dung; cảm giác chậm và phô diễn quá mức |
| P1-10 | Card dự án dùng ảnh lặp, ảnh thô lớn, thiếu `srcset/sizes`; một số ảnh chưa có kích thước ổn định | Card/Danh sách | Nội dung khó phân biệt, tốn băng thông, có nguy cơ CLS |
| P1-11 | Bảng xếp hạng có CSS bục vinh danh trùng ở global và page; filter sticky có thể chiếm nhiều chiều cao mobile | Bục vinh danh/BXH | Khó bảo trì; viewport nhỏ bị giảm vùng đọc |
| P1-12 | Bộ lọc nhóm có thể dẫn tới danh sách rỗng nhưng chưa thể hiện số lượng/trạng thái rõ | Danh sách dự án | Người dùng tưởng hệ thống lỗi hoặc không hiểu bộ lọc |
| P1-13 | Chưa có phân trang/virtualization; polling lại toàn bộ danh sách mỗi 10 giây | Danh sách dự án | Không mở rộng tốt khi số dự án tăng; tốn tài nguyên và gây thay đổi bất ngờ |
| P1-14 | Form thiếu liên kết `label`–`input`, `autocomplete`, `type="tel"`, validation tại trường và thông báo lỗi rõ | Đăng nhập/đăng ký | Nhập liệu chậm, khó dùng với password manager và screen reader |
| P1-15 | Trang đăng nhập dùng phong cách dark glass riêng rồi sửa light mode bằng nhiều `!important` | Đăng nhập | Theme thiếu nhất quán và dễ phát sinh lỗi tương phản |
| P1-16 | Modal bình chọn chưa có stepper; chữ điều khoản 11 px; đóng giữa giao dịch không cảnh báo | Bình chọn | Luồng thanh toán thiếu an tâm, người dùng khó biết đang ở bước nào |
| P1-17 | Trang chi tiết dự án dùng màu emerald/beige/cam, khác rõ hệ xanh dương/xanh ngọc | Chi tiết dự án | Trải nghiệm giống chuyển sang một sản phẩm khác |
| P1-18 | Footer có địa chỉ `white-space: nowrap`; link ngoài có thể điều hướng khỏi trang; action nổi che nội dung | Footer/Mobile | Tràn chữ, mất phiên làm việc, nội dung mobile bị che |
| P1-19 | Polling localStorage mỗi 2 giây, settings mỗi 5 giây, hash mỗi 200 ms và nhiều request trùng | App shell | Hao CPU/pin, tạo công việc nền không cần thiết |
| P1-20 | Toàn bộ layout là client component; có tải font/style thủ công trùng với font local | Kiến trúc giao diện | Bundle lớn, hydration nặng, render đầu chậm |
| P1-21 | Thiếu token semantic cho success/warning/danger/focus; nhiều màu hard-code | Màu sắc/Trạng thái | Trạng thái không đồng nhất và khó bảo đảm contrast |
| P1-22 | Chưa có safe-area cho thiết bị tai thỏ và modal mobile dùng gần 95vh | Mobile/Modal | CTA hoặc nút đóng có thể sát/cắt bởi vùng hệ thống |

## 2.3. P2 — Chi tiết tinh chỉnh để đạt cảm giác 9–10/10

| ID | Vấn đề | Khu vực | Ảnh hưởng |
|---|---|---|---|
| P2-01 | Navigation thiếu `aria-current="page"`; focus ring bị tắt ở một số link/button | Header/Buttons | Khó định hướng bằng bàn phím |
| P2-02 | Tooltip của nút nổi chủ yếu dựa trên hover | Action nổi | Không hữu ích trên thiết bị cảm ứng |
| P2-03 | Icon/emoji trang thể lệ và CTA chưa cùng một hệ icon | Thể lệ | Cảm giác ghép nhiều phong cách |
| P2-04 | Viết hoa toàn bộ ở nhiều tiêu đề phụ/nhãn | Typography | Độ đọc giảm và giao diện hơi “sự kiện”, chưa giống sản phẩm cao cấp |
| P2-05 | Đoạn “Tổng quan cuộc thi” căn đều trên mobile có thể tạo khoảng trắng bất thường | Giới thiệu | Nhịp đọc tiếng Việt không tự nhiên trên màn hình hẹp |
| P2-06 | Quick nav sticky cộng header cố định chiếm nhiều không gian | Giới thiệu/Tablet | Nội dung bị ép theo chiều dọc |
| P2-07 | Timeline ngang trên mobile chưa có dấu hiệu rõ rằng có thể cuộn | Lộ trình | Người dùng bỏ sót các mốc |
| P2-08 | Gallery/share chưa xử lý đầy đủ lỗi clipboard; class `animate-all` không tồn tại | Chi tiết dự án | Feedback không chắc chắn; hiệu ứng dự kiến không chạy |
| P2-09 | Dữ liệu top 3 dùng cùng ảnh mẫu và cùng nhóm | Bục vinh danh | Khó tạo cảm giác uy tín dù layout tốt |
| P2-10 | Sponsor hiển thị như một banner lớn thay vì logo độc lập có nhãn | Trang chủ | Khó truy cập, kém linh hoạt responsive |
| P2-11 | Chưa thống nhất empty/error/offline state giữa các trang | Toàn site | Mỗi khu vực phản ứng khác nhau khi API lỗi |
| P2-12 | Thiếu breadcrumb tại trang sâu | Chi tiết dự án | Người dùng khó quay lại đúng ngữ cảnh lọc/danh sách |
| P2-13 | Một số link ngoài chưa nêu rõ mở tab mới; thiếu icon external-link | Footer | Người dùng không dự đoán được hành vi |
| P2-14 | Chưa có chế độ giảm dữ liệu/giảm hiệu ứng ngoài `prefers-reduced-motion` cục bộ | Hero/Hiệu ứng | Mobile yếu vẫn phải tải asset nặng |

---

# 3. Giải pháp đề xuất cho từng vấn đề

## 3.1. Thiết lập design system duy nhất

Áp dụng trước khi tiếp tục chỉnh từng trang. Chọn **xanh dương `#0A2FFF`** làm brand chính và **cyan `#35B8C4`** làm accent; loại bỏ hai bộ màu cạnh tranh.

```css
:root {
  --color-bg: #f7f8fb;
  --color-surface: #ffffff;
  --color-surface-subtle: #f1f4f9;
  --color-text: #111827;
  --color-text-muted: #667085;
  --color-border: #e4e7ec;

  --color-brand-600: #0a2fff;
  --color-brand-700: #0825cc;
  --color-accent-500: #35b8c4;
  --color-success: #067647;
  --color-warning: #b54708;
  --color-danger: #b42318;
  --color-focus: #528bff;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --shadow-sm: 0 1px 2px rgb(16 24 40 / 6%);
  --shadow-md: 0 8px 24px rgb(16 24 40 / 8%);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}
```

Quy tắc triển khai:

- Chỉ dùng tối đa ba mức shadow trong toàn bộ sản phẩm.
- Card tiêu chuẩn dùng `radius-lg`, card nổi bật dùng `radius-xl`; không tự tạo radius mới theo từng trang.
- Gradient chỉ dùng cho Hero, CTA chính và vị trí top 1; phần nội dung còn lại ưu tiên surface phẳng.
- Loại bỏ dần `!important`, bắt đầu từ Header, Login, Podium và Footer.
- Tách `globals.css` thành `tokens.css`, `base.css`, component styles hoặc Tailwind component variants.

**Xử lý:** P1-01, P1-02, P1-04, P1-15, P1-17, P1-21.

## 3.2. Chuẩn hóa typography

Đề xuất thang chữ:

| Vai trò | Desktop | Mobile | Line-height | Weight |
|---|---:|---:|---:|---:|
| Display/Hero | 56 px | 36 px | 1.08 | 700 |
| H1 trang | 44 px | 32 px | 1.15 | 700 |
| H2 section | 32 px | 26 px | 1.2 | 700 |
| H3 card | 20 px | 18 px | 1.35 | 650–700 |
| Body lớn | 18 px | 17 px | 1.65 | 400 |
| Body | 16 px | 16 px | 1.6 | 400 |
| Meta/Label | 14 px | 14 px | 1.45 | 500–600 |
| Caption tối thiểu | 13 px | 13 px | 1.4 | 500 |

- Không dùng chữ dưới 13 px cho thông tin cần đọc hoặc thao tác.
- Hạn chế uppercase ở eyebrow rất ngắn; dùng sentence case cho tab, nút, nhãn và heading.
- Độ rộng đoạn văn nên giới hạn `65–75ch`.
- Chỉ căn đều phần tổng quan từ `min-width: 768px`; mobile chuyển về `text-align: left`.
- Xóa tải Google Font nếu Inter local đã đủ.

**Xử lý:** P1-03, P2-04, P2-05.

## 3.3. Header và menu

- Giảm header desktop còn 72 px, mobile 64 px.
- Dùng container mềm thay vì width cứng:

```css
.site-container {
  width: min(100% - 32px, 1200px);
  margin-inline: auto;
}

@media (min-width: 768px) {
  .site-container { width: min(100% - 48px, 1200px); }
}
```

- Tất cả icon button tối thiểu `44 × 44px`; focus ring `2px` có offset.
- Menu desktop chỉ chuyển sang drawer khi không đủ chỗ thực tế, đề xuất `max-width: 1023px`.
- Nút menu phải có `aria-expanded`, `aria-controls`; link active có `aria-current="page"`.
- Drawer cần focus trap, Escape để đóng, khóa scroll body và phục hồi focus về nút mở.
- Khi đóng drawer, dùng `inert` hoặc unmount để link ngoài màn hình không nhận focus.
- Chỉ giữ nút ngôn ngữ khi có i18n thật. Nếu chưa triển khai, bỏ control này khỏi production.
- Thay polling user/settings bằng Context/Zustand và phát event khi đăng nhập/cập nhật cấu hình.

**Xử lý:** P0-04, P0-06, P1-05, P1-19, P2-01.

## 3.4. Hero trang chủ

Hero cần trả lời trong 5 giây: cuộc thi gì, dành cho ai, hành động tiếp theo là gì.

Đề xuất bố cục:

- Eyebrow: “HUIT Startup 2026 · Cấp Thành phố”.
- H1 thấy được: “Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững”.
- Mô tả tối đa hai dòng.
- CTA chính: “Khám phá dự án”; CTA phụ: “Xem thể lệ”.
- Thêm thông tin tin cậy ngắn: thời hạn, số dự án hợp lệ hoặc đơn vị tổ chức.
- Dùng ảnh/video làm nền hỗ trợ, không thay thế nội dung HTML.
- Mobile dùng poster riêng tỷ lệ 4:5 hoặc 3:4; desktop 16:9/21:9.
- Nếu có carousel, thêm dots, nút trước/sau, pause và nhãn screen reader. Không tự chuyển quá nhanh.
- `object-cover` với vùng an toàn theo từng asset; không dùng `object-contain` cho full-bleed hero.

**Xử lý:** P1-06, P1-07.

## 3.5. Tối ưu asset và Core Web Vitals

Mục tiêu phát hành:

- LCP ≤ 2,5 giây ở mạng mobile 4G trung bình.
- CLS ≤ 0,1.
- INP ≤ 200 ms.
- Tổng tải đầu trang chủ nên dưới 1,5–2 MB, không phải hàng chục MB.

Việc cần làm:

1. Nén/chuyển video 49,5 MB thành nhiều phiên bản; mục tiêu desktop dưới 4–6 MB, mobile không tự tải video.
2. Dùng poster WebP/AVIF và chỉ nạp video sau `requestIdleCallback` hoặc khi Hero vào viewport.
3. Tôn trọng `prefers-reduced-motion` và `Save-Data`; hai trường hợp này chỉ hiển thị poster.
4. Tối ưu logo thành SVG/WebP; favicon tạo đúng bộ 16/32/180/192/512, không dùng ảnh 2 MB.
5. Chuyển ảnh nội dung sang `next/image`, khai báo `width`, `height`, `sizes`, `priority` chỉ cho ảnh LCP.
6. Tạo thumbnail 480/768/1200 thay vì tải ảnh gốc cho mọi card.
7. Dùng ảnh dự án riêng; ảnh placeholder phải nhẹ dưới 100 KB.

```tsx
<Image
  src={project.thumbnailUrl}
  alt={`Ảnh đại diện dự án ${project.name}`}
  width={640}
  height={400}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="aspect-[8/5] w-full object-cover"
/>
```

**Xử lý:** P0-01, P1-10, P2-09, P2-14.

## 3.6. Card dự án và danh sách dự án

Chuẩn hóa một `ProjectCard` duy nhất với các biến thể `default`, `compact`, `ranking`:

- Ảnh tỷ lệ cố định 8:5.
- Mã dự án và lĩnh vực là meta 14 px.
- Tên dự án tối đa hai dòng, không cắt nội dung thiết yếu.
- Mô tả tối đa ba dòng.
- Vote count và CTA tách rõ; không làm toàn card có quá nhiều điểm nhấn.
- Hover chỉ nâng 2–4 px và shadow nhẹ; keyboard focus có hiệu ứng tương đương.
- Thẻ/card click được phải là một link semantic; tránh lồng button trong link.

Danh sách:

- Đồng bộ search/filter/sort vào URL query để Back/Forward hoạt động đúng.
- Hiển thị số kết quả trên từng filter: `Sinh viên (18)`.
- Empty state phải nói rõ bộ lọc hiện tại và có “Xóa bộ lọc”.
- Từ 24–30 dự án trở lên, thêm phân trang hoặc “Tải thêm”; không render/poll toàn bộ.
- Dùng stale-while-revalidate/WebSocket/SSE cho số vote, không refetch toàn bộ danh sách mỗi 10 giây.
- Skeleton phải giữ đúng kích thước card để tránh layout shift.

**Xử lý:** P1-10, P1-12, P1-13, P2-11.

## 3.7. Bục vinh danh và bảng xếp hạng

- Giữ phong cách podium hiện tại nhưng giảm glow khoảng 30–40%; top 1 là điểm nhấn duy nhất dùng gradient mạnh.
- Hợp nhất CSS podium về một component/module; xóa selector trùng ở global và page.
- Desktop: thứ tự thị giác 2–1–3; DOM vẫn nên theo thứ hạng 1–2–3 để screen reader đọc đúng.
- Mobile: hiển thị card 1–2–3 theo chiều dọc, không cố duy trì hình bục quá cao.
- Sticky filter mobile rút còn một hàng: search icon mở field hoặc dùng bottom sheet cho filter nâng cao.
- Thêm “Cập nhật lúc …” tĩnh sau mỗi lần thành công, không hiển thị đồng hồ chạy từng giây.
- Khi vote thay đổi, chỉ animate con số; không reorder card khi người dùng đang đọc. Cho phép cập nhật thứ hạng sau refresh hoặc báo “Có dữ liệu mới”.
- Dữ liệu production phải có ảnh/initial riêng cho từng dự án, không dùng cùng ảnh mẫu cho top 3.

**Xử lý:** P1-11, P1-13, P2-09.

## 3.8. Trang giới thiệu

- Giữ nội dung Tổng quan hiện tại nhưng giới hạn chiều rộng nội dung khoảng `72ch`; desktop có thể chia đoạn hoặc thêm pull-quote để giảm khối chữ.
- Mobile bỏ `text-align: justify`; dùng `line-height: 1.7` và khoảng cách đoạn 16–20 px.
- Quick nav chỉ sticky trên desktop/tablet ngang; mobile dùng select “Đi đến mục” hoặc horizontal chips có gradient báo còn nội dung.
- Các khối “Lĩnh vực & Quyền lợi”, “Quy mô & Đối tượng”, “Lộ trình” dùng cùng card anatomy và thang chữ.
- Timeline icon tiếp tục giữ kích thước cố định, nhưng đường nối phải bám tâm icon ở mọi breakpoint.
- Thêm CTA hợp ngữ cảnh sau tổng quan và cuối trang, không lặp quá nhiều CTA cùng trọng số.

**Xử lý:** P2-05, P2-06.

## 3.9. Trang thể lệ/hướng dẫn

- Tabs phải dùng `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` và hỗ trợ phím mũi tên.
- FAQ button cần `aria-expanded`, `aria-controls`; nội dung collapse vẫn giữ focus đúng.
- Đồng nhất icon bằng Lucide hoặc bộ SVG hiện tại; bỏ emoji tên lửa nếu không thuộc nhận diện.
- CTA cuối trang dùng nền brand nhạt hoặc dark surface; nút chính phải tương phản rõ với nền.
- Ảnh minh họa bước thao tác cần caption, alt text và zoom có dialog chuẩn.
- Nếu một tính năng chưa hoạt động, ghi “Sắp ra mắt” thay vì tạo nút giả.

**Xử lý:** P0-04, P2-03.

## 3.10. Trang lộ trình/thời gian

- Desktop có thể giữ timeline ngang/tổng quan + danh sách chi tiết.
- Mobile chuyển tracker thành timeline dọc hoặc thêm nhãn “Vuốt để xem các mốc” và scroll snap.
- Mốc hiện tại cần `aria-current="step"`; trạng thái hoàn tất/đang diễn ra/sắp tới không chỉ phân biệt bằng màu.
- Date parsing dùng timezone `Asia/Ho_Chi_Minh`; tránh phụ thuộc parser chuỗi ngày theo trình duyệt.
- Countdown dừng đúng lúc, không hiển thị giá trị âm; có nội dung thay thế khi mốc đã qua.
- Giảm animation xuất hiện còn 180–320 ms.

**Xử lý:** P2-07, P1-09.

## 3.11. Form đăng nhập và đăng ký

Mỗi trường cần label thật, kiểu bàn phím đúng và hỗ trợ password manager:

```tsx
<label htmlFor="signup-email">Email</label>
<input
  id="signup-email"
  name="email"
  type="email"
  autoComplete="email"
  inputMode="email"
  aria-describedby={emailError ? "signup-email-error" : undefined}
  aria-invalid={Boolean(emailError)}
/>
```

- Điện thoại: `type="tel"`, `autoComplete="tel"`, `inputMode="tel"`.
- Mật khẩu: `autoComplete="current-password"`; đăng ký dùng `new-password`.
- Nút hiện mật khẩu có `aria-label` thay đổi theo trạng thái và focus ring rõ.
- Validation hiển thị ngay dưới trường; toast chỉ dùng cho lỗi toàn form/server.
- Khi submit: disable nút, giữ chiều rộng, có spinner và thông báo “Đang đăng nhập…”.
- Triển khai trang quên mật khẩu thật hoặc ẩn link khỏi production.
- Không ẩn toàn bộ form bằng `opacity: 0` cho đến khi mounted.
- Modal đăng ký chuyển thành route riêng trên mobile hoặc dialog chuẩn trên desktop.

**Xử lý:** P0-04, P0-05, P1-14, P1-15.

## 3.12. Modal bình chọn, đăng ký và gallery

Tạo một `Dialog` dùng chung dựa trên Radix UI/Headless UI hoặc tự triển khai đầy đủ:

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="vote-dialog-title"
  className="dialog"
>
  <h2 id="vote-dialog-title">Bình chọn cho dự án</h2>
  {/* Nội dung */}
</div>
```

Yêu cầu hành vi:

- Focus vào heading/field đầu khi mở; Tab không thoát khỏi dialog.
- Escape đóng ở bước an toàn; khi đã tạo giao dịch phải xác nhận trước khi đóng.
- Đóng xong trả focus về nút đã mở modal.
- Khóa scroll body; xử lý `padding-bottom: env(safe-area-inset-bottom)`.
- Backdrop click chỉ đóng khi chưa submit/giao dịch.
- Checkbox điều khoản mặc định **false**; link điều khoản mở nội dung dễ đọc.
- Thêm stepper: `1. Chọn gói → 2. Thanh toán → 3. Hoàn tất`.
- Nội dung tối thiểu 14 px; thông tin chính 16 px.
- QR có trạng thái loading, hết hạn, thử lại; polling có timeout và dừng khi dialog đóng.
- Thành công có mã giao dịch, số lượt bình chọn, thời gian và hành động quay lại dự án.

**Xử lý:** P0-02, P0-03, P1-16, P1-22.

## 3.13. Nút bấm và trạng thái tương tác

Chỉ duy trì các variant: `primary`, `secondary`, `ghost`, `danger`, `icon`.

- Cao tối thiểu 44 px, icon button 44 × 44 px.
- Transition 160–220 ms; không dùng animation quá dài cho control.
- Có đủ `default`, `hover`, `active`, `focus-visible`, `disabled`, `loading`.
- `disabled` không chỉ giảm opacity; phải có cursor và không nhận click.
- Focus ring không được xóa nếu chưa có thay thế.
- CTA chính mỗi section chỉ có một; nút phụ giảm màu và shadow.

**Xử lý:** P1-05, P1-09, P2-01.

## 3.14. Trang chi tiết dự án

- Đưa toàn bộ màu về design token xanh dương/xanh ngọc; bỏ emerald/beige/cam riêng.
- Thêm breadcrumb: `Dự án / [Lĩnh vực] / [Tên dự án]`.
- Desktop làm cột hành động bình chọn sticky trong phạm vi nội dung; mobile đặt CTA sticky bottom có safe-area nhưng không che nội dung.
- Thông tin liên hệ cá nhân chỉ hiển thị khi thực sự cần và có sự đồng ý; ưu tiên email đội thi hoặc kênh liên hệ trung gian.
- Gallery dùng thumbnail có kích thước cố định; modal ảnh dùng dialog chuẩn.
- Sau copy link, hiển thị toast rõ; có fallback khi Clipboard API thất bại.
- Sửa `animate-all` thành class transition hợp lệ.
- Dữ liệu chi tiết nên server-render hoặc dùng server component để có heading/nội dung trong HTML đầu.

**Xử lý:** P0-05, P1-17, P2-08, P2-12.

## 3.15. Footer và action nổi

- Địa chỉ phải wrap; bỏ `white-space: nowrap` trên mobile.
- Giữ footer tối đa ba nhóm thông tin chính; giảm mật độ link ít dùng.
- Link ngoài mở tab mới cần `target="_blank"`, `rel="noreferrer"` và icon external-link.
- Mobile chỉ giữ một nút “Liên hệ” nổi; nhấn mở sheet chứa Zalo/điện thoại/email. Không để ba nút che nội dung.
- Chừa padding đáy cho CTA/action nổi và safe-area.
- Tooltip hover desktop phải có tên truy cập qua `aria-label`; mobile dùng label trong sheet.
- Sponsor tách thành danh sách logo có alt text, kích thước đồng đều và wrap responsive.

**Xử lý:** P1-18, P2-02, P2-10, P2-13.

## 3.16. Kiến trúc render và dữ liệu

- Chuyển root layout về Server Component; tách `ClientShell` chỉ cho theme, auth UI và interaction.
- Fetch nội dung trang, danh sách dự án và metadata ở server; hydrate phần filter/vote cần tương tác.
- Dùng `generateMetadata` cho từng route thay vì head thủ công trong client layout.
- Thay polling cấu hình bằng cache/revalidation; auth state cập nhật theo event.
- Dùng SSE/WebSocket hoặc endpoint vote delta nếu cần realtime; nếu không, nút “Làm mới” + timestamp đủ minh bạch.
- Xóa utility chống DevTools khỏi production; không tạo bảo mật thực nhưng làm khó debug và có thể ảnh hưởng accessibility.
- Chuẩn hóa error boundary, not-found và offline state.

**Xử lý:** P0-05, P1-13, P1-19, P1-20, P2-11.

## 3.17. Responsive theo thiết bị

### Desktop — 1280–1536 px

- Container nội dung tối đa 1200–1280 px; đoạn văn tối đa 75ch.
- Hero không cao quá 720 px; CTA nằm trong vùng nhìn đầu tiên.
- Khoảng cách section 80–112 px; không dùng khoảng trống chỉ để tạo cảm giác “premium”.
- Card grid 3 cột, chỉ 4 cột khi card vẫn rộng tối thiểu 280 px.

### Tablet — 768–1024 px

- Grid chuyển 2 cột; không dùng width cố định 818/1110 px.
- Menu drawer có thể dùng panel rộng 360–420 px thay vì chiếm toàn màn hình.
- Section spacing 64–80 px; modal rộng tối đa 90vw.
- Kiểm tra landscape và portrait riêng, đặc biệt vùng 768–812 px.

### Mobile — 360–430 px

- Padding ngang 16–20 px; không để nội dung chạm mép.
- Mọi vùng chạm ít nhất 44 × 44 px, khoảng cách giữa hai target ít nhất 8 px.
- Card một cột; body 16 px; tiêu đề không giảm dưới 26–32 px tùy cấp.
- Bỏ text justify, fixed background và animation nặng.
- CTA quan trọng full-width hoặc hai nút xếp dọc.
- Modal dùng `100dvh`/bottom sheet và safe-area, không dùng `95vh` cứng.
- Không có horizontal scroll ngoài những khu vực được thiết kế rõ là carousel.

**Xử lý:** P0-06, P1-05, P1-11, P1-18, P1-22, P2-05, P2-06, P2-07.

## 3.18. Bộ viewport và tiêu chí nghiệm thu bắt buộc

Kiểm thử tối thiểu tại:

| Nhóm | Viewport |
|---|---|
| Mobile nhỏ | 360 × 800 |
| Mobile chuẩn | 390 × 844 |
| Mobile lớn | 430 × 932 |
| Tablet dọc | 768 × 1024 |
| Tablet ngang | 1024 × 768 |
| Laptop | 1366 × 768 |
| Desktop | 1440 × 900 |
| Desktop lớn | 1920 × 1080 |

Tiêu chí pass:

- Không có horizontal overflow ngoài carousel chủ ý.
- Không có text bị cắt, nút bị che hoặc control dưới 44 px trên touch viewport.
- Tab order đi theo logic thị giác; focus luôn nhìn thấy.
- Mọi modal đóng/mở được bằng bàn phím và screen reader hiểu đúng tên.
- Zoom trình duyệt 200% vẫn dùng được.
- Light/dark mode có contrast đạt WCAG AA cho body text và control.
- `prefers-reduced-motion` loại bỏ count-up/slide/parallax không thiết yếu.
- API chậm/lỗi/rỗng đều có trạng thái rõ, không nhảy layout.
- Lighthouse mục tiêu: Performance ≥ 85 mobile, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.

## 3.19. Lộ trình triển khai đề xuất

### Giai đoạn 0 — 1 đến 2 ngày: xử lý rủi ro P0

1. Nén video/logo/favicon và thay ảnh card bằng thumbnail.
2. Đổi checkbox điều khoản về false.
3. Chuẩn hóa dialog đăng ký/bình chọn/gallery.
4. Ẩn hoặc hoàn thiện đổi ngôn ngữ và quên mật khẩu.
5. Xóa width container cứng gây overflow.

### Giai đoạn 1 — 3 đến 5 ngày: thống nhất trải nghiệm

1. Tạo token màu, chữ, spacing, radius, shadow.
2. Chuẩn hóa Button, Input, Card, Dialog, EmptyState, Skeleton.
3. Làm lại Header/Drawer/Footer theo accessibility.
4. Đồng nhất trang chi tiết dự án với nhận diện toàn site.
5. Sửa typography nhỏ, animation dài và sticky panel mobile.

### Giai đoạn 2 — 5 đến 10 ngày: nâng cấp kiến trúc và conversion

1. Chuyển layout/nội dung chính sang server-rendering.
2. Làm Hero HTML có H1/CTA thật và responsive art direction.
3. Hoàn thiện search/filter URL, phân trang và cập nhật vote hiệu quả.
4. Hoàn thiện form validation, quên mật khẩu và trạng thái giao dịch.
5. Visual regression + accessibility + Lighthouse trên toàn bộ viewport.

### Giai đoạn 3 — tinh chỉnh 9–10/10

1. Thay dữ liệu/ảnh mẫu bằng nội dung production chất lượng cao.
2. Tinh chỉnh motion 180–320 ms và micro-interaction có mục đích.
3. Thực hiện usability test 5–8 người cho ba tác vụ: tìm dự án, đăng nhập, bình chọn.
4. Đo funnel: Hero CTA → danh sách → chi tiết → mở modal → thanh toán thành công.

---

# 4. Kết luận và điểm hoàn thiện hiện tại

## 4.1. Bảng điểm

| Hạng mục | Điểm /100 | Nhận định |
|---|---:|---|
| Thẩm mỹ và ấn tượng ban đầu | 76 | Có bản sắc, nhiều khu vực đẹp; còn dùng hiệu ứng hơi dày |
| Cấu trúc thông tin | 72 | Nội dung đầy đủ; CTA và ưu tiên thông tin chưa luôn rõ |
| Typography và khả năng đọc | 65 | Inter phù hợp; nhiều chữ nhỏ và scale tùy ý |
| Tính nhất quán/design system | 54 | Màu, card và style theo trang còn phân mảnh |
| Responsive | 66 | Có breakpoint và layout mobile; còn width cứng, sticky và safe-area |
| Accessibility | 49 | Modal, drawer, label, focus và semantic cần xử lý đáng kể |
| Hiệu năng | 41 | Asset rất nặng, client rendering và polling nhiều |
| Tương tác và feedback | 65 | Có loading/toast/animation; một số luồng chưa hoàn chỉnh |
| Độ tin cậy và conversion | 68 | Cấu trúc cuộc thi rõ; dữ liệu 0, ảnh mẫu và nút giả làm giảm niềm tin |
| Khả năng bảo trì frontend | 44 | CSS lớn, nhiều `!important`, inline style và logic polling |

## 4.2. Điểm tổng

# **63/100 — Khá về mặt trình bày, chưa đạt mức sản phẩm thương mại cao cấp**

Website hiện phù hợp để demo và vận hành thử, nhưng chưa đạt 9–10/10 vì các vấn đề cốt lõi không nằm ở việc thêm nhiều hiệu ứng hơn. Khoảng cách lớn nhất tới Apple/Linear/Notion/Stripe là **sự tiết chế, tốc độ, tính nhất quán, accessibility và độ trung thực của mọi tương tác**.

Nếu hoàn tất toàn bộ P0 và các mục P1 liên quan design system, typography, Header/Hero, form/modal và responsive, mức hợp lý có thể đạt **80–85/100**. Sau khi tối ưu kiến trúc render, asset, dữ liệu production và kiểm thử accessibility/visual regression, website có thể tiến tới **90+/100**.

## 4.3. Nguyên tắc quyết định khi triển khai

Khi phải lựa chọn giữa “trang trí thêm” và “rõ hơn/nhanh hơn/dễ dùng hơn”, ưu tiên phương án thứ hai. Chất lượng cao cấp đến từ hệ thống nhất quán và chi tiết đúng: một CTA rõ, chữ dễ đọc, chuyển động vừa đủ, dữ liệu đáng tin, phản hồi tức thời và không có trạng thái giả.
