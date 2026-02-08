import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "mc-bg": "#0f141a",
        "mc-panel": "#161d24",
        "mc-card": "#1b2430",
        "mc-accent": "#f6c453",
        "mc-muted": "#95a3b3"
      }
    }
  },
  plugins: []
};

export default config;
