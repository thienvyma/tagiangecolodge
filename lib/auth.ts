// Auth config – credentials PHẢI được đặt trong biến môi trường
// Không có giá trị mặc định để tránh lỗi bảo mật khi quên cấu hình

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        console.warn(`[Auth] CẢNH BÁO: Biến môi trường ${name} chưa được đặt!`);
        return `not-set-${Math.random()}`; // Tránh lỗi build-time của Next.js nhưng vẫn đảm bảo an toàn
    }
    return value;
}

export const ADMIN_USERNAME = requireEnv("ADMIN_USERNAME");
export const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD");
export const SESSION_COOKIE = "tg_admin_session";
export const SESSION_SECRET = requireEnv("SESSION_SECRET");
