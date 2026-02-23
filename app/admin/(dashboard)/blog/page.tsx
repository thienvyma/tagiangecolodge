"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, Bot, Clock, Tag, X, FolderPlus, RefreshCw } from "lucide-react";
import type { BlogPost } from "@/lib/blog";
import { useStore } from "@/lib/store";
import ImageUploader from "@/components/admin/ImageUploader";
import { getSupabase } from "@/lib/supabase";

export default function BlogManager() {
  const { blogCategories, addBlogCategory, deleteBlogCategory } = useStore();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [showCatManager, setShowCatManager] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");
  const [form, setForm] = useState({
    title: "", excerpt: "", content: "", category: blogCategories[0] ?? "",
    tags: "", coverImage: "", seoTitle: "", seoDesc: "", focusKeyword: "", featured: false,
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("published_at", { ascending: false });

        if (error) throw error;

        const mappedPosts: BlogPost[] = (data || []).map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          content: p.content,
          coverImage: p.cover_image,
          category: p.category,
          tags: p.tags || [],
          author: p.author,
          publishedAt: p.published_at,
          readTime: p.read_time,
          featured: p.featured,
          seo: {
            metaTitle: p.seo_meta_title,
            metaDescription: p.seo_meta_description,
            focusKeyword: p.seo_focus_keyword,
          },
        }));
        setPosts(mappedPosts);
      } catch (err) {
        console.error("Lỗi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [refreshKey]);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", excerpt: "", content: "", category: blogCategories[0] ?? "", tags: "", coverImage: "", seoTitle: "", seoDesc: "", focusKeyword: "", featured: false });
    setImgTab("upload");
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({
      title: post.title, excerpt: post.excerpt, content: post.content,
      category: post.category, tags: post.tags.join(", "),
      coverImage: post.coverImage, seoTitle: post.seo?.metaTitle || "",
      seoDesc: post.seo?.metaDescription || "", focusKeyword: post.seo?.focusKeyword || "",
      featured: post.featured ?? false,
    });
    setImgTab(post.coverImage.startsWith("data:") ? "upload" : "url");
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const slug = form.title.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "")
        .trim().replace(/\s+/g, "-");

      const postData = {
        slug: editing?.slug ?? slug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        cover_image: form.coverImage || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        category: form.category,
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        author: "Tà Giang Ecolog",
        featured: form.featured,
        seo_meta_title: form.seoTitle || form.title,
        seo_meta_description: form.seoDesc || form.excerpt,
        seo_focus_keyword: form.focusKeyword,
      };

      const supabase = getSupabase();

      if (editing) {
        // Update
        const { error } = await supabase.from("posts").update(postData).eq("id", editing.id);
        if (error) throw error;
      } else {
        // Insert
        // Đảm bảo chỉ có 1 bài featured nếu bài này là featured
        if (form.featured) {
          await supabase.from("posts").update({ featured: false }).eq("featured", true);
        }
        const { error } = await supabase.from("posts").insert([postData]);
        if (error) throw error;
      }

      setShowForm(false);
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error("Lỗi lưu bài viết:", err);
      alert("Lưu thất bại! (Có thể do trùng slug)");
    }
  };

  const deletePostDb = async (id: string) => {
    if (!confirm("Xóa bài viết này vĩnh viễn?")) return;
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Xóa thất bại!");
    }
  };

  const setFeaturedPostDb = async (id: string, currentlyFeatured: boolean) => {
    try {
      const supabase = getSupabase();
      if (!currentlyFeatured) {
        // Unfeature all others first
        await supabase.from("posts").update({ featured: false }).eq("featured", true);
      }
      // Toggle this one
      const { error } = await supabase.from("posts").update({ featured: !currentlyFeatured }).eq("id", id);
      if (error) throw error;
      setRefreshKey(k => k + 1);
    } catch (err) {
      console.error("Lỗi set featured:", err);
    }
  };

  const handleAddCat = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    addBlogCategory(trimmed);
    setNewCat("");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Blog Manager</h1>
          <p className="text-stone-500 mt-1">{posts.length} bài viết · hiển thị trực tiếp trên /blog</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setRefreshKey(k => k + 1)} className="btn-outline text-sm">
            <RefreshCw className={loading ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
          </button>
          <button onClick={() => setShowCatManager(true)} className="btn-outline text-sm">
            <FolderPlus className="w-4 h-4" /> Danh mục
          </button>
          <Link href="/admin/blog/agent" className="btn-outline text-sm">
            <Bot className="w-4 h-4" /> Blog Agent
          </Link>
          <button onClick={openNew} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Viết bài mới
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        {loading && posts.length === 0 ? (
          <div className="p-16 text-center text-stone-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-300" />
            Đang tải...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Bài viết</th>
                  <th className="px-6 py-3 text-left">Danh mục</th>
                  <th className="px-6 py-3 text-center">Nổi bật</th>
                  <th className="px-6 py-3 text-left">Từ khóa SEO</th>
                  <th className="px-6 py-3 text-center">Đọc</th>
                  <th className="px-6 py-3 text-left">Ngày đăng</th>
                  <th className="px-6 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover" unoptimized={post.coverImage.startsWith("data:")} />
                        </div>
                        <div>
                          <p className="font-medium text-stone-800 line-clamp-1">{post.title}</p>
                          <p className="text-xs text-stone-400 mt-0.5 line-clamp-1">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setFeaturedPostDb(post.id, !!post.featured)}
                        title={post.featured ? "Đang nổi bật" : "Đặt làm nổi bật"}
                        className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto transition-colors ${post.featured ? "bg-amber-100 text-amber-500" : "bg-stone-100 text-stone-300 hover:text-amber-400"}`}>
                        ★
                      </button>
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-xs">
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{post.seo?.focusKeyword}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-stone-400 text-xs">
                      <span className="flex items-center justify-center gap-1"><Clock className="w-3 h-3" />{post.readTime}p</span>
                    </td>
                    <td className="px-6 py-4 text-stone-500 text-xs">{new Date(post.publishedAt).toLocaleDateString("vi-VN")}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <a href={`/blog/${post.slug}`} target="_blank"
                          className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" aria-label="Xem">
                          <Eye className="w-4 h-4" />
                        </a>
                        <button onClick={() => openEdit(post)}
                          className="p-2 text-stone-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors" aria-label="Sửa">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePostDb(post.id)}
                          className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Manager Modal */}
      {showCatManager && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          {/* ... */}
          {/* Giữ nguyên phần render danh mục */}
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="font-semibold text-stone-800">Quản lý danh mục</h2>
              <button onClick={() => setShowCatManager(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <input value={newCat} onChange={(e) => setNewCat(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCat()}
                  className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder="Tên danh mục mới..." />
                <button onClick={handleAddCat} className="btn-primary text-sm px-4">Thêm</button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {blogCategories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between px-3 py-2.5 bg-stone-50 rounded-lg">
                    <span className="text-sm text-stone-700">{cat}</span>
                    <button onClick={() => deleteBlogCategory(cat)}
                      className="text-stone-300 hover:text-red-500 transition-colors" aria-label="Xóa danh mục">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto w-full">
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-8 py-5 border-b border-stone-100">
              <h2 className="font-display text-xl font-bold text-stone-800">
                {editing ? "Chỉnh sửa bài viết" : "Viết bài mới"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Tiêu đề *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder="Tiêu đề bài viết..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Danh mục</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                    {blogCategories.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Tags (cách nhau bởi dấu phẩy)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder="hà giang, du lịch, homestay" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer select-none w-fit">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  <div className={`w-10 h-6 rounded-full transition-colors ${form.featured ? "bg-amber-400" : "bg-stone-200"}`} />
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-4" : "translate-x-0"}`} />
                </div>
                <span className="text-sm font-medium text-stone-700">Đặt làm bài nổi bật</span>
                <span className="text-xs text-stone-400">(hiển thị đầu trang /blog)</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Mô tả ngắn</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none"
                  placeholder="Tóm tắt bài viết..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Nội dung (Markdown)</label>
                <textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none font-mono"
                  placeholder="# Tiêu đề&#10;&#10;Nội dung bài viết..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Ảnh bìa</label>
                <ImageUploader
                  value={form.coverImage}
                  onImageChange={(src) => setForm({ ...form, coverImage: src })}
                  tab={imgTab}
                  onTabChange={setImgTab}
                  height="h-44"
                />
              </div>
              <div className="border-t border-stone-100 pt-5">
                <p className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-forest-600" /> Tối ưu SEO
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Từ khóa trọng tâm</label>
                    <input value={form.focusKeyword} onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                      placeholder="du lịch hà giang tự túc" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Meta Title</label>
                    <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                      placeholder="Tiêu đề SEO (50-60 ký tự)" />
                    <p className="text-xs text-stone-400 mt-1">{form.seoTitle.length}/60 ký tự</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">Meta Description</label>
                    <textarea rows={2} value={form.seoDesc} onChange={(e) => setForm({ ...form, seoDesc: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none"
                      placeholder="Mô tả SEO (150-160 ký tự)" />
                    <p className="text-xs text-stone-400 mt-1">{form.seoDesc.length}/160 ký tự</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-8 py-5 border-t border-stone-100">
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                {editing ? "Lưu thay đổi" : "Đăng bài"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
