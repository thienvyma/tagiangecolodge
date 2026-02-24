'use client';
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Rooms from "@/components/landing/Rooms";
import Amenities from "@/components/landing/Amenities";
import Gallery from "@/components/landing/Gallery";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";
import FloatingCTA from "@/components/landing/FloatingCTA";
import ScrollToTop from "@/components/landing/ScrollToTop";
import { StoreGate } from "@/components/StoreInitializer";

export default function LandingPage() {
  return (
    <StoreGate>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Amenities />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
      <ScrollToTop />
    </StoreGate>
  );
}
