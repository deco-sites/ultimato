import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      base: [
        "Montserrat",
        "Open Sans",
        "Helvetica",
        "Arial",
        "Verdana",
        "sans-serif",
      ],
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: "#C83225",
        secondary: "#ED6C6E",
        accent: "#852C2A",
        neutral: "#FFF4F2",
        dark: "#18181B",
        whatsapp: "#25D366",
      },
      typography: ({ theme }: { theme: (str: string) => string }) => ({
        gray: {
          css: {
            "--tw-prose-headings": theme("colors.primary"),
            "--tw-prose-links": theme("colors.primary"),
          },
        },
      }),
    },
  },
  plugins: [daisyui, typography],
  daisyui: { themes: [], logs: false },
};
