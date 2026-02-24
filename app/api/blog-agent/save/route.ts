import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const postData = await req.json();
    if (!postData.slug || !postData.title) {
      return NextResponse.json({ error: "Thiếu slug hoặc title" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("posts").insert([postData]);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    console.error("[blog-save]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
