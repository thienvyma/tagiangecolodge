import { create } from "zustand";
import { ROOMS as INITIAL_ROOMS, GALLERY_IMAGES as INITIAL_GALLERY, SITE as INITIAL_SITE, AMENITIES as INITIAL_AMENITIES, TESTIMONIALS as INITIAL_TESTIMONIALS } from "./data";
import { MOCK_POSTS, DEFAULT_BLOG_CATEGORIES } from "./blog";
import type { BlogPost } from "./blog";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Room = {
  id: number;
  name: string;
  type: string;
  price: number;
  capacity: number;
  size: number;
  image: string;
  amenities: string[];
  description: string;
  available: boolean;
};

export type Booking = {
  id: string;
  guest: string;
  email: string;
  phone: string;
  roomId: number;
  roomName: string;
  checkin: string;
  checkout: string;
  guests: number;
  message: string;
  total: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
};

export type SiteSettings = {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  mapUrl: string;
  facebook: string;
  instagram: string;
};

export type HeroContent = {
  badge: string;
  title: string;
  titleItalic: string;
  subtitle: string;
  bgImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export type AboutContent = {
  badge: string;
  heading: string;
  headingItalic: string;
  body1: string;
  body2: string;
  image1: string;
  image2: string;
  badgeNumber: string;
  badgeLabel: string;
  stats: { num: string; label: string }[];
};

export type AmenityItem = {
  id: string;
  icon: string;
  title: string;
  desc: string;
};

export type TestimonialItem = {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
};

export type FloatingCTAButton = {
  id: string;
  label: string;
  icon: string;
  type: "phone" | "zalo" | "facebook" | "scroll" | "link";
  value: string;
  color: string;
  enabled: boolean;
};

export type FloatingCTA = {
  enabled: boolean;
  showAfterScroll: number;
  buttons: FloatingCTAButton[];
};

export type FooterContent = {
  description: string;
  address: string;
  phone: string;
  email: string;
  socials: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
};

// ─── Store ────────────────────────────────────────────────────────────────────

export type Store = {
  initStore: () => Promise<void>;

  // Rooms
  rooms: Room[];
  addRoom: (room: Omit<Room, "id">) => void;
  updateRoom: (id: number, data: Partial<Room>) => void;
  deleteRoom: (id: number) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "status" | "total">) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  deleteBooking: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, "id">) => void;
  addBulkGalleryItems: (items: Omit<GalleryItem, "id">[]) => void;
  updateGalleryItem: (id: string, data: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGallery: (items: GalleryItem[]) => void;

  // Blog
  posts: BlogPost[];
  addPost: (post: Omit<BlogPost, "id" | "publishedAt" | "readTime">) => void;
  updatePost: (id: string, data: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  setFeaturedPost: (id: string) => void;
  blogCategories: string[];
  addBlogCategory: (name: string) => void;
  deleteBlogCategory: (name: string) => void;

  // Settings
  settings: SiteSettings;
  updateSettings: (data: Partial<SiteSettings>) => void;

  // Landing content
  hero: HeroContent;
  updateHero: (data: Partial<HeroContent>) => void;
  about: AboutContent;
  updateAbout: (data: Partial<AboutContent>) => void;
  amenities: AmenityItem[];
  addAmenity: (item: Omit<AmenityItem, "id">) => void;
  updateAmenity: (id: string, data: Partial<AmenityItem>) => void;
  deleteAmenity: (id: string) => void;
  testimonials: TestimonialItem[];
  addTestimonial: (item: Omit<TestimonialItem, "id">) => void;
  updateTestimonial: (id: string, data: Partial<TestimonialItem>) => void;
  deleteTestimonial: (id: string) => void;

  footer: FooterContent;
  updateFooter: (data: Partial<FooterContent>) => void;

  // Floating CTA
  floatingCTA: FloatingCTA;
  updateFloatingCTA: (data: Partial<FloatingCTA>) => void;
};

const initialRooms: Room[] = INITIAL_ROOMS.map((r) => ({ ...r, available: true }));
const initialGallery: GalleryItem[] = INITIAL_GALLERY.map((g, i) => ({
  id: `g${i + 1}`,
  src: g.src,
  alt: g.alt,
  category: "Tổng hợp",
}));

// ─── Save ALL relevant state to Supabase ──────────────────────────────────────
const saveToSupabase = async (state: Partial<Store>) => {
  try {
    const payload: Record<string, unknown> = {};

    // Include every piece of state that should be persisted
    if (state.rooms !== undefined) payload.rooms = state.rooms;
    if (state.bookings !== undefined) payload.bookings = state.bookings;
    if (state.gallery !== undefined) payload.gallery = state.gallery;
    if (state.posts !== undefined) payload.posts = state.posts;
    if (state.blogCategories !== undefined) payload.blogCategories = state.blogCategories;
    if (state.settings !== undefined) payload.settings = state.settings;
    if (state.hero !== undefined) payload.hero = state.hero;
    if (state.about !== undefined) payload.about = state.about;
    if (state.amenities !== undefined) payload.amenities = state.amenities;
    if (state.testimonials !== undefined) payload.testimonials = state.testimonials;
    if (state.footer !== undefined) payload.footer = state.footer;
    if (state.floatingCTA !== undefined) payload.floatingCTA = state.floatingCTA;

    await fetch('/api/site-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Failed to save state to Supabase:", error);
  }
};

export const useStore = create<Store>()(
  (set, get) => ({
    initStore: async () => {
      try {
        const res = await fetch('/api/site-data');
        if (res.ok) {
          const data = await res.json();
          // Filter out missing keys to not override with undefined
          const validData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));
          set((state) => ({ ...state, ...validData }));
        }
      } catch (e) {
        console.error("Failed to load initial site data", e);
      }
    },

    // ── Rooms ──
    rooms: initialRooms,
    addRoom: (room) => {
      set((s) => {
        const next = { rooms: [...s.rooms, { ...room, id: Date.now() }] };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    updateRoom: (id, data) => {
      set((s) => {
        const next = { rooms: s.rooms.map((r) => (r.id === id ? { ...r, ...data } : r)) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    deleteRoom: (id) => {
      set((s) => {
        const next = { rooms: s.rooms.filter((r) => r.id !== id) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Bookings ──
    bookings: [],
    addBooking: (booking) => {
      const room = get().rooms.find((r) => r.id === booking.roomId);
      if (!room) return;
      const nights =
        (new Date(booking.checkout).getTime() - new Date(booking.checkin).getTime()) / 86400000;
      const total = Math.max(1, nights) * room.price;
      set((s) => {
        const next = {
          bookings: [
            { ...booking, id: `BK${Date.now()}`, status: "pending" as const, total, createdAt: new Date().toISOString() },
            ...s.bookings,
          ],
        };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    updateBookingStatus: (id, status) => {
      set((s) => {
        const next = { bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    deleteBooking: (id) => {
      set((s) => {
        const next = { bookings: s.bookings.filter((b) => b.id !== id) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Gallery ──
    gallery: initialGallery,
    addGalleryItem: (item) => {
      set((s) => {
        const next = { gallery: [...s.gallery, { ...item, id: `g${Date.now()}` }] };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    addBulkGalleryItems: (items: Omit<GalleryItem, "id">[]) => {
      set((s) => {
        const newItems = items.map((item, i) => ({ ...item, id: `g${Date.now()}${i}` }));
        const next = { gallery: [...s.gallery, ...newItems] };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    updateGalleryItem: (id, data) => {
      set((s) => {
        const next = { gallery: s.gallery.map((g) => (g.id === id ? { ...g, ...data } : g)) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    deleteGalleryItem: (id) => {
      set((s) => {
        const next = { gallery: s.gallery.filter((g) => g.id !== id) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    reorderGallery: (items) => {
      set((s) => {
        const next = { gallery: items };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Blog ──
    posts: MOCK_POSTS,
    addPost: (post) => {
      const words = post.content.split(" ").length;
      set((s) => {
        const next = {
          posts: [
            {
              ...post,
              id: Date.now().toString(),
              publishedAt: new Date().toISOString().split("T")[0],
              readTime: Math.max(1, Math.ceil(words / 200)),
            },
            ...s.posts,
          ],
        };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    updatePost: (id, data) => {
      set((s) => {
        const next = { posts: s.posts.map((p) => (p.id === id ? { ...p, ...data } : p)) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    deletePost: (id) => {
      set((s) => {
        const next = { posts: s.posts.filter((p) => p.id !== id) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    setFeaturedPost: (id) => {
      set((s) => {
        const next = { posts: s.posts.map((p) => ({ ...p, featured: p.id === id })) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    blogCategories: DEFAULT_BLOG_CATEGORIES,
    addBlogCategory: (name) => {
      set((s) => {
        const next = { blogCategories: s.blogCategories.includes(name) ? s.blogCategories : [...s.blogCategories, name] };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    deleteBlogCategory: (name) => {
      set((s) => {
        const next = { blogCategories: s.blogCategories.filter((c) => c !== name) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Settings ──
    settings: { ...INITIAL_SITE },
    updateSettings: (data) => {
      set((s) => {
        const next = { settings: { ...s.settings, ...data } };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Hero ──
    hero: {
      badge: "Homestay Sinh Thái · Hà Giang",
      title: "Tà Giang",
      titleItalic: "Ecolog",
      subtitle: "Sống chậm giữa cao nguyên đá. Thở sâu trong không khí trong lành. Kết nối với thiên nhiên hoang sơ và văn hóa bản địa.",
      bgImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85",
      ctaPrimary: "Xem phòng nghỉ",
      ctaSecondary: "Khám phá thêm",
    },
    updateHero: (data) => {
      set((s) => {
        const next = { hero: { ...s.hero, ...data } };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── About ──
    about: {
      badge: "Về chúng tôi",
      heading: "Nơi thiên nhiên",
      headingItalic: "chào đón bạn",
      body1: "Tà Giang Ecolog được xây dựng với triết lý tôn trọng thiên nhiên và bảo tồn văn hóa bản địa. Mỗi góc nhỏ của homestay đều được thiết kế từ vật liệu địa phương – đá, tre, gỗ – hòa quyện với cảnh quan cao nguyên đá hùng vĩ.",
      body2: "Chúng tôi không chỉ cung cấp chỗ nghỉ, mà còn mang đến những trải nghiệm sống thực sự: cùng người dân bản địa làm nương, nấu ăn, và nghe những câu chuyện về mảnh đất Hà Giang.",
      image1: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=80",
      image2: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80",
      badgeNumber: "5+",
      badgeLabel: "Năm kinh nghiệm",
      stats: [
        { num: "500+", label: "Lượt khách" },
        { num: "3", label: "Loại phòng" },
        { num: "4.9★", label: "Đánh giá" },
      ],
    },
    updateAbout: (data) => {
      set((s) => {
        const next = { about: { ...s.about, ...data } };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Amenities ──
    amenities: INITIAL_AMENITIES.map((a, i) => ({ ...a, id: `am${i + 1}` })),
    addAmenity: (item) => {
      set((s) => {
        const next = { amenities: [...s.amenities, { ...item, id: `am${Date.now()}` }] };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    updateAmenity: (id, data) => {
      set((s) => {
        const next = { amenities: s.amenities.map((a) => (a.id === id ? { ...a, ...data } : a)) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    deleteAmenity: (id) => {
      set((s) => {
        const next = { amenities: s.amenities.filter((a) => a.id !== id) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Testimonials ──
    testimonials: INITIAL_TESTIMONIALS.map((t, i) => ({ ...t, id: `tm${i + 1}` })),
    addTestimonial: (item) => {
      set((s) => {
        const next = { testimonials: [...s.testimonials, { ...item, id: `tm${Date.now()}` }] };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    updateTestimonial: (id, data) => {
      set((s) => {
        const next = { testimonials: s.testimonials.map((t) => (t.id === id ? { ...t, ...data } : t)) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
    deleteTestimonial: (id) => {
      set((s) => {
        const next = { testimonials: s.testimonials.filter((t) => t.id !== id) };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Footer ──
    footer: INITIAL_SITE.footer || {
      description: "Trải nghiệm thiên nhiên hoang sơ",
      address: "Tà Giang, Hà Giang",
      phone: "+84 123 456 789",
      email: "hello@tagiang.com",
      socials: { facebook: "", instagram: "" }
    },
    updateFooter: (data) => {
      set((s) => {
        const next = { footer: { ...s.footer, ...data } };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },

    // ── Floating CTA ──
    floatingCTA: {
      enabled: true,
      showAfterScroll: 400,
      buttons: [
        { id: "phone", label: "Gọi ngay", icon: "📞", type: "phone", value: "+84 xxx xxx xxx", color: "bg-emerald-500", enabled: true },
        { id: "zalo", label: "Zalo", icon: "💬", type: "zalo", value: "https://zalo.me/0xxxxxxxxx", color: "bg-blue-500", enabled: true },
        { id: "facebook", label: "FaceBook ", icon: "📘", type: "facebook", value: "https://facebook.com", color: "bg-blue-600", enabled: true },
        { id: "booking", label: "Đặt phòng", icon: "🏡", type: "scroll", value: "contact", color: "bg-forest-600", enabled: true },
      ],
    },
    updateFloatingCTA: (data) => {
      set((s) => {
        const next = { floatingCTA: { ...s.floatingCTA, ...data } };
        saveToSupabase({ ...s, ...next });
        return next;
      });
    },
  })
);
