"use client";
import Image from "next/image"; import Link from "next/link"; import { ArrowUpRight, Menu, X, Mail, Phone, MapPin, ArrowUp } from "lucide-react"; import { motion } from "framer-motion"; import { useState } from "react"; import { siteConfig } from "@/config/site";
const links = [["Work","/work"],["Services","/services"],["About","/about"],["Contact","/contact"]] as const;
export function Navbar(){const [open,setOpen]=useState(false);return <motion.header initial={{y:-30,opacity:0}} animate={{y:0,opacity:1}} className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050505cc] backdrop-blur-md"><nav className="wrap flex h-24 items-center justify-between"><Link href="/" aria-label="Garuda Web Designer and Developer" className="navbar-logo flex items-center shrink-0"><picture className="hidden sm:block"><source srcSet="/logo-full.webp" type="image/webp" /><img src="/logo-full.png" srcSet="/logo-full.png 1x, /logo-full.png 2x" alt="Garuda Web Designer and Developer" width={191} height={64} loading="eager" draggable={false} className="h-[52px] w-auto max-w-[280px] object-contain min-[900px]:h-[64px]" /></picture><picture className="block sm:hidden"><img src="/logo-eagle.png" srcSet="/logo-eagle.png 1x, /logo-eagle.png 2x" alt="Garuda Web Designer and Developer" width={44} height={44} loading="eager" draggable={false} className="h-[44px] w-auto object-contain" /></picture><span className="sr-only">Garuda Web Designer and Developer</span></Link><div className="hidden items-center gap-7 md:flex">{links.map(([label,href])=><Link className="nav-link" href={href} key={href}>{label}</Link>)}<Link href="/contact" className="button button-small">Start a project <ArrowUpRight size={15}/></Link></div><button aria-label="Toggle menu" className="md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></nav>{open&&<div className="wrap flex flex-col gap-5 border-t border-white/10 py-7 md:hidden">{links.map(([label,href])=><Link onClick={()=>setOpen(false)} className="text-2xl font-semibold" href={href} key={href}>{label}</Link>)}<Link onClick={()=>setOpen(false)} href="/contact" className="button w-fit">Start a project</Link></div>}</motion.header>}
const quickLinks = [
  ["Work", "/work"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

const serviceLinks = [
  ["Website Design", "/services"],
  ["Website Development", "/services"],
  ["Redesign", "/services"],
  ["Landing Pages", "/services"],
  ["UI/UX Design", "/services"],
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#05070B] bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(16,40,85,0.35)_0%,transparent_70%)] pt-14 pb-10 sm:pt-16 sm:pb-12"
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14 xl:px-16">
        {/* 4 LOGICAL COLUMNS */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.85fr_1fr_1.35fr] lg:gap-8 xl:gap-12">
          {/* Column 1: Brand */}
          <div className="flex flex-col items-start">
            <Link href="/" aria-label="Garuda Web Designer and Developer" className="footer-logo shrink-0">
              <picture>
                <source srcSet="/logo-full.webp" type="image/webp" />
                <img
                  src="/logo-full.png"
                  srcSet="/logo-full.png 1x, /logo-full.png 2x"
                  alt="Garuda Web Designer and Developer"
                  width={240}
                  height={80}
                  loading="lazy"
                  draggable={false}
                  className="footer-logo-img"
                />
              </picture>
            </Link>
            <p className="mt-5 max-w-[340px] text-[14.5px] leading-relaxed text-[#A6AFBE]">
              We design and develop modern, high-performance websites that help businesses grow in the digital world.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-4 rounded-full border border-[#168BFF]/75 bg-[#080e1c] pl-6 pr-2 py-2 text-[15px] font-medium text-[#F5F7FA] transition-all duration-300 hover:border-[#168BFF] hover:bg-[#0c162e] hover:shadow-[0_0_16px_rgba(22,139,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
            >
              <span>Start a project</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#168BFF] text-white transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </Link>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-[17px] font-semibold text-[#F5F7FA]">Quick Links</h3>
            <div className="mt-2.5 mb-5 h-[2px] w-7 rounded-full bg-[#168BFF]" aria-hidden="true" />
            <nav aria-label="Footer Quick Links" className="flex flex-col gap-3.5">
              {quickLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="w-fit rounded-sm text-[15px] text-[#A6AFBE] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#168BFF]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Our Services */}
          <div>
            <h3 className="text-[17px] font-semibold text-[#F5F7FA]">Our Services</h3>
            <div className="mt-2.5 mb-5 h-[2px] w-7 rounded-full bg-[#168BFF]" aria-hidden="true" />
            <nav aria-label="Footer Our Services" className="flex flex-col gap-3.5">
              {serviceLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="w-fit rounded-sm text-[15px] text-[#A6AFBE] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#168BFF]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Get in Touch */}
          <div className="lg:border-l lg:border-white/[0.08] lg:pl-8 xl:pl-10">
            <h3 className="text-[17px] font-semibold text-[#F5F7FA]">Get in Touch</h3>
            <div className="mt-2.5 mb-5 h-[2px] w-7 rounded-full bg-[#168BFF]" aria-hidden="true" />
            <div className="flex flex-col gap-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex items-center gap-3.5 text-[15px] text-[#F5F7FA] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] rounded-lg"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#168BFF]/25 bg-[#091326] text-[#168BFF] transition-colors duration-200 group-hover:border-[#168BFF]/60 group-hover:bg-[#0c1a36]">
                  <Mail size={18} strokeWidth={2} />
                </span>
                <span className="break-all">{siteConfig.email}</span>
              </a>

              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="group flex items-center gap-3.5 text-[15px] text-[#F5F7FA] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] rounded-lg"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#168BFF]/25 bg-[#091326] text-[#168BFF] transition-colors duration-200 group-hover:border-[#168BFF]/60 group-hover:bg-[#0c1a36]">
                  <Phone size={18} strokeWidth={2} />
                </span>
                <span>{siteConfig.phone}</span>
              </a>

              <div className="flex items-center gap-3.5">
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#168BFF]/25 bg-[#091326] text-[#168BFF]">
                  <MapPin size={18} strokeWidth={2} />
                </span>
                <div className="flex flex-col">
                  <span className="text-[14.5px] font-medium text-[#F5F7FA]">Available Worldwide</span>
                  <span className="text-[12.5px] text-[#A6AFBE]">Remote Collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HORIZONTAL DIVIDER */}
        <div className="mt-12 mb-7 h-px w-full bg-white/[0.08]" aria-hidden="true" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[14px] font-semibold text-[#F5F7FA]">
              © {currentYear} Garuda. All rights reserved.
            </p>
            <p className="mt-1 text-[13px] text-[#A6AFBE]">
              Built with intention. Designed for a better web.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <a
                href={siteConfig.github || "https://github.com/Bharat0264"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
              <a
                href={siteConfig.linkedin || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0-.01-3.34 1.67 1.67 0 0 0 .01 3.34M7.85 18.5V10.1H5.06v8.4h2.79z"/>
                </svg>
              </a>
              <a
                href={siteConfig.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a
                href={siteConfig.twitter || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (formerly Twitter)"
                className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/15 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 hover:border-[#168BFF] hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF]"
              >
                <svg className="h-[14px] w-[14px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

            <span className="hidden sm:block h-6 w-px bg-white/15 mx-2.5 sm:mx-3" aria-hidden="true" />

            <button
              onClick={scrollToTop}
              type="button"
              aria-label="Back to top"
              className="group flex items-center gap-2.5 text-[14px] font-medium text-[#F5F7FA] transition-colors duration-200 hover:text-[#168BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#168BFF] rounded-full cursor-pointer py-1"
            >
              <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/20 bg-[#060a14] text-[#F5F7FA] transition-all duration-200 group-hover:border-[#168BFF] group-hover:text-[#168BFF]">
                <ArrowUp size={16} strokeWidth={2} />
              </span>
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
export function CTA(){return <section className="wrap py-24"><div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_75%_0%,rgba(124,108,255,.23),transparent_34%),#101014] px-7 py-14 text-center sm:px-12"><p className="eyebrow">Let’s make it useful</p><h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-.055em] sm:text-6xl">Have an idea? Let’s turn it into something people love using.</h2><div className="mt-8 flex justify-center"><Link className="button" href="/contact">Start a project <ArrowUpRight size={16}/></Link></div></div></section>}
