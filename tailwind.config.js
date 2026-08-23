/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        console: {
          bg: "#05080a",
          panel: "#0b1013",
          panel2: "#0f161a",
          line: "#1b262b",
          text: "#e6f1ef",
          muted: "#7d9294",
        },
        alarm: "#ff3b4e",
        channel: {
          flu: "#2dd9a3",
          mem: "#38bdf8",
          spa: "#b28dfa",
          spd: "#fbbf24",
          qnt: "#f472b6",
        },
      },
      fontFamily: {
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-fine":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "24px 24px",
      },
      keyframes: {
        sweep: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-flash": {
          "0%, 100%": { opacity: "0" },
          "35%": { opacity: "0.22" },
        },
        flatline: {
          "0%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-3px)" },
          "40%": { transform: "translateX(2px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(1px)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        sweep: "sweep 1.6s linear infinite",
        "pulse-flash": "pulse-flash 0.65s ease-out",
        flatline: "flatline 0.4s ease-in-out",
      },
    },
  },
  plugins: [],
};
