import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const linkHeadingStyles = {
  color: colors.gray[100],
  borderBottomColor: "transparent",
  borderRadius: 3,
  boxShadow: `0 0 0 0.4rem transparent`,
  "&:hover": {
    color: "none",
    borderBottomColor: "transparent",
    background: colors.gray[100],
    boxShadow: `0 0 0 0.4rem ${colors.gray[100]}`,
  },
};

const config = {
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
  darkMode: ["class"],
  variants: {
    extend: {
      typography: ["dark"],
    },
  },
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      filter: {
        "blur-20": "blur(20px)",
        "blur-25": "blur(25px)",
      },
      brightness: {
        150: "1.5",
      },
      colors: {
        "page-background-light": "white",
        "page-background-dark": "hsl(220deg 20% 20%)",
        "page-border-light": "white",
        "page-border-dark": "hsl(220deg 30% 40%)",
        "prose-text-light": "#333333",
        "prose-text-dark": "#EDEDED",
        "content-width": "55rem",
        "outer-content-width": "80rem",
        "viewport-padding": "16px",
        "header-height": "5rem",
        "trimmed-content-width": "calc(55rem - 32px)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        "page-light":
          "0px 1px 2px hsl(50deg 60% 50% / 0.15), 0px 2px 4px hsl(50deg 60% 50% / 0.15), 0px 4px 8px hsl(50deg 60% 50% / 0.15)",
        "page-dark": "none",
        "card-light":
          "0px 1px 2px hsl(50deg 20% 50% / 0.1), 0px 2px 4px hsl(50deg 20% 50% / 0.1), 0px 4px 8px hsl(50deg 20% 50% / 0.1), 0px 8px 16px hsl(50deg 20% 50% / 0.1)",
        "card-dark": "none",
      },
      spacing: {
        "spacing-1": "var(--spacing-1)",
        "content-width": "55rem",
        "outer-content-width": "80rem",
        "viewport-padding": "16px",
        "header-height": "5rem",
        "trimmed-content-width": "calc(55rem - 32px)",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "var(--prose-text-light)",
            pre: {
              marginTop: "1rem",
              marginBottom: "0",
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--foreground))",
              padding: "1.25rem",
              borderRadius: "0.375rem",
              border: "1px solid hsl(var(--border))",
              code: {
                fontSize: "0.875rem",
                fontFamily: "var(--font-mono)",
                fontWeight: "500",
                backgroundColor: "transparent",
                border: "none",
                padding: "0",
              },
            },
            "h2 a": linkHeadingStyles,
            "h3 a": linkHeadingStyles,
            "h4 a": linkHeadingStyles,
            "h5 a": linkHeadingStyles,
            "h6 a": linkHeadingStyles,
            "h3 a:has(code)": {
              boxShadow: "0 0 0 0.3rem transparent",
              "&:hover": {
                background: colors.teal[900],
                boxShadow: `0 0 0 0.3rem ${colors.teal[900]}`,
              },
            },
            figure: {
              marginTop: "1rem",
              marginBottom: "0",
            },
            blockquote: {
              marginTop: "1rem",
              marginBottom: "0",
              fontSize: "90%",
              color: colors.zinc[500],
              borderLeftColor: colors.zinc[700],
              "p::before": {
                display: "none",
              },
              "p::after": {
                display: "none",
              },
            },
            a: {
              textDecoration: "none",
              borderBottom: "1px solid rgb(249 168 212)",
              color: colors.pink[200],
              borderRadius: 1,
              transitionProperty: "color, border-color, background, box-shadow",
              transitionDuration: "0.18s",
              boxShadow: "0 0 0 0.2rem transparent",
              "&:hover": {
                color: "rgb(24 24 27)",
                borderBottomColor: "rgb(249 168 212)",
                background: "rgb(249 168 212)",
                boxShadow: "0 0 0 0.2rem rgb(249 168 212)",
              },
            },
            code: {
              color: "#86e1fc",
              "&::before": {
                content: "unset !important",
              },
              "&::after": {
                content: "unset !important",
              },
              fontWeight: "normal",
            },
            "a code": {
              fontSize: "1em",
            },
            h1: {
              marginTop: "2.5em",
              marginBottom: "1em",
              color: "hsl(var(--foreground))",
              fontWeight: "700",
            },
            h2: {
              marginTop: "2.5em",
              marginBottom: "0.75em",
              color: "hsl(var(--foreground))",
              fontWeight: "600",
              borderBottom: "1px solid hsl(var(--border))",
              paddingBottom: "0.5em",
            },
            h3: {
              marginTop: "2em",
              marginBottom: "0.75em",
              color: "hsl(var(--foreground))",
              fontWeight: "500",
            },
            h4: {
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
            p: {
              marginTop: "1.5em",
              marginBottom: "1.5em",
              lineHeight: "1.75",
            },
            ul: {
              marginTop: "1.5em",
              marginBottom: "1.5em",
              paddingLeft: "1.75em",
            },
            ol: {
              marginTop: "1.5em",
              marginBottom: "1.5em",
              paddingLeft: "1.75em",
            },
            table: {
              marginTop: "2em",
              marginBottom: "2em",
              width: "100%",
              borderCollapse: "collapse",
              "thead th": {
                backgroundColor: "hsl(var(--muted))",
                padding: "0.75rem",
                borderBottom: "2px solid hsl(var(--border))",
              },
              "tbody td": {
                padding: "0.75rem",
                borderBottom: "1px solid hsl(var(--border))",
              },
            },
            hr: {
              marginTop: "3em",
              marginBottom: "3em",
            },
          },
        },
        dark: {
          css: {
            color: "var(--prose-text-dark)",
            pre: {
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--foreground))",
            },
          },
        },
      },
    },
  },
} satisfies Config;

export default config;
