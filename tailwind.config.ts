import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#0f172a",
          hover: "#1e293b",
          active: "#334155",
          text: "#94a3b8",
          "text-active": "#f8fafc",
        },
        brand: {
          primary: "#3b82f6",
          secondary: "#6366f1",
        },
        platform: {
          instagram: "#E4405F",
          tiktok: "#00f2ea",
          youtube: "#FF0000",
          twitter: "#000000",
          linkedin: "#0A66C2",
        },
        tier: {
          nano: "#8b5cf6",
          micro: "#06b6d4",
          mid: "#10b981",
          macro: "#f59e0b",
          mega: "#ef4444",
        },
      },
    },
  },
  plugins: [],
}
export default config
