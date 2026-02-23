import { createClient } from "@supabase/supabase-js";

// Lấy thông tin từ biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Khởi tạo client Supabase
// Không export trực tiếp client để tránh lỗi throw error khi file này được import ở những nơi
// không có env vars (như lúc build tĩnh). Thay vào đó, tạo một hàm getter.

export function getSupabase() {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error(
            "🔴 Lỗi: Chưa cấu hình NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY trong .env.local"
        );
    }
    return createClient(supabaseUrl, supabaseKey);
}
