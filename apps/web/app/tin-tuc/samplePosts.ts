export interface SamplePost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl: string;
  category: string;
  views: number;
  createdAt: string;
  isActive?: boolean;
}

export const SAMPLE_NEWS_POSTS: SamplePost[] = [
  {
    id: 'sample-post-1',
    title: 'Chính thức mở cổng đăng ký HUIT Startup lần VII năm 2026',
    slug: 'chinh-thuc-mo-cong-dang-ky-huit-startup-lan-vii-2026',
    summary: 'Ban tổ chức chính thức mở cổng tiếp nhận hồ sơ dự thi, chào đón các ý tưởng và dự án khởi nghiệp đổi mới sáng tạo từ học sinh, sinh viên và doanh nghiệp.',
    thumbnailUrl: '/uploads/baner.jpg',
    category: 'Thông báo',
    views: 2486,
    createdAt: '2026-06-18T08:00:00.000Z',
    isActive: true,
    content: `
      <p>HUIT Startup lần thứ VII năm 2026 chính thức mở cổng đăng ký trực tuyến dành cho các cá nhân, nhóm dự án và doanh nghiệp có ý tưởng đổi mới sáng tạo hướng đến phát triển bền vững.</p>
      <h3>Những điểm cần lưu ý</h3>
      <ul>
        <li>Thí sinh chuẩn bị đầy đủ thông tin nhóm, mô tả dự án và tài liệu thuyết minh.</li>
        <li>Hồ sơ hợp lệ sẽ được xác nhận và theo dõi trên hệ thống quản lý cuộc thi.</li>
        <li>Ban tổ chức khuyến khích các dự án có tính ứng dụng, tác động xã hội và khả năng thương mại hóa.</li>
      </ul>
      <p>Trong suốt thời gian nhận hồ sơ, đội ngũ hỗ trợ sẽ đồng hành để giải đáp các vướng mắc về quy trình nộp bài, bảng thi và tiêu chí đánh giá.</p>
      <p>HUIT Startup không chỉ là một cuộc thi mà còn là hành trình ươm tạo, kết nối chuyên gia, doanh nghiệp và nhà đầu tư để giúp dự án phát triển bền vững hơn sau cuộc thi.</p>
    `,
  },
  {
    id: 'sample-post-2',
    title: 'Lịch trình đào tạo và mentoring dành cho các đội vào vòng bán kết',
    slug: 'lich-trinh-dao-tao-va-mentoring-vong-ban-ket',
    summary: 'Các đội vượt qua vòng sơ loại sẽ tham gia chuỗi đào tạo chuyên đề, coaching 1:1 và hoàn thiện mô hình kinh doanh trước ngày pitching.',
    thumbnailUrl: '/uploads/poster-khoi-nghiep.jpg',
    category: 'Tin tức',
    views: 1942,
    createdAt: '2026-06-16T09:30:00.000Z',
    isActive: true,
    content: `
      <p>Sau khi công bố kết quả vòng sơ loại, các đội thi bước vào giai đoạn tăng tốc với lịch đào tạo tập trung, mentoring chuyên sâu và kiểm chứng giả thuyết thị trường.</p>
      <h3>Nội dung chương trình</h3>
      <ul>
        <li>Xây dựng bài toán khách hàng và định vị giá trị cốt lõi.</li>
        <li>Hoàn thiện mô hình kinh doanh, doanh thu và chiến lược tăng trưởng.</li>
        <li>Rèn luyện kỹ năng pitching, phản biện và kể chuyện dự án.</li>
      </ul>
      <p>Mỗi đội sẽ có cơ hội làm việc trực tiếp với mentor theo từng lĩnh vực để nhận góp ý thực tế, từ đó hoàn thiện hồ sơ và bài thuyết trình trước ngày bán kết.</p>
    `,
  },
  {
    id: 'sample-post-3',
    title: 'Startup Tour 2026: Kết nối doanh nghiệp và kiểm chứng thị trường thực tế',
    slug: 'startup-tour-2026-ket-noi-doanh-nghiep-va-kiem-chung-thi-truong',
    summary: 'Hoạt động Startup Tour giúp các đội tiếp cận môi trường doanh nghiệp thực tế, quan sát quy trình vận hành và kiểm chứng khả năng ứng dụng của dự án.',
    thumbnailUrl: '/uploads/baner.jpg',
    category: 'Tin tức',
    views: 1517,
    createdAt: '2026-06-15T14:15:00.000Z',
    isActive: true,
    content: `
      <p>Startup Tour là hoạt động đồng hành nổi bật của HUIT Startup 2026, nơi các đội thi được tiếp cận trực tiếp với doanh nghiệp, nhà máy, đơn vị vận hành và hệ sinh thái đổi mới sáng tạo.</p>
      <p>Thông qua các buổi khảo sát thực tế, đội thi có thêm dữ liệu để đánh giá nhu cầu khách hàng, chi phí triển khai và khả năng mở rộng sản phẩm.</p>
      <h3>Giá trị nhận được</h3>
      <ul>
        <li>Tiếp xúc với người dùng mục tiêu và đơn vị triển khai thực tế.</li>
        <li>Điều chỉnh mô hình kinh doanh từ phản hồi thị trường.</li>
        <li>Tăng độ tin cậy cho bài pitching trước hội đồng chuyên môn.</li>
      </ul>
    `,
  },
  {
    id: 'sample-post-4',
    title: '5 tiêu chí hội đồng sử dụng để đánh giá một dự án khởi nghiệp tiềm năng',
    slug: '5-tieu-chi-danh-gia-du-an-khoi-nghiep-tiem-nang',
    summary: 'Từ tính mới, khả năng giải quyết vấn đề đến mô hình doanh thu và đội ngũ thực thi, đây là 5 nhóm tiêu chí quan trọng mà thí sinh cần tập trung.',
    thumbnailUrl: '/uploads/poster-khoi-nghiep.jpg',
    category: 'Tin tức',
    views: 1368,
    createdAt: '2026-06-12T10:45:00.000Z',
    isActive: true,
    content: `
      <p>Để chuẩn bị tốt cho vòng thuyết trình, các đội cần nắm rõ các tiêu chí đánh giá cốt lõi mà hội đồng chuyên môn sử dụng.</p>
      <h3>Năm nhóm tiêu chí chính</h3>
      <ul>
        <li>Tính sáng tạo và sự khác biệt của giải pháp.</li>
        <li>Mức độ cấp thiết của vấn đề và quy mô thị trường.</li>
        <li>Tính khả thi về vận hành, kỹ thuật và nguồn lực.</li>
        <li>Mô hình tài chính, doanh thu và kế hoạch tăng trưởng.</li>
        <li>Năng lực đội ngũ và cam kết triển khai dự án.</li>
      </ul>
      <p>Việc chuẩn bị hồ sơ và bài trình bày bám sát các tiêu chí này sẽ giúp dự án tăng khả năng thuyết phục trước hội đồng và nhà đầu tư.</p>
    `,
  },
  {
    id: 'sample-post-5',
    title: 'Thông báo cập nhật lịch trình vòng bán kết và thời gian nộp thuyết minh',
    slug: 'thong-bao-cap-nhat-lich-trinh-vong-ban-ket',
    summary: 'Ban tổ chức điều chỉnh một số mốc thời gian liên quan đến vòng bán kết để các đội có thêm thời gian hoàn thiện thuyết minh dự án.',
    thumbnailUrl: '/uploads/baner.jpg',
    category: 'Thông báo',
    views: 1104,
    createdAt: '2026-06-10T16:20:00.000Z',
    isActive: true,
    content: `
      <p>Ban tổ chức thông báo cập nhật lịch trình vòng bán kết nhằm bảo đảm chất lượng chuẩn bị của các đội thi và thuận tiện cho công tác chuyên môn.</p>
      <p>Các mốc mới sẽ được đồng bộ trên trang Thời gian và gửi qua các kênh thông báo chính thức của cuộc thi.</p>
      <ul>
        <li>Gia hạn thời gian nộp thuyết minh hoàn chỉnh.</li>
        <li>Bổ sung thêm khung giờ coaching trực tuyến 1:1.</li>
        <li>Cập nhật lịch pitching theo từng bảng thi.</li>
      </ul>
      <p>Đề nghị các đội chủ động theo dõi email và trang Tin tức để không bỏ lỡ các thông báo mới nhất.</p>
    `,
  },
  {
    id: 'sample-post-6',
    title: 'HUIT Startup 2026 mở rộng mạng lưới cố vấn trong các lĩnh vực AI, nông nghiệp và giáo dục',
    slug: 'mo-rong-mang-luoi-co-van-huit-startup-2026',
    summary: 'Mạng lưới mentor năm nay được mở rộng với nhiều chuyên gia thực chiến, hỗ trợ sâu hơn cho các dự án ở giai đoạn tăng tốc và gọi vốn.',
    thumbnailUrl: '/uploads/poster-khoi-nghiep.jpg',
    category: 'Tin tức',
    views: 986,
    createdAt: '2026-06-08T11:00:00.000Z',
    isActive: true,
    content: `
      <p>Để tăng chất lượng hỗ trợ dự án, HUIT Startup 2026 tiếp tục mở rộng mạng lưới mentor và chuyên gia đến từ doanh nghiệp, quỹ đầu tư, trung tâm ươm tạo và trường đại học.</p>
      <h3>Những nhóm chuyên gia nổi bật</h3>
      <ul>
        <li>Chuyên gia AI, dữ liệu và chuyển đổi số.</li>
        <li>Chuyên gia phát triển sản phẩm nông nghiệp và thực phẩm.</li>
        <li>Chuyên gia giáo dục, truyền thông và xây dựng thương hiệu.</li>
      </ul>
      <p>Việc mở rộng mạng lưới cố vấn giúp các dự án nhận được phản hồi đa chiều, sát thực tế và phù hợp hơn với định hướng phát triển sau cuộc thi.</p>
    `,
  },
];
