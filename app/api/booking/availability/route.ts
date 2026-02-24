import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// GET /api/booking/availability?roomId=1
// Returns confirmed booking date ranges for a room
export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get("roomId");
  if (!roomId) return NextResponse.json({ error: "roomId required" }, { status: 400 });

  try {
    const supabase = getSupabase();
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("bookings")
      .select("checkin, checkout")
      .eq("room_id", parseInt(roomId))
      .eq("status", "confirmed")
      .gte("checkout", today);

    if (error) throw error;

    // Return array of { checkin, checkout } ranges
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("[availability]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
