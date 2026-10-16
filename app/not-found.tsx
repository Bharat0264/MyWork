import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Navbar, Footer } from "@/components/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found · Garuda Web Design & Development Studio",
  description: "The page you are looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="content"
        className="wrap flex flex-col items-center justify-center text-center page-transition"
      >
        <div className="relative mx-auto my-auto max-w-[640px] rounded-[28px] border border-[rgba(143,176,214,0.18)] bg-gradient-to-br from-[#1B2B45]/90 via-[#141E30]/80 to-[#0B1322]/90 p-8 sm:p-12 shadow-[0_20px_50px_rgba(4,9,18,0.5)]">
          <p className="eyebrow text-[#8FB0D6]">404 Error</p>
          <h1 className="hero-heading mt-4 text-white text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
            Page not found.
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#9FB3CC]">
            The page you are looking for doesn’t exist, has been moved, or the link may be outdated.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="button inline-flex items-center gap-2"
            >
              <Home size={16} />
              <span>Back to Home</span>
            </Link>
            <Link
              href="/work"
              className="button-secondary inline-flex items-center gap-2"
            >
              <span>Explore Work</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
