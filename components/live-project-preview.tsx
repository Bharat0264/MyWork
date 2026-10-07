import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";

export function LiveProjectPreview({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (!project.liveUrl) return <div className="relative flex h-full items-end p-8"><div className="rounded-xl border border-white/15 bg-black/20 p-5 backdrop-blur"><p className="text-xs uppercase tracking-[.16em] text-white/60">Project preview</p><p className="mt-2 text-xl font-semibold">Live site coming soon</p><p className="mt-2 max-w-sm text-sm text-white/60">Add a live URL in the project data to display its homepage here.</p></div></div>;
  const frameStyle = compact ? { transform: "scale(.64)", width: "156%", height: "156%" } : { transform: "scale(.82)", width: "122%", height: "122%" };
  return <div className="pointer-events-none absolute inset-[5%] z-10 overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl live-frame"><div className="flex h-8 items-center gap-2 border-b border-black/10 bg-zinc-100 px-3"><i className="h-2 w-2 rounded-full bg-red-400"/><i className="h-2 w-2 rounded-full bg-amber-400"/><i className="h-2 w-2 rounded-full bg-emerald-400"/><span className="ml-2 truncate text-[9px] text-zinc-500">{project.liveUrl.replace(/^https?:\/\//, "")}</span><span className="ml-auto text-zinc-500"><ExternalLink size={compact ? 10 : 13}/></span></div><iframe title={`${project.title} live homepage`} src={project.liveUrl} className="h-[calc(100%-2rem)] origin-top-left border-0" style={frameStyle} loading="lazy" /><div className="live-sheen"/></div>;
}
