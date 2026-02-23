import { NextRequest, NextResponse } from "next/server";

const DEEPLINKS = [
  { label: "Trang phòng nghỉ", url: "/rooms" },
  { label: "Đặt phòng / Liên hệ", url: "/#contact" },
  { label: "Tiện ích", url: "/#amenities" },
  { label: "Thư viện ảnh", url: "/#gallery" },
  { label: "Giới thiệu", url: "/#about" },
  { label: "Blog du lịch", url: "/blog" },
];

function buildPrompt(topic: string, category: string, extra: string, systemPrompt: string) {
  const deeplinksStr = DEEPLINKS.map((d) => `- [${d.label}](${d.url})`).join("\n");
  return `${systemPrompt}

---
Chủ đề: ${topic}
Danh mục: ${category}
Yêu cầu thêm: ${extra || "Không có"}

Deeplinks nội bộ cần gắn tự nhiên vào bài:
${deeplinksStr}

Hãy sử dụng Google Search để research thông tin mới nhất về chủ đề này, sau đó viết bài hoàn chỉnh.

Trả về JSON (và CHỈ JSON, không có text ngoài) với format:
{
  "title": "...",
  "excerpt": "...(tối đa 160 ký tự)",
  "content": "...(markdown, 800-1500 từ, có deeplinks tự nhiên)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seo": {
    "metaTitle": "...(50-60 ký tự)",
    "metaDescription": "...(150-160 ký tự)",
    "focusKeyword": "..."
  }
}`;
}

export async function POST(req: NextRequest) {
  try {
    const { model, topic, category, extra, systemPrompt, temperature, maxTokens } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY chưa được cấu hình trên server" }, { status: 500 });
    if (!topic) return NextResponse.json({ error: "Thiếu chủ đề" }, { status: 400 });

    const prompt = buildPrompt(topic, category, extra, systemPrompt);

    // Use Gemini with Google Search grounding
    const geminiModel = model || "gemini-2.0-flash";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

    // Gemini 2.0+ uses "googleSearch", older models use "google_search"
    const isGemini2 = geminiModel.startsWith("gemini-2");
    const searchTool = isGemini2 ? { googleSearch: {} } : { google_search: {} };

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      tools: [searchTool],
      generationConfig: {
        temperature: temperature ?? 0.7,
        maxOutputTokens: maxTokens ?? 3000,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      const errMsg = json.error?.message ?? JSON.stringify(json);
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    // Gemini may return multiple parts (text + grounding); collect all text parts
    const parts: Array<{ text?: string }> = json.candidates?.[0]?.content?.parts ?? [];
    const rawText: string = parts.map((p) => p.text ?? "").join("");

    if (!rawText) {
      return NextResponse.json({ error: "AI trả về nội dung rỗng", raw: json }, { status: 422 });
    }

    // Extract JSON block from response
    const match = rawText.match(/```json\s*([\s\S]*?)```/) ?? rawText.match(/(\{[\s\S]*\})/);
    if (!match) {
      return NextResponse.json({ error: "AI không trả về JSON hợp lệ", raw: rawText.slice(0, 500) }, { status: 422 });
    }

    const jsonStr = match[1] ?? match[0];
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: "Không parse được JSON từ AI", raw: jsonStr.slice(0, 500) }, { status: 422 });
    }

    // Include grounding metadata if available
    const groundingMeta = json.candidates?.[0]?.groundingMetadata;
    const sources: string[] = groundingMeta?.webSearchQueries ?? [];

    return NextResponse.json({ ...data, _sources: sources });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
