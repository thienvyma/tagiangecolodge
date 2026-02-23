"use client";
import { useState } from "react";
import { Bot, Settings2, Sparkles, Copy, Check, Save, RefreshCw, ChevronDown, ChevronUp, ExternalLink, Search, Zap } from "lucide-react";
import { DEFAULT_AGENT_CONFIG, type AgentConfig } from "@/lib/blog";
import { useStore } from "@/lib/store";

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"];

const PROMPT_TEMPLATES = [
  { label: "Kinh nghiem du lich", topic: "Kinh nghiem du lich Ha Giang tu tuc", extra: "Lich trinh 3 ngay 2 dem, goi y nghi tai Ta Giang Ecolog" },
  { label: "Review homestay", topic: "Review homestay sinh thai Ha Giang", extra: "Tap trung khong gian, am thuc, dich vu cua Ta Giang Ecolog" },
  { label: "Am thuc dia phuong", topic: "Am thuc dac san Ha Giang", extra: "Cac mon nhat dinh phai thu khi den Ha Giang" },
  { label: "Hoa tam giac mach", topic: "Mua hoa tam giac mach Ha Giang", extra: "Thoi diem dep nhat, dia diem ngam hoa, lich trinh" },
];

type GeneratedPost = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  seo: { metaTitle: string; metaDescription: string; focusKeyword: string };
  _sources?: string[];
};

export default function BlogAgentPage() {
  const { addPost, blogCategories } = useStore();
  const [config, setConfig] = useState<AgentConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blog_agent_config");
      if (saved) { try { return { ...DEFAULT_AGENT_CONFIG, ...JSON.parse(saved) }; } catch { /* ignore */ } }
    }
    return DEFAULT_AGENT_CONFIG;
  });
  const [showConfig, setShowConfig] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState(() => blogCategories[0] ?? "");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedPost | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState("");

  const saveConfig = () => {
    localStorage.setItem("blog_agent_config", JSON.stringify(config));
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const runAgent = async () => {
    if (!topic.trim()) { setError("Vui long nhap chu de"); return; }
    setLoading(true); setError(""); setResult(null);
    setStep("Dang research voi Google Search...");
    try {
      const res = await fetch("/api/blog-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: config.model, topic, category, extra, systemPrompt: config.systemPrompt, temperature: config.temperature, maxTokens: config.maxTokens }),
      });
      setStep("Dang viet bai...");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Loi khong xac dinh");
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Co loi xay ra");
    } finally {
      setLoading(false); setStep("");
    }
  };

  const copyContent = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const saveToManager = () => {
    if (!result) return;
    const slug = result.title.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    addPost({
      slug, title: result.title, excerpt: result.excerpt, content: result.content,
      coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      category, tags: result.tags ?? [], author: "Ta Giang Ecolog", featured: false, seo: result.seo
    });
    alert("Da luu bai vao Blog Manager!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-forest-500 to-forest-700 rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-stone-800">Blog Agent</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-stone-500 text-sm">Gemini + Google Search</p>
              <span className="flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                <Zap className="w-3 h-3" /> Live Search
              </span>
            </div>
          </div>
        </div>
        <button onClick={() => setShowConfig(!showConfig)}
          className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
          <Settings2 className="w-4 h-4" /> Cau hinh
          {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {showConfig && (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-7 mb-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Model</label>
              <select value={config.model} onChange={(e) => setConfig({ ...config, model: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                {GEMINI_MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Google AI API Key
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer"
                  className="ml-2 text-forest-600 text-xs hover:underline inline-flex items-center gap-0.5">
                  Lay key <ExternalLink className="w-3 h-3" />
                </a>
              </label>
              <div className="relative">
                <input type={showKey ? "text" : "password"} value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 font-mono"
                  placeholder="AIza..." />
                <button type="button" onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600">
                  {showKey ? "An" : "Hien"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Temperature: <span className="text-forest-600">{config.temperature}</span></label>
              <input type="range" min="0" max="1" step="0.1" value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full accent-forest-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Max Tokens: <span className="text-forest-600">{config.maxTokens}</span></label>
              <input type="range" min="1000" max="4000" step="100" value={config.maxTokens}
                onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                className="w-full accent-forest-600" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1.5">System Prompt</label>
              <textarea rows={4} value={config.systemPrompt}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none font-mono" />
            </div>
          </div>
          <button onClick={saveConfig} className="btn-primary text-sm">
            <Save className="w-4 h-4" />{configSaved ? "Da luu!" : "Luu cau hinh"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-7 space-y-5">
          <h2 className="font-semibold text-stone-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-forest-600" /> Tao bai viet
          </h2>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Chu de / Tu khoa chinh *</label>
            <input value={topic} onChange={(e) => setTopic(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
              placeholder="VD: kinh nghiem du lich Ha Giang thang 10" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Danh muc</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
              {blogCategories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">Yeu cau them (tuy chon)</label>
            <textarea rows={3} value={extra} onChange={(e) => setExtra(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none"
              placeholder="Tone giong, doi tuong doc gia..." />
          </div>
          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">Chu de mau:</p>
            <div className="flex flex-wrap gap-2">
              {PROMPT_TEMPLATES.map((t) => (
                <button key={t.label} onClick={() => { setTopic(t.topic); setExtra(t.extra); }}
                  className="text-xs bg-stone-100 hover:bg-forest-50 hover:text-forest-700 text-stone-600 px-3 py-1.5 rounded-full transition-colors">
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}
          <button onClick={runAgent} disabled={loading || !topic.trim()}
            className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><RefreshCw className="w-4 h-4 animate-spin" />{step || "Dang xu ly..."}</>
              : <><Search className="w-4 h-4" /> Research &amp; Viet bai</>
            }
          </button>
          <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700">
            <p className="font-semibold flex items-center gap-1.5 mb-1"><Zap className="w-3.5 h-3.5" /> Gemini Google Search Grounding</p>
            <p>Model tu search Google lay thong tin thuc te truoc khi viet bai.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Ket qua
            </h2>
            {result && (
              <div className="flex gap-2">
                <button onClick={copyContent}
                  className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-forest-600 border border-stone-200 px-3 py-1.5 rounded-lg transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Da copy" : "Copy"}
                </button>
                <button onClick={saveToManager} className="btn-primary text-xs px-3 py-1.5">
                  <Save className="w-3.5 h-3.5" /> Luu vao Blog
                </button>
              </div>
            )}
          </div>
          {!result && !loading && (
            <div className="h-64 flex flex-col items-center justify-center text-stone-300">
              <Bot className="w-12 h-12 mb-3" /><p className="text-sm">Ket qua se hien thi o day</p>
            </div>
          )}
          {loading && (
            <div className="h-64 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-forest-200 border-t-forest-600 animate-spin" />
              <p className="text-sm text-stone-500 animate-pulse">{step}</p>
            </div>
          )}
          {result && (
            <div className="space-y-5 overflow-y-auto max-h-[600px] pr-1">
              {result._sources && result._sources.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> Da search Google
                  </p>
                  {result._sources.map((q, i) => <p key={i} className="text-xs text-blue-600 font-mono">"{q}"</p>)}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Tieu de</p>
                <p className="font-display text-lg font-bold text-stone-800">{result.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Mo ta ngan</p>
                <p className="text-sm text-stone-600 italic">{result.excerpt}</p>
              </div>
              <div className="bg-forest-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-forest-700 uppercase tracking-wide">SEO</p>
                <div className="text-xs space-y-1.5">
                  <p><span className="text-stone-500">Tu khoa:</span> <span className="font-medium text-stone-700">{result.seo?.focusKeyword}</span></p>
                  <p><span className="text-stone-500">Meta Title:</span> <span className="text-stone-700">{result.seo?.metaTitle}</span> <span className="text-stone-400">({result.seo?.metaTitle?.length}/60)</span></p>
                  <p><span className="text-stone-500">Meta Desc:</span> <span className="text-stone-700">{result.seo?.metaDescription}</span></p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.tags?.map((tag) => <span key={tag} className="text-xs bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">{tag}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Noi dung (Markdown)</p>
                <pre className="text-xs text-stone-600 bg-stone-50 rounded-xl p-4 whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto">{result.content}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}