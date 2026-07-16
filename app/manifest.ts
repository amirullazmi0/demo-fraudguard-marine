import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "MarineGuard Maintenance Intelligence", short_name: "MarineGuard", description: "Maritime maintenance audit system", start_url: "/boss", display: "standalone", background_color: "#f4f8fb", theme_color: "#0e7490", icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }] }; }

