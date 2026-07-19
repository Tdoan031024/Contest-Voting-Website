const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Read contest_voting_db.json if it exists
  let dbBackup = {};
  const backupPath = path.join(__dirname, 'contest_voting_db.json');
  if (fs.existsSync(backupPath)) {
    try {
      dbBackup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      console.log('📖 Successfully read contest_voting_db.json backup data.');
    } catch (e) {
      console.error('⚠️ Could not parse contest_voting_db.json:', e);
    }
  }

  // 2. Seed Candidates
  if (Array.isArray(dbBackup.candidates)) {
    console.log(`👤 Seeding ${dbBackup.candidates.length} candidates...`);
    for (const c of dbBackup.candidates) {
      const bioData = c.biography ? JSON.parse(c.biography) : {};
      
      await prisma.candidate.upsert({
        where: { sbd: c.sbd },
        update: {
          name: c.name,
          votes: c.votes || 0,
          imageUrl: c.imageUrl,
          description: c.description,
          advisorName: bioData.advisorName || null,
          contestTable: bioData.contestTable || 'STUDENT',
          contestTableLabel: bioData.contestTableLabel || 'Bảng sinh viên',
          currentRound: bioData.currentRound || 'Vòng loại',
          expectations: bioData.expectations || null,
          implementationLocation: bioData.implementationLocation || null,
          intellectualPropertyCommitment: bioData.intellectualPropertyCommitment || false,
          leaderEmail: bioData.leaderEmail || null,
          leaderName: bioData.leaderName || null,
          leaderPhone: bioData.leaderPhone || null,
          members: bioData.members || null,
          representativeSchool: bioData.representativeSchool || null,
          status: bioData.status || 'Đủ hồ sơ',
          supportNeeds: bioData.supportNeeds || null,
          teamName: bioData.teamName || null,
          sector: bioData.sector || null,
        },
        create: {
          sbd: c.sbd,
          name: c.name,
          votes: c.votes || 0,
          imageUrl: c.imageUrl,
          description: c.description,
          advisorName: bioData.advisorName || null,
          contestTable: bioData.contestTable || 'STUDENT',
          contestTableLabel: bioData.contestTableLabel || 'Bảng sinh viên',
          currentRound: bioData.currentRound || 'Vòng loại',
          expectations: bioData.expectations || null,
          implementationLocation: bioData.implementationLocation || null,
          intellectualPropertyCommitment: bioData.intellectualPropertyCommitment || false,
          leaderEmail: bioData.leaderEmail || null,
          leaderName: bioData.leaderName || null,
          leaderPhone: bioData.leaderPhone || null,
          members: bioData.members || null,
          representativeSchool: bioData.representativeSchool || null,
          status: bioData.status || 'Đủ hồ sơ',
          supportNeeds: bioData.supportNeeds || null,
          teamName: bioData.teamName || null,
          sector: bioData.sector || null,
        },
      });
    }
  }

  // 3. Seed Sponsors
  if (Array.isArray(dbBackup.sponsors)) {
    console.log(`🤝 Seeding ${dbBackup.sponsors.length} sponsors...`);
    for (const s of dbBackup.sponsors) {
      await prisma.sponsor.upsert({
        where: { id: s.id },
        update: {
          name: s.name,
          logoUrl: s.logoUrl,
          tier: s.tier,
        },
        create: {
          id: s.id,
          name: s.name,
          logoUrl: s.logoUrl,
          tier: s.tier,
        },
      });
    }
  }

  // 4. Seed Banners
  if (Array.isArray(dbBackup.banners)) {
    console.log(`🖼️ Seeding ${dbBackup.banners.length} banners...`);
    for (const b of dbBackup.banners) {
      await prisma.banner.upsert({
        where: { id: b.id },
        update: {
          title: b.title,
          imageUrl: b.imageUrl,
          link: b.link,
          isActive: b.isActive,
        },
        create: {
          id: b.id,
          title: b.title,
          imageUrl: b.imageUrl,
          link: b.link,
          isActive: b.isActive,
        },
      });
    }
  }

  // 5. Seed Timeline Events
  if (Array.isArray(dbBackup.timeline)) {
    console.log(`📅 Seeding ${dbBackup.timeline.length} timeline events...`);
    for (const t of dbBackup.timeline) {
      await prisma.timelineEvent.upsert({
        where: { id: t.id },
        update: {
          date: t.date,
          title: t.title,
          description: t.description,
          isActive: t.isActive || false,
        },
        create: {
          id: t.id,
          date: t.date,
          title: t.title,
          description: t.description,
          isActive: t.isActive || false,
        },
      });
    }
  }

  // 6. Seed System news posts (Rich HTML Content)
  console.log('📰 Seeding sample rich HTML news posts...');
  const samplePosts = [
    {
      id: 'p-1',
      title: 'Lễ phát động Cuất thi Khởi nghiệp HUIT Startup Lần thứ VII năm 2026',
      slug: 'le-phat-dong-cuoc-thi-khoi-nghiep-huit-startup-2026',
      summary: 'Trình bày chi tiết lễ phát động, đối tượng dự thi, thời hạn đăng ký và phần thưởng hấp dẫn của cuộc thi cấp Thành phố năm nay.',
      thumbnailUrl: '/uploads/baner.jpg',
      category: 'Tin tức',
      isActive: true,
      content: `
        <h2 class="text-xl font-bold text-[#123c34] mt-4 mb-2">Chủ đề: "Đổi mới sáng tạo hướng tới mục tiêu phát triển bền vững"</h2>
        <p class="mb-4">Trường Đại học Công Thương TP.HCM (HUIT) phối hợp với các đơn vị đồng hành chính thức phát động Cuộc thi Khởi nghiệp HUIT Startup lần thứ VII năm 2026 cấp Thành phố. Cuộc thi là bệ phóng hoàn hảo giúp các ý tưởng sáng tạo vươn xa.</p>
        
        <blockquote class="border-l-4 border-slate-300 pl-4 py-2 italic my-4 bg-slate-50 text-slate-600">
          "HUIT Startup không chỉ là cuộc thi, đây là nơi ươm mầm các hạt giống công nghệ và giải pháp thực tiễn đóng góp cho kinh tế xanh."
        </blockquote>

        <h3 class="text-lg font-bold text-[#123c34] mt-5 mb-2">Thông tin chi tiết các vòng thi</h3>
        <table class="w-full border-collapse border border-slate-300 my-4 text-sm">
          <thead>
            <tr class="bg-slate-100">
              <th class="border border-slate-300 px-3 py-2 text-left">Vòng thi</th>
              <th class="border border-slate-300 px-3 py-2 text-left">Thời gian</th>
              <th class="border border-slate-300 px-3 py-2 text-left">Mục tiêu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-slate-300 px-3 py-2">Vòng Sơ loại</td>
              <td class="border border-slate-300 px-3 py-2">01/06 - 30/07/2026</td>
              <td class="border border-slate-300 px-3 py-2">Nộp hồ sơ trực tuyến, thuyết minh dự án sơ bộ.</td>
            </tr>
            <tr class="bg-slate-50/50">
              <td class="border border-slate-300 px-3 py-2">Vòng Bán kết</td>
              <td class="border border-slate-300 px-3 py-2">15/08 - 15/09/2026</td>
              <td class="border border-slate-300 px-3 py-2">Pitching trước Hội đồng giám khảo &amp; Bình chọn Online.</td>
            </tr>
            <tr>
              <td class="border border-slate-300 px-3 py-2">Vòng Chung kết</td>
              <td class="border border-slate-300 px-3 py-2">Tháng 10/2026</td>
              <td class="border border-slate-300 px-3 py-2">Triển lãm dự án và chung kết xếp hạng trao giải.</td>
            </tr>
          </tbody>
        </table>

        <h3 class="text-lg font-bold text-[#123c34] mt-5 mb-2">Quyền lợi khi tham gia</h3>
        <ul class="list-disc pl-6 mb-4 space-y-1">
          <li><strong>Cơ hội đầu tư:</strong> Tiếp cận mạng lưới quỹ đầu tư thiên thần Việt Nam &amp; quốc tế.</li>
          <li><strong>Đào tạo chuyên sâu:</strong> Tham gia chuỗi Bootcamp kỹ năng hoàn thiện Business Model.</li>
          <li><strong>Cố vấn chuyên sâu:</strong> Đồng hành 1-1 cùng mentor giàu kinh nghiệm khởi nghiệp thực chiến.</li>
          <li><strong>Giải thưởng tiền mặt:</strong> Tổng giải thưởng lên đến 5 TỶ đồng.</li>
        </ul>
      `
    },
    {
      id: 'p-2',
      title: 'Khung giờ vàng - Đua điểm bình chọn bứt phá bảng xếp hạng',
      slug: 'khung-gio-vang-dua-diem-binh-chon-but-pha-bang-xep-hang',
      summary: 'Hướng dẫn chi tiết khung giờ nhân đôi điểm bình chọn, cách tích lũy và thể lệ tham gia bình chọn minh bạch trên nền tảng.',
      thumbnailUrl: '/uploads/baner.jpg',
      category: 'Thông báo',
      isActive: true,
      content: `
        <h2 class="text-xl font-bold text-[#123c34] mt-4 mb-2">Thể lệ Khung giờ Vàng (Golden Hours)</h2>
        <p class="mb-4">Ban tổ chức cuộc thi HUIT Startup 2026 xin thông báo chương trình "Khung giờ vàng bình chọn" nhằm tạo điều kiện cho các đội thi bứt phá thứ hạng điểm số trước vòng bán kết.</p>

        <h3 class="text-lg font-bold text-[#123c34] mt-5 mb-2">1. Thời gian áp dụng</h3>
        <p class="mb-3">Khung giờ vàng sẽ diễn ra ngẫu nhiên hoặc theo lịch cố định được công bố trước 12 tiếng trên fanpage và trang quản trị hệ thống. Trong suốt khung giờ vàng, tất cả lượt vote của người dùng sẽ được nhân đôi (x2) hoặc nhân ba (x3) hệ số điểm tương ứng.</p>

        <h3 class="text-lg font-bold text-[#123c34] mt-5 mb-2">2. Hướng dẫn bình chọn hợp lệ</h3>
        <ol class="list-decimal pl-6 mb-4 space-y-1.5">
          <li>Truy cập vào trang chủ hoặc bảng xếp hạng dự án.</li>
          <li>Tìm đến dự án bạn yêu thích bằng ô tìm kiếm hoặc bộ lọc mã số dự án (SBD).</li>
          <li>Đăng nhập bằng Gmail, Số điện thoại hoặc tài khoản Facebook để nhận lượt vote miễn phí hàng ngày (2 lượt/ngày).</li>
          <li>Nhấn vào nút <strong>"Bình chọn"</strong> để ghi nhận điểm số. Điểm số sẽ tự động nhân theo hệ số giờ vàng đang hoạt động.</li>
        </ol>

        <h3 class="text-lg font-bold text-[#123c34] mt-5 mb-2">3. Cam kết tính minh bạch</h3>
        <p class="mb-4">Nền tảng sử dụng các thuật toán giám sát IP, thiết bị và xác thực tài khoản để ngăn chặn mọi hành vi gian lận điểm số. Các lượt vote bất thường sẽ bị hệ thống tự động lọc bỏ và thông báo cảnh báo đến đội thi.</p>
      `
    }
  ];

  for (const p of samplePosts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        summary: p.summary,
        content: p.content,
        thumbnailUrl: p.thumbnailUrl,
        category: p.category,
        isActive: p.isActive,
      },
      create: {
        id: p.id,
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        content: p.content,
        thumbnailUrl: p.thumbnailUrl,
        category: p.category,
        isActive: p.isActive,
      },
    });
  }

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
