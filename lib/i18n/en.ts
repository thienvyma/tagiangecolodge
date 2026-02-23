import type { Translations } from "./vi";

const en: Translations = {
    lang: "en" as const,

    nav: {
        home: "Home",
        about: "About Us",
        rooms: "Rooms",
        amenities: "Amenities",
        gallery: "Gallery",
        contact: "Contact",
        blog: "Blog",
        bookNow: "Book Now",
    },

    hero: {
        badge: "Eco Homestay · Ta Giang",
        cta1: "View Rooms",
        cta2: "Explore More",
    },

    about: {
        badge: "About Us",
        statsLabels: {
            guests: "Guests",
            rooms: "Room Types",
            rating: "Rating",
        },
        yearsLabel: "Years of Experience",
    },

    rooms: {
        sectionBadge: "Accommodations",
        sectionTitle: "Our",
        sectionTitleItalic: "Rooms",
        capacity: "Capacity",
        size: "Size",
        guests: "guests",
        sqm: "m²",
        amenitiesLabel: "Room Amenities",
        bookButton: "Book",
        perNight: "/night",
        available: "Available",
        unavailable: "Unavailable",
        noRooms: "No rooms available.",
    },

    amenities: {
        sectionBadge: "Experience",
        sectionTitle: "Featured",
        sectionTitleItalic: "Amenities",
    },

    gallery: {
        sectionBadge: "Photos",
        sectionTitle: "Photo",
        sectionTitleItalic: "Gallery",
        all: "All",
        noImages: "No images yet.",
    },

    testimonials: {
        sectionBadge: "Reviews",
        sectionTitle: "What Our",
        sectionTitleItalic: "Guests Say",
    },

    contact: {
        sectionBadge: "Contact",
        sectionTitle: "Book Your",
        sectionTitleItalic: "Stay Today",
        subtitle: "Contact us for advice and reservations. We will respond within 2 hours.",
        address: "Address",
        phone: "Phone",
        email: "Email",
        form: {
            name: "Full Name",
            namePlaceholder: "John Doe",
            phone: "Phone Number",
            phonePlaceholder: "+84 xxx xxx xxx",
            email: "Email",
            emailPlaceholder: "email@example.com",
            room: "Select Room",
            roomDefault: "-- Select a room --",
            checkin: "Check-in Date",
            checkout: "Check-out Date",
            guests: "Number of Guests",
            guestUnit: "guests",
            note: "Notes",
            notePlaceholder: "Special requests...",
            submit: "Send Booking Request",
            submitting: "Sending...",
        },
        success: {
            title: "Thank you!",
            message: "We have received your request and will get in touch soon.",
            again: "Book Another Room",
        },
        errors: {
            selectDates: "Please select check-in and check-out dates",
            checkoutAfterCheckin: "Check-out must be after check-in",
            selectRoom: "Please select a room",
            serverError: "Booking failed. Please try again.",
            networkError: "Cannot connect to server. Please try again.",
        },
    },

    footer: {
        copyright: "Tà Giang Ecolodge. All rights reserved.",
        tagline: "Slow living in nature · Ha Giang, Vietnam",
        links: {
            rooms: "Rooms",
            amenities: "Amenities",
            gallery: "Gallery",
            blog: "Blog",
            contact: "Contact & Booking",
        },
        social: "Connect with us",
        adminLink: "Admin",
    },

    floatingCta: {
        call: "Call Now",
        zalo: "Zalo",
        facebook: "Facebook",
        book: "Book Now",
    },

    blog: {
        readMore: "Read More",
        readTime: "min read",
        backToBlog: "Back to Blog",
        featuredPost: "Featured Post",
        latestPosts: "Latest Posts",
        noPosts: "No posts yet.",
        allCategories: "All",
        share: "Share",
        publishedOn: "Published on",
    },
};

export default en;
