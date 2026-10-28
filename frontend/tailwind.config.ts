import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./datasets/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forgewatch: {
          bg: "#0A0D0E",
          tx: "#E9F3F0",
          mut: "#7D8F8A",
          teal: "#2EF2C0",
          amber: "#F5B840",
          red: "#FF5C6C",
        },
        industrial: {
          950: "#060911",
          900: "#0B111E",
          850: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          400: "#94A3B8",
          200: "#E2E8F0",
        },
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 18px rgba(46, 242, 192, 0.45)",
        "glow-teal": "0 0 24px rgba(46, 242, 192, 0.3)",
        "glow-amber": "0 0 24px rgba(245, 184, 64, 0.3)",
        "glow-red": "0 0 24px rgba(255, 92, 108, 0.3)",
      },
      animation: {
        "scan-laser": "scan 1.1s ease-in-out infinite",
        "pulse-radar": "pl 2.2s ease-out infinite",
        "flow-spin": "flow var(--dur, 1s) linear infinite",
      },
      keyframes: {
        scan: {
          "0%": { top: "-90px", opacity: "1" },
          "100%": { top: "100%", opacity: "1" },
        },
        pl: {
          from: { transform: "scale(0.7)", opacity: "0.9" },
          to: { transform: "scale(2.3)", opacity: "0" },
        },
        flow: {
          to: { strokeDashoffset: "-32" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
