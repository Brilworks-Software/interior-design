/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: "var(--border)",
      },
      backgroundColor: {
        DEFAULT: "var(--background)",
        card: "var(--card)",
        popover: "var(--popover)",
        sidebar: "var(--sidebar)",
      },
      textColor: {
        DEFAULT: "var(--foreground)",
        card: "var(--card-foreground)",
        popover: "var(--popover-foreground)",
        sidebar: "var(--sidebar-foreground)",
      },
      ringColor: {
        DEFAULT: "var(--ring)",
      },
      colors: {
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        "accent-foreground": "var(--accent-foreground)",
        destructive: "var(--destructive)",
        input: "var(--input)",
        chart1: "var(--chart-1)",
        chart2: "var(--chart-2)",
        chart3: "var(--chart-3)",
        chart4: "var(--chart-4)",
        chart5: "var(--chart-5)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};
