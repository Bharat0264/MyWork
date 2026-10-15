"use client";
import Image from "next/image"; import Link from "next/link"; import { ArrowUpRight, Menu, X, Mail, Phone } from "lucide-react"; import { motion } from "framer-motion"; import { useState } from "react"; import { siteConfig } from "@/config/site";
const links = [["Work","/work"],["Services","/services"],["About","/about"],["Contact","/contact"]] as const;
export function Navbar(){const [open,setOpen]=useState(false);return <motion.header initial={{y:-30,opacity:0}} animate={{y:0,opacity:1}} className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050505cc] backdrop-blur-md"><nav className="wrap flex h-24 items-center justify-between"><Link href="/" aria-label="Garuda Web Designer and Developer" className="navbar-logo flex items-center shrink-0"><picture className="hidden sm:block"><source srcSet="/logo-full.webp" type="image/webp" /><img src="/logo-full.png" srcSet="/logo-full.png 1x, /logo-full.png 2x" alt="Garuda Web Designer and Developer" width={191} height={64} loading="eager" draggable={false} className="h-[52px] w-auto max-w-[280px] object-contain min-[900px]:h-[64px]" /></picture><picture className="block sm:hidden"><img src="/logo-eagle.png" srcSet="/logo-eagle.png 1x, /logo-eagle.png 2x" alt="Garuda Web Designer and Developer" width={44} height={44} loading="eager" draggable={false} className="h-[44px] w-auto object-contain" /></picture><span className="sr-only">Garuda Web Designer and Developer</span></Link><div className="hidden items-center gap-7 md:flex">{links.map(([label,href])=><Link className="nav-link" href={href} key={href}>{label}</Link>)}<Link href="/contact" className="button button-small">Start a project <ArrowUpRight size={15}/></Link></div><button aria-label="Toggle menu" className="md:hidden" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></nav>{open&&<div className="wrap flex flex-col gap-5 border-t border-white/10 py-7 md:hidden">{links.map(([label,href])=><Link onClick={()=>setOpen(false)} className="text-2xl font-semibold" href={href} key={href}>{label}</Link>)}<Link onClick={()=>setOpen(false)} href="/contact" className="button w-fit">Start a project</Link></div>}</motion.header>}
export function Footer(){const currentYear=new Date().getFullYear();return <motion.footer initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-50px"}} transition={{duration:0.6,ease:"easeOut"}} className="relative w-full overflow-hidden border-t border-white/[0.08] bg-[#050505] pt-8 pb-6 sm:pt-10 sm:pb-7"><div className="mx-auto max-w-[1300px] px-6 sm:px-12">
{/* TOP ROW: Single semantic markup for all viewports */}
<div className="footer-top">
  <Link href="/" aria-label="Garuda Web Designer and Developer" className="footer-logo shrink-0">
    <picture>
      <source srcSet="/logo-full.webp" type="image/webp" />
      <img src="/logo-full.png" srcSet="/logo-full.png 1x, /logo-full.png 2x" alt="Garuda Web Designer and Developer" width={220} height={74} loading="lazy" className="footer-logo-img" />
    </picture>
  </Link>
  <nav aria-label="Footer Navigation" className="footer-nav">
    {links.map(([label,href],index)=>(
      <div key={href} className="footer-nav-item">
        {index>0&&<span className="footer-nav-divider" aria-hidden="true"/>}
        <Link href={href} className="footer-nav-link">{label}</Link>
      </div>
    ))}
  </nav>
  <div className="footer-contact shrink-0">
    <a href={`mailto:${siteConfig.email}`} className="footer-contact-row">
      <Mail className="footer-contact-icon" size={22} strokeWidth={2}/>
      <span>{siteConfig.email}</span>
    </a>
    <a href={`tel:${siteConfig.phone.replace(/\s/g,"")}`} className="footer-contact-row">
      <Phone className="footer-contact-icon" size={22} strokeWidth={2}/>
      <span>{siteConfig.phone}</span>
    </a>
  </div>
</div>
{/* DIVIDER */}
<div className="mt-6 mb-5 h-px w-full bg-[rgba(30,107,255,0.35)]" aria-hidden="true"/>
{/* BOTTOM ROW */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-5">
  <p className="text-[14px] text-[#cfd8ec] tracking-[0.08em] text-center sm:text-left">© {currentYear} Garuda. Built with intention.</p>
  <div className="flex items-center gap-[20px]">
    <a href={siteConfig.github||"https://github.com/Bharat0264"} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group flex h-[42px] w-[42px] items-center justify-center rounded-full border-[1.5px] border-[#1E6BFF] bg-[#030816]/70 text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-[#4da1ff] hover:shadow-[0_0_14px_rgba(30,107,255,0.7)]">
      <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
    </a>
    <a href={siteConfig.linkedin||"#"} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group flex h-[42px] w-[42px] items-center justify-center rounded-full border-[1.5px] border-[#1E6BFF] bg-[#030816]/70 text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-[#4da1ff] hover:shadow-[0_0_14px_rgba(30,107,255,0.7)]">
      <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.67 1.67 0 1 0-.01-3.34 1.67 1.67 0 0 0 .01 3.34M7.85 18.5V10.1H5.06v8.4h2.79z"/></svg>
    </a>
    <a href={siteConfig.instagram||"#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group flex h-[42px] w-[42px] items-center justify-center rounded-full border-[1.5px] border-[#1E6BFF] bg-[#030816]/70 text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-[#4da1ff] hover:shadow-[0_0_14px_rgba(30,107,255,0.7)]">
      <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
    </a>
    <a href={siteConfig.twitter||"#"} target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="group flex h-[42px] w-[42px] items-center justify-center rounded-full border-[1.5px] border-[#1E6BFF] bg-[#030816]/70 text-white transition-all duration-300 hover:-translate-y-[2px] hover:border-[#4da1ff] hover:shadow-[0_0_14px_rgba(30,107,255,0.7)]">
      <svg className="h-[16px] w-[16px] fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </a>
  </div>
</div></div></motion.footer>}
export function CTA(){return <section className="wrap py-24"><div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_75%_0%,rgba(124,108,255,.23),transparent_34%),#101014] px-7 py-14 text-center sm:px-12"><p className="eyebrow">Let’s make it useful</p><h2 className="mt-5 text-balance text-4xl font-semibold tracking-[-.055em] sm:text-6xl">Have an idea? Let’s turn it into something people love using.</h2><div className="mt-8 flex justify-center"><Link className="button" href="/contact">Start a project <ArrowUpRight size={16}/></Link></div></div></section>}
