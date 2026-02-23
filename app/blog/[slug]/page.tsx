"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useStore } from "@/lib/store";

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const posts = useStore((s) => s.posts);
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  const related = posts.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-cream">
        <div className="relative h-80 lg:h-[480px]">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 section-padding max-w-4xl mx-auto pb-10">
            <span className="text-forest-300 text-xs font-semibold uppercase tracking-widest">{post.category}</span>
            <h1 className="font-display text-3xl lg:text-5xl font-bold text-white mt-2 leading-tight">{post.title}</h1>
            <div className="flex items-center gap-4 text-stone-300 text-sm mt-4">
              <span>{post.author}</span>
              <span>·</span>
              <span>{new Date(post.publishedAt).toLocaleDateString("vi-VN")}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime} phút đọc</span>
            </div>
          </div>
        </div>

        <div className="section-padding max-w-7xl mx-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <article className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-stone-100">
                <p className="text-lg text-stone-600 leading-relaxed border-l-4 border-forest-400 pl-5 mb-8 italic">{post.excerpt}</p>
                <div className="space-y-4">
                  {post.content.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) return <h1 key={i} className="font-display text-3xl font-bold text-stone-800 mt-8 mb-4">{line.slice(2)}</h1>;
                    if (line.startsWith("## ")) return <h2 key={i} className="font-display text-2xl font-bold text-stone-800 mt-6 mb-3">{line.slice(3)}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="font-semibold text-xl text-stone-800 mt-4 mb-2">{line.slice(4)}</h3>;
                    if (line.trim() === "") return <br key={i} />;
                    return <p key={i} className="text-stone-600 leading-relaxed">{line}</p>;
                  })}
                </div>
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-stone-100">
                  <Tag className="w-4 h-4 text-stone-400 mt-0.5" />
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-forest-50 text-forest-700 px-3 py-1.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="mt-10 bg-forest-50 rounded-2xl p-7 text-center">
                  <h3 className="font-display text-xl font-bold text-forest-800 mb-2">Sẵn sàng trải nghiệm Hà Giang?</h3>
                  <p className="text-stone-600 text-sm mb-5">
                    Đặt phòng tại <Link href="/#rooms" className="text-forest-600 font-medium hover:underline">Tà Giang Ecolog</Link> để có chuyến đi trọn vẹn nhất.
                  </p>
                  <Link href="/#contact" className="btn-primary">Đặt phòng ngay <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-2 text-stone-500 hover:text-forest-600 transition-colors mt-6 text-sm">
                <ArrowLeft className="w-4 h-4" /> Quay lại Blog
              </Link>
            </article>

            <aside className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-semibold text-stone-800 mb-4">Bài viết liên quan</h3>
                <div className="space-y-4">
                  {related.map((r) => (
                    <Link key={r.id} href={`/blog/${r.slug}`} className="group flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <Image src={r.coverImage} alt={r.title} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-800 group-hover:text-forest-600 transition-colors line-clamp-2 leading-snug">{r.title}</p>
                        <p className="text-xs text-stone-400 mt-1">{r.readTime} phút đọc</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="bg-forest-700 rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-lg mb-2">Xem phòng nghỉ</h3>
                <p className="text-forest-200 text-sm mb-4">3 loại phòng độc đáo, view núi tuyệt đẹp.</p>
                <Link href="/#rooms" className="text-sm font-medium text-forest-300 hover:text-white flex items-center gap-1 transition-colors">
                  Khám phá ngay <ArrowRight className="w-3.5 h-3.5" />
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
