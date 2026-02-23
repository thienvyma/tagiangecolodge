import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVND(amount: number) {
    return amount.toLocaleString("vi-VN") + "₫";
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function calcNights(checkin: string, checkout: string): number {
    return Math.max(1, (new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000);
}

// ─── Email HTML Template ──────────────────────────────────────────────────────

function buildEmailHTML(data: {
    bookingId: string;
    guest: string;
    email: string;
    phone: string;
    roomName: string;
    checkin: string;
    checkout: string;
    guests: number;
    message: string;
    total: number;
    nights: number;
    roomPrice: number;
}) {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt phòng mới – Tà Giang Ecolog</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#2d5a27;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#a3d99a;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Tà Giang Ecolog</p>
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">🌿 Đặt phòng mới!</h1>
              <p style="margin:8px 0 0;color:#c8e6c4;font-size:14px;">Mã Đặt phòng: <strong>${data.bookingId}</strong></p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:32px 40px;">

              <!-- Guest info -->
              <h2 style="margin:0 0 16px;font-size:16px;color:#1c1917;font-weight:600;border-bottom:2px solid #f0fdf4;padding-bottom:8px;">👤 Thông tin khách</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;width:120px;">Họ tên</td>
                  <td style="padding:6px 0;color:#1c1917;font-size:14px;font-weight:600;">${data.guest}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;">Điện thoại</td>
                  <td style="padding:6px 0;">
                    <a href="tel:${data.phone}" style="color:#2d5a27;font-size:14px;font-weight:600;text-decoration:none;">${data.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;">Email</td>
                  <td style="padding:6px 0;">
                    <a href="mailto:${data.email}" style="color:#2d5a27;font-size:14px;font-weight:600;text-decoration:none;">${data.email || "Không cung cấp"}</a>
                  </td>
                </tr>
              </table>

              <!-- Booking details -->
              <h2 style="margin:0 0 16px;font-size:16px;color:#1c1917;font-weight:600;border-bottom:2px solid #f0fdf4;padding-bottom:8px;">🏡 Chi tiết Đặt phòng</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;width:120px;">Phòng</td>
                  <td style="padding:6px 0;color:#1c1917;font-size:14px;font-weight:600;">${data.roomName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;">Nhận phòng</td>
                  <td style="padding:6px 0;color:#1c1917;font-size:14px;font-weight:600;">${formatDate(data.checkin)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;">Trả phòng</td>
                  <td style="padding:6px 0;color:#1c1917;font-size:14px;font-weight:600;">${formatDate(data.checkout)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;">Số đêm</td>
                  <td style="padding:6px 0;color:#1c1917;font-size:14px;font-weight:600;">${data.nights} đêm</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#78716c;font-size:14px;">Số khách</td>
                  <td style="padding:6px 0;color:#1c1917;font-size:14px;font-weight:600;">${data.guests} khách</td>
                </tr>
              </table>

              ${data.message ? `
              <!-- Note -->
              <div style="background:#f9f6f2;border-left:4px solid #2d5a27;border-radius:4px;padding:12px 16px;margin-bottom:24px;">
                <p style="margin:0 0 4px;font-size:12px;color:#78716c;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Ghi chú</p>
                <p style="margin:0;font-size:14px;color:#1c1917;">${data.message}</p>
              </div>
              ` : ""}

              <!-- Total -->
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:13px;color:#4ade80;">Dự kiến thanh toán</p>
                <p style="margin:0;font-size:28px;font-weight:700;color:#15803d;">${formatVND(data.total)}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">${formatVND(data.roomPrice)}/đêm × ${data.nights} đêm</p>
              </div>

              <!-- CTA -->
              <div style="text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin/bookings" style="display:inline-block;background:#2d5a27;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">
                  Xem trong Admin Dashboard →
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f6f2;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#a8a29e;">
                Email này được gửi tự động từ hệ thống Tà Giang Ecolog.<br />
                Nhận phòng lúc 14:00 · Trả phòng trước 12:00
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guest, email, phone, roomId, roomName, checkin, checkout, guests, message, roomPrice } = body;

        // Validate required fields
        if (!guest || !phone || !roomName || !checkin || !checkout) {
            return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const nights = calcNights(checkin, checkout);
        const total = Math.max(1, nights) * (roomPrice ?? 0);
        const bookingId = `BK${Date.now()}`;

        // ── Send email (only if env vars are configured) ───────────────────────
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_APP_PASSWORD;
        const notifyEmail = process.env.NOTIFY_EMAIL;

        if (gmailUser && gmailPass && notifyEmail) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: gmailUser, pass: gmailPass },
            });

            await transporter.sendMail({
                from: `"Tà Giang Ecolog" <${gmailUser}>`,
                to: notifyEmail,
                subject: `🏡 Đặt phòng mới: ${guest} - ${roomName} (${checkin})`,
                html: buildEmailHTML({
                    bookingId,
                    guest,
                    email: email ?? "",
                    phone,
                    roomName,
                    checkin,
                    checkout,
                    guests: Number(guests),
                    message: message ?? "",
                    total,
                    nights,
                    roomPrice: roomPrice ?? 0,
                }),
            });
        }

        return NextResponse.json({ ok: true, bookingId, total });
    } catch (err: unknown) {
        console.error("[booking api]", err);
        const msg = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
