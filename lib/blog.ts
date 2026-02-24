export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTime: number; // minutes
  featured: boolean;
  seo: {
    metaTitle: string;
    metaDescription: string;
    focusKeyword: string;
  };
};

export type AgentConfig = {
  provider: "openai" | "anthropic" | "gemini";
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  useGrounding: boolean;
};

export const DEFAULT_BLOG_CATEGORIES = [
  "Du lịch Tà Giang",
  "Ẩm thực địa phương",
  "Văn hóa bản địa",
  "Kinh nghiệm phượt",
  "Sinh thái & Thiên nhiên",
  "Tin tức homestay",
];

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  provider: "gemini",
  apiKey: "",
  model: "gemini-2.0-flash",
  temperature: 0.7,
  maxTokens: 3000,
  useGrounding: true,
  systemPrompt: `Bạn là chuyên gia viết nội dung SEO cho Tà Giang ecolodge – homestay sinh thái.
Khi viết bài, hãy:
- Research thông tin thực tế, cập nhật nhất về chủ đề
- Tập trung vào Tà Giang Ecolodge: trải nghiệm, dịch vụ, không gian, ẩm thực tại homestay
- Tối ưu SEO tự nhiên với từ khóa liên quan đến Tà Giang Ecolodge, homestay sinh thái
- Gắn deeplink nội bộ đến các trang: /rooms, /#contact, /#amenities, /#gallery
- Viết giọng văn thân thiện, truyền cảm hứng
- Cấu trúc bài: H1 > H2 > H3, có intro, body, CTA cuối bài
- Độ dài 800-1500 từ
- Luôn đề cập Tà Giang Ecolodge tự nhiên trong bài
- Format output: JSON với các field: title, excerpt, content (markdown), tags, seo`,
};

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "kinh-nghiem-du-lich-Ta-giang-tu-tuc",
    title: "Kinh nghiệm du lịch Tà Giang tự túc từ A đến Z",
    excerpt:
      "Tà Giang – mảnh đất Miền Trung hoang sơ với cao nguyên đá hùng vĩ, ruộng bậc thang mùa vàng và những con đèo ngoạn mục. Cùng khám phá hành trình tự túc hoàn hảo.",
    content: `# Kinh nghiệm du lịch tà giang tự túc từ A đến Z\n\ntà giang là điểm đến không thể bỏ qua...`,
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    category: "Kinh nghiệm phượt",
    tags: ["Tà giang", "du lịch tự túc", "cao nguyên đá", "phượt"],
    author: "Tà Giang ecolodge",
    publishedAt: "2026-01-15",
    readTime: 8,
    featured: true,
    seo: {
      metaTitle: "Kinh nghiệm du lịch Tà Giang tự túc 2026 | Tà Giang ecolodge",
      metaDescription:
        "Hướng dẫn du lịch Tà Giang tự túc chi tiết: lịch trình, chi phí, địa điểm check-in, ẩm thực. Nghỉ tại Tà Giang ecolodge để trải nghiệm trọn vẹn.",
      focusKeyword: "du lịch Tà giang tự túc",
    },
  },
  {
    id: "2",
    slug: "am-thuc-Ta-giang-nhung-mon-khong-the-bo-qua",
    title: "Ẩm thực Tà Giang: 10 món không thể bỏ qua",
    excerpt:
      "Từ thắng cố nghi ngút khói đến mèn mén vàng ươm, ẩm thực tà giang mang đậm hồn cốt núi rừng Tây Bắc. Khám phá ngay những món đặc sản không thể bỏ lỡ.",
    content: `# Ẩm thực Tà Giang: 10 món không thể bỏ qua\n\nĐến tà giang mà chưa thử thắng cố...`,
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    category: "Ẩm thực địa phương",
    tags: ["ẩm thực Tà giang", "thắng cố", "mèn mén", "đặc sản"],
    author: "Tà Giang Ecolodge",
    publishedAt: "2026-01-28",
    readTime: 6,
    featured: false,
    seo: {
      metaTitle: "10 món ẩm thực Tà Giang không thể bỏ qua | Tà Giang ecolodge",
      metaDescription:
        "Khám phá 10 món ẩm thực đặc sản Tà Giang: thắng cố, mèn mén, rượu ngô, bánh cuốn trứng... Tất cả đều có tại nhà hàng Tà Giang ecolodge.",
      focusKeyword: "ẩm thực Tà giang",
    },
  },
  {
    id: "3",
    slug: "homestay-sinh-thai-Ta-giang-tai-sao-nen-chon",
    title: "Tại sao nên chọn homestay sinh thái khi đến tà giang?",
    excerpt:
      "Homestay sinh thái không chỉ là nơi nghỉ ngơi – đó là cách bạn kết nối thực sự với thiên nhiên và con người Tà Giang. Tà Giang ecolodge chia sẻ lý do.",
    content: `# Tại sao nên chọn homestay sinh thái khi đến Tà Giang?\n\nDu lịch có trách nhiệm...`,
    coverImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    category: "Sinh thái & Thiên nhiên",
    tags: ["homestay sinh thái", "du lịch bền vững", "Tà giang", "tà giang ecolodge"],
    author: "Tà Giang ecolodge",
    publishedAt: "2026-02-10",
    readTime: 5,
    featured: false,
    seo: {
      metaTitle: "Homestay sinh thái Tà Giang – Tà Giang ecolodge",
      metaDescription:
        "Lý do nên chọn homestay sinh thái Tà Giang ecolodge khi du lịch Tà Giang: trải nghiệm bản địa, thân thiện môi trường, view đẹp, ẩm thực địa phương.",
      focusKeyword: "homestay sinh thái Tà giang",
    },
  },
];
