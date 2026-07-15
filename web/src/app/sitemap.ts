import type { MetadataRoute } from "next";

const BASE = "https://afrobite.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/partenaire", priority: 0.8, freq: "monthly" },
    { path: "/about", priority: 0.6, freq: "monthly" },
    { path: "/support", priority: 0.6, freq: "monthly" },
    { path: "/privacy-policy", priority: 0.4, freq: "monthly" },
    { path: "/terms", priority: 0.4, freq: "monthly" },
    { path: "/mentions-legales", priority: 0.3, freq: "monthly" },
  ];
  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
