-- ==============================================================================
-- 🚀 SCHEMA SUPABASE CHO TÀ GIANG ecolodge
-- Copy toàn bộ nội dung này dán vào SQL Editor trên dashboard Supabase của bạn
-- ==============================================================================

-- 1. Bảng đặt phòng (bookings)
CREATE TABLE bookings (
  id TEXT PRIMARY KEY DEFAULT 'BK' || extract(epoch FROM now())::bigint::text,
  guest TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  room_id INT NOT NULL,
  room_name TEXT NOT NULL,
  checkin DATE NOT NULL,
  checkout DATE NOT NULL,
  guests INT DEFAULT 1,
  message TEXT DEFAULT '',
  total NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bảng blog posts 
CREATE TABLE posts (
  id TEXT PRIMARY KEY DEFAULT 'post_' || extract(epoch FROM now())::bigint::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Tà Giang ecolodge',
  published_at TIMESTAMPTZ DEFAULT now(),
  read_time INT DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  seo_meta_title TEXT,
  seo_meta_description TEXT,
  seo_focus_keyword TEXT
);

-- ==============================================================================
-- 🔒 BẢO MẬT & PHÂN QUYỀN (Row Level Security)
-- Rất quan trọng để tránh người ngoài truy cập trái phép dữ liệu
-- ==============================================================================

-- Bật tính năng RLS cho cả 2 bảng
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- BÀI VIẾT (POSTS): Ai cũng có thể xem (để hiển thị lên blog)
CREATE POLICY "Cho phép tất cả đọc bài viết" ON posts FOR SELECT USING (true);

-- API Server tạo dữ liệu: API Route trên hệ thống được phép tạo booking / blog
-- Supabase anon key mặc định được dùng trong client, để server thao tác thoải mái cần mở quyền
CREATE POLICY "Cho phép thêm booking" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Cho phép đọc/sửa/xóa booking ẩn danh" ON bookings FOR ALL USING (true);
CREATE POLICY "Cho phép đọc/sửa/xóa bài viết ẩn danh" ON posts FOR ALL USING (true);

-- *Lưu ý: Trong dự án thực tế lớn hơn, bạn nên dùng service_role_key trên server 
-- thay vì mở public policy như trên. Ở dự án này, toàn bộ sửa/xóa đều nằm sau lớp
-- bảo mật /admin login của riêng Next.js nên tạm thời mở policy auth ẩn danh.*
