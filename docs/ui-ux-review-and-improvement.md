# Đánh Giá UI/UX & Hướng Chỉnh Sửa Chi Tiết
## Dự án: HUIT Startup Contest Voting Platform

> **Ngày tạo:** 2026-06-20  
> **Phiên bản:** 1.0  
> **Tác giả:** Antigravity AI (Review & Analysis)

---

## Tổng Quan Kiến Trúc Giao Diện Hiện Tại

### Stack Công Nghệ
- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + CSS-in-JS (inline styles) + globals.css
- **Font:** Inter (Google Fonts)
- **Theme:** Hỗ trợ Light/Dark mode qua `data-theme` attribute
- **Animation:** CSS keyframes + IntersectionObserver

### Palette Màu Chính
| Token | Light | Dark |
|-------|-------|------|
| `--site-bg` | `#f5f7fb` | `#0b1220` |
| `--site-card` | `#ffffff` | `#152135` |
| `--site-text` | `#17243a` | `#e8eef7` |
| `--site-primary` | `#2563d9` | `#6aa8ff` |
| `--site-accent` | `#0d9488` | `#52cfc2` |
| Accent teal | `#79BCC2` | `#79BCC2` |
| Brand blue | `#0A2FFF` | `#0A2FFF` |

---

## PHẦN 1: ĐÁNH GIÁ TỔNG THỂ

### ✅ Điểm Mạnh Hiện Có

1. **Hệ thống theme Dark/Light** hoạt động tốt với CSS variables
2. **Scroll animation** dùng IntersectionObserver mượt mà
3. **Responsive design** có media queries cho nhiều breakpoint
4. **Floating action buttons** (Zalo, Phone, Email, Scroll-top) tiện dụng
5. **Glassmorphism cards** trên trang Giới thiệu và Thời gian trông hiện đại
6. **Gradient buttons** với hover effects đẹp
7. **Font Inter** được load đúng cách

### ⚠️ Điểm Yếu Cần Cải Thiện

1. **Thiếu nhất quán giữa các trang:** Trang Giới thiệu dùng dark glassmorphism, Trang chủ dùng light cards — cần unify visual language
2. **Header quá đơn giản:** Chỉ là logo + nav links trên nền trắng, thiếu depth và personality
3. **Không có loading skeleton:** Khi fetch data, chỉ hiện text "Đang tải..."
4. **Typography hierarchy yếu:** Font size nhảy không nhất quán (10px → 42px không có tầng trung gian)
5. **Thiếu micro-interactions:** Nút bấm cần ripple effect, focus states rõ ràng hơn
6. **Footer thiếu sức sống:** Dạng 4-column grid basic, thiếu visual accents
7. **Không có Hero Section proper:** Trang Giới thiệu, Thời gian, Hướng dẫn thiếu hero banner ấn tượng
8. **Mobile experience mediocre:** Card layout trên mobile quá dày, padding chưa tối ưu
9. **Empty states chưa thiết kế:** "Không tìm thấy dự án" chỉ là text đơn giản
10. **Scroll indicator thiếu:** Người dùng không biết còn nội dung bên dưới

---

## PHẦN 2: TỪNG TRANG – ĐÁNH GIÁ & HƯỚNG CẢI THIỆN

---

## 🏠 TRANG CHỦ (`/` — `page.tsx`)

### Đánh Giá Hiện Tại

**Score: 6.5/10**

#### Cấu trúc hiện tại:
1. Banner slider (ảnh/video)
2. Section "Giới thiệu cuộc thi" (text + stats)
3. Danh sách dự án (cards grid)
4. Section video
5. Section nhà tài trợ

#### Vấn đề:
- **Banner slider không có overlay text:** Slide chỉ hiển thị ảnh, không có CTA hay headline ấn tượng
- **Stats counters hiển thị "0" khi load:** Thiếu skeleton loader, UX tệ khi đang chờ API
- **About section layout đơn điệu:** Chỉ có text, không có visual break-up
- **Cards grid dự án quá đơn giản** so với giá trị cuộc thi 5 tỷ đồng
- **Không có section "Why participate"** hay social proof nổi bật
- **Search bar không đủ prominent:** Ẩn dưới nhiều nội dung

---

### 🎨 Hướng Chỉnh Sửa Trang Chủ

#### 1. Hero Banner (Ưu tiên cao)
```
HIỆN TẠI:
- Chỉ hiển thị ảnh banner full-width
- Không có text overlay
- Không có CTA rõ ràng

ĐỀ XUẤT:
- Thêm gradient overlay từ đen 70% (trái) → trong suốt (phải)
- Thêm Hero copy bên trái:
  ├── Badge pill: "HUIT STARTUP LẦN VII 2026"
  ├── H1 lớn (clamp 48px→80px): "Đổi Mới Sáng Tạo / Hướng Tới Bền Vững"
  ├── Subtitle (16px): Mô tả ngắn 1-2 dòng
  └── CTA buttons: [Đăng Ký Ngay] [Xem Dự Án]
- Thêm slide indicators (dots) ở bottom-center
- Thêm arrow navigation (prev/next) visible on hover
- Thêm scroll-down indicator (chevron bouncing) ở bottom-center
```

#### 2. Stats Section (Ưu tiên cao)
```
HIỆN TẠI:
- 3 ô nhỏ (Thí sinh / Bình chọn / Lượt xem) hiển thị "0" lúc load
- Không có icon
- Thiếu context

ĐỀ XUẤT:
- Redesign thành horizontal stats bar hoặc 4 columns:
  ├── Icon + Số lớn (animated counter khi vào viewport) + Label
  ├── Ví dụ: 🏆 153+ Dự án | ⭐ 300K+ Bình chọn | 🎓 650 Sinh viên | 📱 3.7M Tiếp cận
  └── Skeleton loader: 4 rect placeholders khi đang tải
- Màu: Gradient text từ #0A2FFF → #79BCC2
- Background: glass card với border subtle
```

#### 3. About Section (Ưu tiên trung bình)
```
HIỆN TẠI:
- Text block dài, không có visual break
- Buttons "Xem thêm" và "Đăng ký" placement không tối ưu

ĐỀ XUẤT:
- Thêm badge label "🌿 Về Cuộc Thi" phía trên H2
- Giới hạn text 3-4 dòng + nút "Đọc thêm" expand
- Bên phải: Thêm poster ảnh (currently hidden class="hidden")
  └── Bỏ class "hidden" và enable image column
- Highlight quote block: trích dẫn 1 câu nổi bật với left-border teal
- Thêm "Prize highlight": Box nổi bật "Tổng giải thưởng 05 TỶ ĐỒNG"
  với gradient vàng-đỏ
```

#### 4. Danh Sách Dự Án (Ưu tiên cao)
```
HIỆN TẠI:
- Cards trắng, chưa đủ visual weight
- Vote count placement không tối ưu
- Không có rank indicator rõ ràng ở top 3

ĐỀ XUẤT:
- Top 3 cards: Thêm crown icon 👑 và glow effect (gold/silver/bronze)
- Thêm progress bar vote (so với top 1) dưới vote count
- Hover state: Lift card lên 8px, shadow sâu hơn, image zoom nhẹ
- Vote button: Thêm ripple click animation
- Lazy loading image với blur placeholder
- Grid: Hiển thị 6 cards (2 hàng x 3 cols) thay vì 3 cards
- "Xem thêm" button → replace bằng infinite scroll hoặc pagination rõ ràng
```

#### 5. Search Experience (Ưu tiên trung bình)
```
HIỆN TẠI:
- Search bar nhỏ, không nổi bật
- Khi không tìm thấy: chỉ có text đơn giản

ĐỀ XUẤT:
- Search bar lớn hơn (height 56px trên desktop)
- Thêm placeholder text gợi ý: "Tìm dự án... vd: 'Nông nghiệp', '085'"
- Focus state: Border glow teal + shadow
- Khi gõ: Highlight match text trong card name
- Empty state: 
  ├── Icon (magnifying glass with sad face)
  ├── Title: "Không tìm thấy dự án"
  └── Suggestion: "Thử tìm bằng mã số hoặc từ khóa khác"
```

---

## 📖 TRANG GIỚI THIỆU (`/gioi-thieu`)

### Đánh Giá Hiện Tại

**Score: 7/10**

#### Cấu trúc:
1. Title block (H2 + H3 + divider)
2. Card Tổng quan
3. Card Đơn vị tổ chức & đồng hành
4. Grid 3 cột: Lĩnh vực / Quyền lợi / Giải thưởng
5. Timeline section
6. Grid 3 cột: Quy mô / Đối tượng / Liên hệ + QR
7. Back button

#### Vấn đề:
- **Không có Hero section:** Đi thẳng vào content dày đặc
- **Background inconsistency:** Trang dùng `bg-transparent` nhưng layout tối, trong khi body có `--site-bg` sáng
- **Title section khiêm tốn:** H2 nhỏ, không có visual impact
- **Card "Tổng quan" quá text-heavy:** Không có icon/visual nào
- **Timeline trang giới thiệu vs trang Thời gian:** Duplicate content, nên differentiate
- **QR code section:** Cần nổi bật hơn như một CTA primary
- **Không có image nào minh họa:** Toàn text và icon SVG
- **"Quay lại Trang chủ" button placement:** Nằm quá cuối, cần breadcrumb hoặc sticky nav

---

### 🎨 Hướng Chỉnh Sửa Trang Giới Thiệu

#### 1. Hero Section (Ưu tiên cao)
```
ĐỀ XUẤT:
- Hero banner height 420px với background ảnh/gradient cuộc thi
- Overlay: gradient từ #030612/80% → #0A2FFF/30%
- Content center-aligned:
  ├── Eyebrow text: "HUIT STARTUP LẦN THỨ VII"  
  ├── H1 (60px bold): "Giới Thiệu Cuộc Thi"
  ├── Subtitle: chủ đề cuộc thi
  └── 2 breadcrumb pills: [Trang chủ] → [Giới thiệu]
- Decorative particles/dots floating (CSS animation)
- Wave divider ở bottom để transition vào content
```

#### 2. Stats Row (Ưu tiên cao)
```
ĐỀ XUẤT:
- Thêm row 4 stats animated counters SAU hero:
  ├── [153+] Dự án đăng ký
  ├── [05 TỶ] Giải thưởng
  ├── [45+] Trường tham gia
  └── [3.7M] Lượt tiếp cận
- Background: gradient navy → teal subtle
- Số to (48px), label nhỏ (12px uppercase)
- Border divider giữa các stat
```

#### 3. Card Tổng Quan (Ưu tiên trung bình)
```
HIỆN TẠI:
- Text plain trong glass card
- Không có visual element

ĐỀ XUẤT:
- Thêm left sidebar với icon lớn (rocket/trophy SVG)
- Layout 2 columns: [Icon + Quote] | [Text content]
- Quote highlight: Câu trích dẫn chính sách với font larger, teal color
- Thêm "pill badges" cho: [Cấp Thành phố] [Lần thứ VII] [2026]
- Bottom: Link "Xem lịch trình đầy đủ →" dẫn tới /thoi-gian
```

#### 4. Cards Lĩnh Vực/Quyền Lợi/Giải Thưởng (Ưu tiên cao)
```
HIỆN TẠI:
- 3 cards equal size, good structure
- Icons nhỏ, màu sắc đã có

ĐỀ XUẤT (Lĩnh vực dự thi):
- Mỗi lĩnh vực: Thêm icon minh họa tương ứng
  ├── 💻 Công nghệ, AI
  ├── 🌱 Nông nghiệp, Môi trường
  ├── 📚 Giáo dục, Văn hóa
  ├── ❤️ Y tế, Sức khỏe
  └── 🌍 Phát triển bền vững
- Hover: Card expand nhẹ, hiện tooltip mô tả chi tiết
- Tag màu sắc phân biệt từng ngành

ĐỀ XUẤT (Giải thưởng):
- Thay số "05 TỶ ĐỒNG" thành:
  ├── Animated counter từ 0 → 5,000,000,000
  ├── Confetti animation khi enter viewport
  └── Prize tiers: [Giải Nhất] [Giải Nhì] [Giải Ba] dạng podium visual
```

#### 5. Timeline (Ưu tiên trung bình)
```
HIỆN TẠI:
- Vertical timeline với bullet points
- Icons SVG nhỏ, chưa có status indicator

ĐỀ XUẤT:
- Horizontal timeline trên desktop, vertical trên mobile
- Mỗi milestone: 
  ├── Date chip màu theo giai đoạn
  ├── Status dot: Đã qua (✓ xanh) | Hiện tại (● pulse) | Sắp tới (○ xám)
  ├── Progress bar kết nối các node
  └── Hover: Tooltip chi tiết
- Highlight milestone "Hiện tại" với glow animation
- "Xem chi tiết →" link tới /thoi-gian
```

#### 6. Contact & QR Section (Ưu tiên cao)
```
HIỆN TẠI:
- Contact info dạng text plain
- QR code nhỏ trong card
- Button "Đăng ký ngay" không nổi bật

ĐỀ XUẤT:
- Redesign toàn bộ thành "Registration CTA Card":
  ├── Background: Gradient xanh navy với particles
  ├── Left: QR code to (200x200px) với viền glow
  ├── Right: 
  │   ├── H3: "Đăng ký tham gia ngay hôm nay"
  │   ├── Countdown timer đến deadline
  │   ├── Contact pills (📞 Phone | 📧 Email)
  │   └── CTA button lớn: "Đăng Ký" (gradient, 56px height)
  └── Decorative: confetti dots xung quanh
```

---

## ⏱️ TRANG THỜI GIAN (`/thoi-gian`)

### Đánh Giá Hiện Tại

**Score: 7.5/10**

#### Cấu trúc:
1. Hero section (eyebrow + H1 + subtitle + buttons)
2. Key milestones row (4 date boxes)
3. Rounds sections (3 cards: Loại/Bán kết/Chung kết)
4. CTA section cuối

#### Vấn đề:
- **Background chỉ có blur orbs** (màu xanh/cam), cần texture/pattern thêm
- **Key milestones boxes** trông flat, chỉ có date và label
- **Step cards quá đơn điệu:** `min-h-[210px]` fixed, thiếu adaptivity
- **Không có progress indicator** cho thấy đang ở giai đoạn nào
- **Buttons CTA cuối trang** hơi nhỏ so với importance
- **"Step 01/02..."** label không rõ ràng là sequence
- **Thiếu visual hierarchy** giữa "Mốc quan trọng" và "Theo lộ trình"
- **Không có "current time" indicator** — người dùng không biết đang ở giai đoạn nào

---

### 🎨 Hướng Chỉnh Sửa Trang Thời Gian

#### 1. Hero Enhancement (Ưu tiên trung bình)
```
HIỆN TẠI:
- Eyebrow pill + H1 trắng + subtitle + 2 buttons
- Background: blur orbs chồng lên bg

ĐỀ XUẤT:
- Thêm mesh gradient background (CSS):
  ```css
  background: 
    radial-gradient(ellipse at 10% 20%, rgba(10,47,255,0.15), transparent 40%),
    radial-gradient(ellipse at 85% 60%, rgba(121,188,194,0.12), transparent 40%),
    radial-gradient(ellipse at 50% 90%, rgba(249,115,22,0.08), transparent 40%),
    var(--site-bg);
  ```
- H1: Thêm highlighted word với gradient text
  "Thời gian các <span class='gradient-text'>vòng thi</span>"
- Thêm animated ribbon/ticker: 
  "📅 Nhận hồ sơ đến 15/6 · 📝 Vòng loại 27-28/6 · 🏆 Chung kết 03/10"
```

#### 2. Key Milestones Row (Ưu tiên cao)
```
HIỆN TẠI:
- 4 boxes với date lớn (vàng) + label nhỏ
- flat design, không có hierarchy

ĐỀ XUẤT:
- Redesign thành "Timeline Tracker":
  ├── Horizontal track với progress bar
  ├── 4 nodes kết nối bằng đường progress
  ├── Node đã qua: ✓ filled green
  ├── Node hiện tại: ● animated pulse, larger
  ├── Node sắp tới: ○ outline, mờ hơn
  ├── Mỗi node: Date trên, Label dưới
  └── Mobile: Scroll horizontal với snap
- Thêm tooltip khi hover từng node
- "Bạn đang ở đây" marker trên timeline
```

#### 3. Round Cards (Ưu tiên cao)
```
HIỆN TẠI:
- 3 large cards với color accent top border
- Steps trong 2-3 column grid
- Step card có color orb decoration

ĐỀ XUẤT (Cải tiến card layout):
- Round card header:
  ├── Left: Phase number large (01/02/03) mờ, decorative
  ├── Center: Phase name + eyebrow
  ├── Right: Status badge [Đang diễn ra / Sắp tới / Hoàn thành]
  └── Progress indicator: X/N steps completed
  
- Step cards:
  ├── Compact layout (min-h giảm xuống còn 160px)
  ├── Left: Colored side border + step number
  ├── Top: Date pill màu theo round
  ├── Middle: Title step
  ├── Bottom: Status + isImportant badge
  └── Hover: Flip card nhẹ để xem thêm thông tin (nếu có)
  
- Important milestone: 
  ├── Tách riêng ra, bordered với gradient highlight
  ├── Thêm icon ⚠️ hoặc 🎯
  └── Font lớn hơn, color rõ hơn (vàng cam)
```

#### 4. CTA Section (Ưu tiên trung bình)
```
HIỆN TẠI:
- Section nhỏ ở cuối với title + text + button
- Button "Đăng ký ngay" gradient vàng-teal

ĐỀ XUẤT:
- Full-width banner với gradient background
- Countdown đếm ngược đến deadline đăng ký:
  ├── Format: [XX ngày] [XX giờ] [XX phút] [XX giây]
  └── Animated tick mỗi giây
- 2 columns:
  ├── Left: Text content + countdown
  └── Right: Illustration (icon rocket/calendar)
- Buttons to hơn (64px height) với arrow icon
```

---

## 🏆 TRANG BẢNG XẾP HẠNG (`/bang-xep-hang`)

### Đánh Giá Hiện Tại

**Score: 7/10**

#### Cấu trúc:
1. Title + search bar
2. Top 3 podium section
3. Full ranking grid (3 cột)

#### Vấn đề:
- **Không có proper podium visual:** Top 3 hiển thị giống hệt các card còn lại, chỉ khác badge
- **Search bar không sticky:** Khi scroll xuống, phải cuộn lên để tìm kiếm
- **Không có pagination hoặc infinite scroll:** Tất cả cards load cùng lúc
- **"Đang tải..." text đơn giản:** Cần skeleton loader đẹp hơn
- **Không có sort/filter options:** Chỉ tìm kiếm, không có lọc theo lĩnh vực
- **Vote count display không dramatic:** 106,100 votes cần được làm nổi bật hơn
- **Không có real-time update indicator:** Người dùng không biết data có refresh không
- **Hover state quá mạnh:** `translateY(-7px) scale(1.02)` khi hover có thể gây layout shift

---

### 🎨 Hướng Chỉnh Sửa Trang Bảng Xếp Hạng

#### 1. Page Header (Ưu tiên trung bình)
```
HIỆN TẠI:
- H2 + H3 + gradient divider
- Không có context về real-time updates

ĐỀ XUẤT:
- Thêm "Live" indicator:
  ├── Badge: "🔴 LIVE · Cập nhật mỗi 10 giây"
  └── Subtle pulse animation
- Thêm tab navigation nếu có nhiều bảng thi:
  [Học sinh] [Sinh viên] [Doanh nghiệp]
- Search bar sticky khi scroll (position: sticky top-[80px])
```

#### 2. Top 3 Podium (Ưu tiên cao)
```
HIỆN TẠI:
- Top 3 render dùng renderProjectCard() giống hệt list thường
- Chỉ khác badge "Top 1/2/3" ở góc ảnh

ĐỀ XUẤT - Proper Podium:
- Redesign thành Olympic Podium visual:
  ├── Rank 2 (bạc): Bên trái, height 85% podium
  ├── Rank 1 (vàng): Center, cao nhất, special crown icon
  ├── Rank 3 (đồng): Bên phải, height 70% podium
  
- Mỗi podium card:
  ├── Circular avatar/thumbnail (120px diameter)
  ├── Crown/Medal icon overlay
  ├── Project name + SBD
  ├── Vote count with trophy icon
  ├── Animated vote count (number rolls up)
  └── Glow effect tương ứng màu vàng/bạc/đồng
  
- Background của podium section:
  Gradient metallic từ vàng → bạc → đồng
  
- Rank 1 card: Thêm confetti particles rơi xuống (CSS)
- Rank 1: floating crown animation (bob up/down)
```

#### 3. Full Ranking List (Ưu tiên cao)
```
HIỆN TẠI:
- Grid 3 cột cards đồng đều
- Không có rank number hiển thị rõ ràng
- Không có progress bar vote

ĐỀ XUẤT:
Option A - Table View (cho 4-10+ entries):
  ├── Rank # | Avatar | Tên dự án | MDB | Votes | % so với #1 | Action
  ├── Row hover: Background highlight teal/10%
  ├── Rank column: Animated entrance từ phải
  └── Toggle giữa Grid View và Table View

Option B - Enhanced Cards (giữ nguyên grid):
  ├── Thêm rank number lớn (mờ) làm background decoration
  ├── Progress bar: Vote count / Max votes = % bar width
  ├── Thêm "↑2 / ↓1 / ─" trend indicator
  └── Hover: Show delta votes "Cần thêm X votes để vượt hạng trên"

- Pagination: 12 cards/trang với page numbers
- Lazy loading images với blur-up technique
```

#### 4. Vote Button UX (Ưu tiên cao)
```
HIỆN TẠI:
- Button gradient khi open, grey khi closed
- Không có feedback khi click

ĐỀ XUẤT:
- Click animation: Ripple effect lan ra từ click point
- Loading state: Spinner icon trong button
- Success state: Checkmark + "Đã bình chọn!" text
- Error state: Shake animation + error message
- Disabled state: Tooltip giải thích tại sao bị disabled
- "Voting in progress" debounce: Ngăn double-click
```

#### 5. Real-time UX (Ưu tiên trung bình)
```
ĐỀ XUẤT:
- Toast notification khi có thay đổi ranking:
  "🔥 Dự án #085 vừa nhận thêm 1,200 bình chọn!"
- Subtle flash animation trên card khi votes update
- "Rank changed" indicator: ↑ lên hạng (xanh) / ↓ xuống hạng (đỏ)
- Timestamp: "Cập nhật lúc HH:MM:SS"
```

---

## 📋 TRANG DANH SÁCH (`/` — phần candidates section)

> Lưu ý: "Danh sách" thực chất là phần dưới trang chủ. Có thể cân nhắc tách thành trang `/danh-sach` riêng.

### Đánh Giá Hiện Tại

**Score: 6/10**

#### Vấn đề:
- **Không phải trang riêng biệt:** Danh sách dự án nằm trong trang chủ, dễ bị bỏ qua
- **Cards thiếu một số thông tin:** Category/lĩnh vực, ngày đăng ký
- **"Xem thêm" button logic phức tạp:** Thay đổi giữa expand list và link tới /bang-xep-hang
- **Không có filter theo lĩnh vực/bảng thi**
- **Grid không responsive tốt trên tablet:** Chuyển thẳng từ 3 cột (desktop) → 1 cột (mobile)

---

### 🎨 Hướng Chỉnh Sửa Trang Danh Sách

#### 1. Filter Bar (Ưu tiên cao)
```
ĐỀ XUẤT:
- Sticky filter bar dưới search:
  ├── Tabs/Pills: [Tất cả] [Học sinh] [Sinh viên] [Doanh nghiệp]
  ├── Sort: [Nhiều bình chọn nhất ▼] [Mới nhất] [Tên A-Z]
  └── Count: "Hiển thị 12/53 dự án"
- Khi filter active: Highlight tab, badge số lượng
- Animate filter transition (fade + slide)
```

#### 2. Card Layout (Ưu tiên trung bình)
```
HIỆN TẠI:
- Card trắng với border, image top
- Metadata: SBD + Rank badge + Name + Votes + Description + Vote button

ĐỀ XUẤT:
- Grid responsive: 3 cols desktop → 2 cols tablet → 1 col mobile
- Thêm category chip: "💻 Công nghệ" trên ảnh
- Image: 16:9 aspect ratio với hover zoom-in effect
- Hover state: Card lift 6px, border color transition to teal
- Vote count: Thêm bar progress so sánh với max
- Thêm "Xem chi tiết →" link button phụ
```

---

## 📚 TRANG HƯỚNG DẪN (`/the-le`)

### Đánh Giá Hiện Tại

**Score: 6.5/10**

#### Cấu trúc:
1. Hero text (eyebrow + H2 + H3 + divider)
2. Sections với steps (bình chọn miễn phí + Sepay)
3. Bảng quy đổi điểm

#### Vấn đề:
- **Không có hero visual:** Chỉ có text, không có banner hay illustration
- **Background overlay đen cứng:** `bg-black/55` overlay toàn trang trông tối và nặng nề
- **Steps layout quá đơn điệu:** 2-column grid cards, không có numbering visual rõ ràng
- **Ảnh step nhỏ và không đủ context:** Aspect ratio 431:244 cho screenshot app
- **Bảng quy đổi table:** Minimal styling, không có highlight special offers
- **Không có FAQ section** mặc dù footer có link đến "#faq"
- **Không có video tutorial** — đây là page hướng dẫn, video sẽ hiệu quả hơn
- **Mobile: Cards stack, ảnh quá nhỏ**
- **Section icons không intuitive:** Tim icon cho "bình chọn miễn phí" và QR icon cho "Sepay"

---

### 🎨 Hướng Chỉnh Sửa Trang Hướng Dẫn

#### 1. Hero Section (Ưu tiên cao)
```
HIỆN TẠI:
- Text center: eyebrow + H2 + H3 + divider
- Không có visual

ĐỀ XUẤT:
- Hero với split layout:
  ├── Left (60%): 
  │   ├── Badge: "📖 Cẩm nang bình chọn"
  │   ├── H1 (52px): "Hướng dẫn & Thể lệ"
  │   ├── Body text: Mô tả ngắn về 2 cách bình chọn
  │   └── Quick links: [Bình chọn miễn phí ↓] [Thanh toán Sepay ↓] [Bảng điểm ↓]
  └── Right (40%): Illustration/mockup app bình chọn
  
- Thay đổi bg: Thay `bg-black/55` overlay bằng 
  gradient: top navy → bottom teal nhẹ
```

#### 2. Steps Navigation (Ưu tiên cao)
```
HIỆN TẠI:
- 2 sections liệt kê dưới nhau, phân cách bằng border

ĐỀ XUẤT:
- Tab navigation giữa 2 sections:
  ├── [❤️ Miễn phí] [💳 Thanh toán Sepay]
  └── Tab active: underline teal + background highlight
  
- Hoặc: Accordion expandable cho mỗi section
- Step indicator nổi bật hơn:
  ├── Large step number (40px) bên trái
  ├── Connector line dọc giữa các steps
  └── Completed steps có checkmark
```

#### 3. Step Cards (Ưu tiên cao)
```
HIỆN TẠI:
- Card glass với số bước nhỏ ở trên + text + ảnh
- Grid 2 cột

ĐỀ XUẤT:
- Redesign thành step-by-step flow:
  ├── Mỗi step: horizontal layout trên desktop
  │   ├── Left: Step number (large, 64px), circled
  │   ├── Center: Title + Description text
  │   └── Right: Screenshot (300px wide) với device frame
  └── Mobile: Vertical, image full-width

- Device frame wrapper cho screenshots:
  ├── Rounded corners như phone/browser
  ├── Subtle shadow
  └── Optional: Browser chrome (URL bar mockup)
  
- Arrow connector giữa các steps (→)
- Animation: Steps appear từng cái một khi scroll
```

#### 4. Bảng Quy Đổi Điểm (Ưu tiên cao)
```
HIỆN TẠI:
- Table 2 cột: Gói bình chọn | Giá trị
- Hover row highlight màu teal nhẹ
- "Miễn phí" không được highlight đặc biệt

ĐỀ XUẤT:
- Highlight "Gói miễn phí" row:
  ├── Background: gradient xanh lá nhạt
  ├── Badge "🆓 MIỄN PHÍ" màu xanh lá
  └── Border-left: 3px solid green
  
- Highlight "Best value" gói:
  ├── Background: gradient teal nhẹ
  ├── Badge "⭐ PHỔ BIẾN NHẤT" màu vàng
  └── Glow effect nhẹ
  
- Thêm cột "Điểm/1000 VND" để so sánh value
- Thêm CTA button mỗi row: "Chọn gói →"
  (link/trigger modal thanh toán)
  
- Mobile: Card layout thay table
  ├── Mỗi gói = 1 card
  └── Highlight cards nổi bật hơn với border/shadow
```

#### 5. FAQ Section (Ưu tiên trung bình)
```
HIỆN TẠI:
- Không có (mặc dù footer trỏ tới #faq)

ĐỀ XUẤT:
- Thêm FAQ accordion ở cuối trang:
  ├── ID: "faq" (để footer link hoạt động)
  ├── Questions:
  │   ├── "Bình chọn miễn phí có giới hạn không?"
  │   ├── "Giao dịch Sepay mất bao lâu để xác nhận?"
  │   ├── "Một số điện thoại được bình chọn bao nhiêu lần?"
  │   ├── "Tôi có thể bình chọn cho nhiều dự án không?"
  │   └── "Điểm bình chọn có hết hạn không?"
  └── Accordion expand/collapse với animation
```

---

## PHẦN 3: HEADER & NAVIGATION

### Đánh Giá Hiện Tại

**Score: 5.5/10**

#### Vấn đề:
- **Header quá đơn giản:** Nền trắng + logo + nav links, thiếu depth
- **Logo quá nhỏ:** `w-[105px]` trên mobile
- **Active indicator:** Chỉ có underline 3px và text color change
- **Theme toggle:** Icon ☾/☀ không intuitive, nên dùng icon rõ ràng hơn
- **Mobile menu:** Dropdown đơn giản, không có animation
- **Không có progress bar** khi navigate giữa trang
- **Scroll-hide behavior không nhất quán:** Header ẩn khi scroll down nhưng không có animation

---

### 🎨 Hướng Chỉnh Sửa Header

#### 1. Header Visual (Ưu tiên cao)
```
HIỆN TẠI:
- bg-white, border-b, shadow-sm
- Fixed height 80px

ĐỀ XUẤT:
- Glassmorphism header:
  ├── `backdrop-blur-xl`
  ├── `bg-white/80` (light) / `bg-[#0b1220]/85` (dark)  
  ├── border-b với màu subtle hơn
  └── shadow: `0 1px 20px rgba(0,0,0,0.08)`
  
- Thêm gradient top accent line (1px):
  `background: linear-gradient(90deg, #0A2FFF, #79BCC2)`
  
- Height: 80px → 72px (gọn hơn)
- Logo container: Tăng lên `w-[160px]`
```

#### 2. Navigation Links (Ưu tiên trung bình)
```
HIỆN TẠI:
- Text links plain, active có underline + blue color

ĐỀ XUẤT:
- Active state: Background pill `px-3 py-1 rounded-full bg-primary/10`
- Hover state: `bg-slate-100` (light) / `bg-white/8` (dark)
- Current page underline: Thay 3px bar bằng dot indicator
- Transition thêm: `transform scale(1.02)` on hover
```

#### 3. Mobile Menu (Ưu tiên cao)
```
HIỆN TẠI:
- Dropdown absolute, `bg-white/95 backdrop-blur`
- Links plain, không có icon

ĐỀ XUẤT:
- Slide-in từ trái (drawer) thay vì dropdown:
  ├── Overlay: bg-black/50 backdrop
  ├── Drawer: 280px width, full height
  ├── Mỗi nav item có icon bên trái
  ├── Close button (×) góc trên phải
  └── Animation: slide từ trái vào với spring effect
  
- Hoặc giữ dropdown nhưng thêm:
  ├── Slide-down animation khi mở
  ├── Icons cho từng item
  └── User greeting nếu đã đăng nhập
```

#### 4. Theme Toggle (Ưu tiên thấp)
```
HIỆN TẠI:
- Button ☾/☀ text
- Width 40px, border

ĐỀ XUẤT:
- Toggle switch UI:
  ├── Track oval 52x28px
  ├── Thumb slide animation
  ├── Sun icon (☀) ở right end
  └── Moon icon (🌙) ở left end
- Or: Icon-only button với Sun SVG / Moon SVG (cleaner)
- Tooltip: "Chuyển sang chế độ tối/sáng"
```

---

## PHẦN 4: FOOTER

### Đánh Giá Hiện Tại

**Score: 5/10**

#### Vấn đề:
- **Social icons dùng text characters** (f, ♪, ◎) thay vì proper SVG icons
- **Không có newsletter signup**
- **Grid layout 4 cột** đột ngột collapse → 2 cột → 1 cột, không smooth
- **Copyright text quá nhỏ** (11px)
- **Không có back-to-top trong footer**
- **Thiếu certifications/trust badges**

---

### 🎨 Hướng Chỉnh Sửa Footer

```
ĐỀ XUẤT:
- Thêm top section (trước grid):
  ├── Full-width CTA: "Còn X ngày để đăng ký tham dự"
  └── Register button + Social follow buttons

- Logo section: Thêm tagline dưới logo
  "Đổi mới sáng tạo · Phát triển bền vững"
  
- Social icons: Thay text bằng SVG icons đúng brand
  ├── Facebook F icon
  ├── TikTok logo  
  └── Instagram icon
  
- Thêm "Đăng ký nhận thông báo" row:
  ├── Email input + Subscribe button
  └── Label: "Nhận thông báo về lịch thi và kết quả"
  
- Copyright row:
  ├── Thêm partner logos nhỏ
  └── Link Privacy Policy / Terms
  
- Tăng font-size copyright lên 12px
- Thêm Back-to-top button ở footer bottom-right
```

---

## PHẦN 5: ANIMATIONS & MICRO-INTERACTIONS

### Hiện Tại
- Scroll animations: `translateY(30px) → 0` + `opacity 0 → 1`
- Card hover: `translateY(-7px) scale(1.02)` 
- Button hover: `translateY(-2px)`
- Keyframes: `fadeSlideUp`, `fadeSlideDown`, `scaleIn`, `float`

### Hướng Cải Thiện

#### Thêm Micro-Interactions:
```
1. Button Ripple Effect:
   - Click: Circular ripple từ điểm click lan ra
   - CSS: pseudo-element + scale animation
   
2. Link Hover:
   - Underline animate từ 0 → 100% width (left to right)
   
3. Input Focus:
   - Border glow pulse khi focus
   - Label float lên (floating label pattern)
   
4. Card Enter:
   - Stagger delay tăng dần (0ms, 75ms, 150ms, ...)
   - Một số cards từ trái, một số từ phải
   
5. Number Counter:
   - Animate từ 0 đến target khi enter viewport
   - Easing: ease-out-expo
   
6. Toast Notifications:
   - Slide in từ bottom-right
   - Auto dismiss sau 4 giây với progress bar
   - Dismiss on click
   
7. Page Transitions:
   - Fade in khi navigate giữa pages
   - Loading bar ở top (NProgress style)
```

---

## PHẦN 6: ACCESSIBILITY & PERFORMANCE

### Vấn Đề Accessibility:
1. **Color contrast:** Một số text `white/72` trên nền gradient có thể không đủ contrast ratio 4.5:1
2. **Focus indicators:** Nhiều nơi dùng `focus:outline-none` mà không thay thế
3. **Alt text:** Một số ảnh thiếu alt text mô tả đầy đủ
4. **ARIA labels:** Floating action buttons có `aria-label` tốt, cần check các nút khác
5. **Keyboard navigation:** Mobile menu có thể không keyboard accessible
6. **Font size:** 10-11px quá nhỏ cho elderly users

### Đề Xuất Accessibility:
```
- Thêm focus-visible styles rõ ràng cho tất cả interactive elements
- Đảm bảo contrast ratio min 4.5:1 (text) / 3:1 (UI elements)
- Thêm skip-to-content link ở đầu page
- Đảm bảo all images có alt text mô tả
- Test với screen reader (NVDA/JAWS)
- Thêm `prefers-reduced-motion` check (đã có nhưng cần expand)
```

### Vấn Đề Performance:
1. **Images không lazy loaded uniformly:** Một số có `loading="lazy"`, một số không
2. **CSS-in-JS (inline styles):** Mỗi render tạo style mới
3. **Polling interval quá tích cực:** Settings fetch mỗi 5 giây, candidates mỗi 10 giây
4. **Không có image optimization:** Không dùng `next/image` component
5. **Font loading:** Google Fonts không có `font-display: swap`

### Đề Xuất Performance:
```
- Thay <img> bằng next/image với width/height rõ ràng
- Giảm polling frequency: settings 30s, candidates 15s
- Thêm font-display: swap cho Inter
- Code split: Dynamic import cho VoteModal (heavy component)
- Preload hero image
- Service Worker cho offline support (optional)
```

---

## PHẦN 7: DARK MODE REFINEMENTS

### Vấn Đề Hiện Tại:
1. **Giới thiệu page:** Designed for dark, nhưng light mode trông flat vì CSS override toàn bộ
2. **globals.css override logic phức tạp:** Nhiều `!important` override chains
3. **Màu accent:** `#79BCC2` có thể quá tối trên dark background trong một số context
4. **Icon SVG:** Một số SVG stroke dùng hardcode color thay vì `currentColor`

### Đề Xuất:
```
- Audit và simplify CSS override chain
- Dùng CSS custom properties nhiều hơn thay vì hardcode colors
- Đảm bảo tất cả SVG icons dùng currentColor
- Thêm smooth transition khi chuyển theme
- Test dark mode với screenshots để đảm bảo consistency
```

---

## PHẦN 8: ƯU TIÊN THỰC HIỆN

### 🔴 Ưu Tiên Cao (Sprint 1 — 1-2 tuần)
1. **Trang Bảng xếp hạng:** Redesign Top 3 podium + skeleton loader + search sticky
2. **Hero Banner Trang chủ:** Thêm overlay text + CTA + slide indicators
3. **Stats counters:** Animated counters + skeleton loader
4. **Trang Hướng dẫn:** Thêm FAQ section + cải thiện step cards
5. **Header:** Glassmorphism + mobile drawer menu

### 🟡 Ưu Tiên Trung Bình (Sprint 2 — 2-3 tuần)
6. **Trang Giới thiệu:** Hero section + Stats row + QR CTA redesign
7. **Trang Thời gian:** Timeline tracker + countdown timer + current stage indicator
8. **Footer:** Social SVG icons + back-to-top + newsletter
9. **Vote button:** Ripple effect + success/error states
10. **Filter/Sort bar:** Cho danh sách dự án

### 🟢 Ưu Tiên Thấp (Sprint 3 — có thể làm sau)
11. **Dark mode refinements:** Audit và simplify
12. **Micro-interactions:** Number counter, toast notifications
13. **Performance:** next/image migration, reduce polling
14. **Accessibility audit:** Focus styles, contrast check
15. **Page transitions:** Loading bar, fade animations

---

## PHẦN 9: GHI CHÚ KỸ THUẬT

### Cách Thêm Animated Counter:
```typescript
// Hook useCountUp
function useCountUp(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  
  return count;
}
```

### Cách Thêm Ripple Effect:
```css
.ripple-btn {
  position: relative;
  overflow: hidden;
}

.ripple-btn::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  transform: scale(0);
  animation: ripple 600ms linear;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

### Cách Thêm Countdown Timer:
```typescript
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return timeLeft;
}
```

---

## PHẦN 10: RESOURCES & INSPIRATION

### References:
- **Podium design:** dribbble.com - search "leaderboard ui design"
- **Timeline:** Framer Motion timeline examples
- **Glassmorphism:** css.glass generator
- **Color palette:** coolors.co — generate complementary to #0A2FFF và #79BCC2
- **Illustrations:** undraw.co (free, customizable SVG illustrations)
- **Icons:** heroicons.com hoặc lucide.dev (consistent SVG icon sets)

### Tools Gợi Ý:
- **Framer Motion:** Thay CSS animations bằng Framer Motion để smoother
- **react-countup:** Thư viện animated counter
- **sonner:** Toast notification library nhẹ
- **embla-carousel:** Better carousel/slider than custom drag implementation

---

*Tài liệu này là bản đánh giá toàn diện và hướng cải thiện. Ưu tiên thực hiện theo từng sprint dựa trên nguồn lực và timeline dự án.*

*Cập nhật lần cuối: 2026-06-20*
