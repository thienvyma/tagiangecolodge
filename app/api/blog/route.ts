import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

// GET /api/blog — list all posts
// GET /api/blog?slug=xxx — get single post by slug
export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabase();
    const slug = req.nextUrl.searchParams.get("slug");

    if (slug) {
      const { data, error } = await supabase.from("posts").select("*").eq("slug", slug).single();
      if (error) return NextResponse.json({ error: "Bài viết không tồn tại" }, { status: 404 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    console.error("[blog-api]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/blog — create post
export async function POST(req: NextRequest) {
  try {
    const postData = await req.json();
    if (!postData.slug || !postData.title) return NextResponse.json({ error: "Thiếu slug hoặc title" }, { status: 400 });
    const supabase = getSupabase();
    const { error } = await supabase.from("posts").insert([postData]);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT /api/blog — update post
export async function PUT(req: NextRequest) {
  try {
    const { id, ...postData } = await req.json();
    if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
    const supabase = getSupabase();
    const { error } = await supabase.from("posts").update(postData).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// DELETE /api/blog?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Thiếu id" }, { status: 400 });
    const supabase = getSupabase();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
