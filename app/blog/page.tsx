"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Tag, ArrowRight, RefreshCw } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useStore } from "@/lib/store";
import type { BlogPost } from "@/lib/blog";
import { getSupabase } from "@/lib/supabase";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const blogCategories = useStore((s) => s.blogCategories);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("published_at", { ascending: false });

        if (error) throw error;

        // Map snake_case to camelCase
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
        console.error("Lỗi tải blog:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

  if (loading) return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-cream flex flex-col items-center justify-center">
        <RefreshCw className="w-10 h-10 text-forest-300 animate-spin mb-4" />
        <p className="text-stone-400">Đang tải bài viết...</p>
      </main>
      <Footer />
    </>
  );

  if (!featured) return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-cream flex flex-col items-center justify-center">
        <p className="text-stone-400">Chưa có bài viết nào.</p>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-cream">
        <div className="bg-forest-700 text-white py-16 section-padding">
          <div className="max-w-7xl mx-auto">
            <span className="text-forest-300 text-sm font-semibold tracking-widest uppercase">Blog</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold mt-3 mb-4">Câu chuyện Tà Giang</h1>
            <p className="text-forest-200 max-w-xl">Kinh nghiệm du lịch, ẩm thực, văn hóa và những góc nhìn từ trái tim cao nguyên đá Hà Giang.</p>
          </div>
        </div>

        <div className="section-padding max-w-7xl mx-auto py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3 space-y-10">
              {/* Featured */}
              <Link href={`/blog/${featured.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-72">
                    <Image src={featured.coverImage} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 bg-forest-600 text-white text-xs font-medium px-3 py-1 rounded-full">Nổi bật</span>
                  </div>
                  <div className="p-7">
                    <span className="text-forest-600 text-xs font-semibold uppercase tracking-wide">{featured.category}</span>
                    <h2 className="font-display text-2xl font-bold text-stone-800 mt-2 mb-3 group-hover:text-forest-700 transition-colors">{featured.title}</h2>
                    <p className="text-stone-500 leading-relaxed mb-5">{featured.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-stone-400 text-sm">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {featured.readTime} phút đọc</span>
                        <span>{new Date(featured.publishedAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <span className="text-forest-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Đọc tiếp <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                      <div className="relative h-48">
                        <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-forest-600 text-xs font-semibold uppercase tracking-wide">{post.category}</span>
                        <h3 className="font-display text-lg font-bold text-stone-800 mt-2 mb-2 group-hover:text-forest-700 transition-colors line-clamp-2">{post.title}</h3>
                        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-1">{post.excerpt}</p>
                        <div className="flex items-center gap-3 text-stone-400 text-xs mt-4 pt-4 border-t border-stone-100">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime} phút</span>
                          <span>{new Date(post.publishedAt).toLocaleDateString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-semibold text-stone-800 mb-4">Danh mục</h3>
                <ul className="space-y-2">
                  {blogCategories.map((cat) => (
                    <li key={cat}>
                      <span className="flex items-center justify-between text-sm text-stone-600 py-1.5">
                        <span>{cat}</span>
                        <span className="text-xs text-stone-400">{posts.filter(p => p.category === cat).length}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2"><Tag className="w-4 h-4" /> Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 15).map((tag) => (
                    <span key={tag} className="text-xs bg-forest-50 text-forest-700 px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="bg-forest-700 rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-lg mb-2">Đặt phòng ngay</h3>
                <p className="text-forest-200 text-sm mb-4">Trải nghiệm Hà Giang tại Tà Giang Ecolog.</p>
                <Link href="/#contact" className="inline-flex items-center gap-2 bg-white text-forest-700 hover:bg-forest-50 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors w-full justify-center">
                  Liên hệ ngay
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
