import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ritual: {
          bg: "#08090E",
          surface: "#0D0F18",
          card: "#121522",
          cardHover: "#171B2C",
          border: "#1E2338",
          borderFocus: "#3A3F64",
          purple: "#9333EA",
          purpleGlow: "#A855F7",
          purpleLight: "#C084FC",
          cyan: "#06B6D4",
          cyanGlow: "#22D3EE",
          green: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "ritual-glow":
          "radial-gradient(circle at 50% 0%, rgba(147, 51, 234, 0.18) 0%, rgba(6, 182, 212, 0.08) 35%, transparent 70%)",
        "card-glass":
          "linear-gradient(135deg, rgba(18, 21, 34, 0.85) 0%, rgba(13, 15, 24, 0.7) 100%)",
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(147, 51, 234, 0.35)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.35)",
        "glow-green": "0 0 25px -5px rgba(16, 185, 129, 0.35)",
        "glow-rose": "0 0 25px -5px rgba(244, 63, 94, 0.35)",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.03)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
