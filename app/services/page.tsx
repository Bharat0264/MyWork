import { Footer, Navbar } from "@/components/site-shell";
import { ServicesGlassShowcase } from "@/components/services-glass-showcase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Garuda Web Designer and Developer",
  description: "Every service is designed to solve a specific business problem—not just add another layer of digital polish.",
};

export default function Services() {
  return (
    <>
      <Navbar />
      <main>
        <ServicesGlassShowcase />
      </main>
      <Footer />
    </>
  );
}
