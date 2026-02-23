const vi = {
    lang: "vi" as const,

    nav: {
        home: "Trang chủ",
        about: "Về chúng tôi",
        rooms: "Phòng nghỉ",
        amenities: "Tiện ích",
        gallery: "Thư viện ảnh",
        contact: "Liên hệ",
        blog: "Blog",
        bookNow: "Đặt phòng ngay",
    },

    hero: {
        badge: "Homestay Sinh Thái · Tà Giang",
        cta1: "Xem phòng nghỉ",
        cta2: "Khám phá thêm",
    },

    about: {
        badge: "Về chúng tôi",
        statsLabels: {
            guests: "Lượt khách",
            rooms: "Loại phòng",
            rating: "Đánh giá",
        },
        yearsLabel: "Năm kinh nghiệm",
    },

    rooms: {
        sectionBadge: "Nơi nghỉ ngơi",
        sectionTitle: "Phòng nghỉ",
        sectionTitleItalic: "của chúng tôi",
        capacity: "Sức chứa",
        size: "Diện tích",
        guests: "khách",
        sqm: "m²",
        amenitiesLabel: "Tiện nghi phòng",
        bookButton: "Đặt phòng",
        perNight: "/đêm",
        available: "Còn phòng",
        unavailable: "Hết phòng",
        noRooms: "Chưa có phòng nào.",
    },

    amenities: {
        sectionBadge: "Trải nghiệm",
        sectionTitle: "Tiện ích",
        sectionTitleItalic: "nổi bật",
    },

    gallery: {
        sectionBadge: "Hình ảnh",
        sectionTitle: "Thư viện",
        sectionTitleItalic: "ảnh",
        all: "Tất cả",
        noImages: "Chưa có ảnh nào.",
    },

    testimonials: {
        sectionBadge: "Đánh giá",
        sectionTitle: "Khách hàng",
        sectionTitleItalic: "nói gì?",
    },

    contact: {
        sectionBadge: "Liên hệ",
        sectionTitle: "Đặt phòng",
        sectionTitleItalic: "ngay hôm nay",
        subtitle: "Liên hệ với chúng tôi để được tư vấn và Đặt phòng. Chúng tôi sẽ phản hồi trong vòng 2 giờ.",
        address: "Địa chỉ",
        phone: "Điện thoại",
        email: "Email",
        form: {
            name: "Họ tên",
            namePlaceholder: "Nguyễn Văn A",
            phone: "Số điện thoại",
            phonePlaceholder: "0xxx xxx xxx",
            email: "Email",
            emailPlaceholder: "email@example.com",
            room: "Chọn phòng",
            roomDefault: "-- Chọn phòng --",
            checkin: "Ngày nhận phòng",
            checkout: "Ngày trả phòng",
            guests: "Số khách",
            guestUnit: "khách",
            note: "Ghi chú",
            notePlaceholder: "Yêu cầu đặc biệt...",
            submit: "Gửi yêu cầu Đặt phòng",
            submitting: "Đang gửi...",
        },
        success: {
            title: "Cảm ơn bạn!",
            message: "Chúng tôi đã nhận được yêu cầu và sẽ liên hệ sớm nhất.",
            again: "Đặt phòng khác",
        },
        errors: {
            selectDates: "Vui lòng chọn ngày nhận và trả phòng",
            checkoutAfterCheckin: "Ngày trả phòng phải sau ngày nhận phòng",
            selectRoom: "Vui lòng chọn phòng",
            serverError: "Gửi yêu cầu thất bại. Vui lòng thử lại.",
            networkError: "Không thể kết nối máy chủ. Vui lòng thử lại.",
        },
    },

    footer: {
        copyright: "Tà Giang Ecolodge. Bảo lưu mọi quyền.",
        tagline: "Sống chậm giữa thiên nhiên · Hà Giang, Việt Nam",
        links: {
            rooms: "Phòng nghỉ",
            amenities: "Tiện ích",
            gallery: "Thư viện ảnh",
            blog: "Blog",
            contact: "Liên hệ & Đặt phòng",
        },
        social: "Kết nối với chúng tôi",
        adminLink: "Admin",
    },

    floatingCta: {
        call: "Gọi ngay",
        zalo: "Zalo",
        facebook: "Facebook",
        book: "Đặt phòng",
    },

    blog: {
        readMore: "Đọc tiếp",
        readTime: "phút đọc",
        backToBlog: "Quay lại Blog",
        featuredPost: "Bài nổi bật",
        latestPosts: "Bài viết mới nhất",
        noPosts: "Chưa có bài viết nào.",
        allCategories: "Tất cả",
        share: "Chia sẻ",
        publishedOn: "Đăng ngày",
    },
};

export type Translations = Omit<typeof vi, "lang"> & { lang: string };
export default vi;
