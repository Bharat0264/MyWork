# Deletion Log - Review Round 1

All deletions strictly follow Golden Rule:
1. Not imported or referenced anywhere (including dynamic imports, string paths, CSS url(), markdown, config, metadata).
2. Not requested by production in the baseline crawl.
3. No impact on API routes, forms, email templates, sitemaps, robots, manifest, favicons, OG images, or structured data.

| Path | Size | Reason | Proof |
|------|------|--------|-------|
| `components/ui/` (60+ components) | ~220 KB | Unused shadcn UI library boilerplate from starter template. The site uses custom Navy Mirage components. | Knip report; 0 imports in `app/` or active components; 0 requests in crawl. |
| `components/project-card.tsx` | 2.1 KB | Abandoned duplicate project card component superseded by `components/work-portfolio-showcase.tsx`. | Knip report; 0 imports across codebase. |
| `components/printbee-demo.tsx` | 3.5 KB | Unused mock demo component from early design exploration. | Knip report; 0 imports across codebase. |
| `components/connector-error.tsx` | 1.8 KB | Cloudflare worker connector preview error component, unreferenced by site. | Knip report; 0 imports across codebase. |
| `data/team.ts` | 1.6 KB | Unused placeholder team data. | Knip report; 0 imports across codebase. |
| `app/chatgpt-auth.ts` | 2.8 KB | Starter template ChatGPT OAuth boilerplate, not used by portfolio site. | Knip report; 0 imports across codebase. |
| `db/` (`index.ts`, `schema.ts`) | 0.6 KB | Starter template D1/Drizzle scaffold; schema is explicitly empty, site uses no database. | Knip report; 0 imports across codebase. |
| `drizzle/` (`meta/_journal.json`) | 0.1 KB | Empty Drizzle migration metadata. | 0 references across codebase. |
| `drizzle.config.ts` | 0.4 KB | Config file for unused Drizzle database. | 0 references across codebase. |
| `examples/` (`d1/app/api/notes/...`) | 1.2 KB | Starter template example notes API and schema. | Knip report; 0 imports across codebase. |
| `.openai/` (`hosting.json`) | 35 B | Editor/tool hosting metadata folder. | 0 references in build or runtime. |
| `vendor/` (`shadcn-tailwind-4.13.0.css`, license) | 17.7 KB | Unused CSS vendor file from starter template. | 0 references in `globals.css` or build. |
| `hooks/use-mobile.ts` | 0.8 KB | Only imported by deleted `components/ui/sidebar.tsx`. | Knip report; 0 imports in active code. |
| `lib/utils.ts` | 0.2 KB | Only exported `cn()` helper used by deleted `components/ui/`. | 0 imports in active code. |
| `public/garuda-painted-logo-horizontal.jpg` | 774.7 KB | Heavy unreferenced experimental logo asset. | 0 references in code; 0 requests in baseline crawl. |
| `public/garuda-painted-logo-vertical.jpg` | 769.8 KB | Heavy unreferenced experimental logo asset. | 0 references in code; 0 requests in baseline crawl. |
| `public/contact-eagle.png` | 1.93 MB | Unused PNG duplicate of `contact-eagle.webp` (which is used in `app/contact/page.tsx`). | 0 references in code; 0 requests in baseline crawl. |
| `public/projects/redesign-concept-full.webp` | 13.4 KB | Orphaned image from removed "Website Redesign" concept project. | 0 references in `data/projects.ts` or code. |
| `public/projects/redesign-concept.webp` | 6.7 KB | Orphaned image from removed "Website Redesign" concept project. | 0 references in `data/projects.ts` or code. |
| `public/file.svg` | 393 B | Default Next.js starter icon. | 0 references in code. |
| `public/globe.svg` | 1.0 KB | Default Next.js starter icon. | 0 references in code. |
| `public/window.svg` | 387 B | Default Next.js starter icon. | 0 references in code. |
