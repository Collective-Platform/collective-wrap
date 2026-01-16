/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'chinese-heading': ['var(--font-chinese-heading)'],
        'chinese-body': ['var(--font-chinese-body)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        // Semantic Background Colors
        'bg-page': 'hsl(var(--bg-page))',
        'bg-inverse': 'hsl(var(--bg-inverse))',
        'bg-highlight': 'hsl(var(--bg-highlight))',
        'bg-card': 'hsl(var(--bg-card))',
        'bg-card-hover': 'hsl(var(--bg-card-hover))',
        'bg-muted': 'hsl(var(--bg-muted))',
        'bg-input': 'hsl(var(--bg-input))',
        
        // Semantic Text Colors
        'text-accent': 'hsl(var(--text-accent))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
        'text-muted': 'hsl(var(--text-muted))',
        'text-on-dark': 'hsl(var(--text-on-dark))',
        'text-on-accent': 'hsl(var(--text-on-accent))',
        
        // Semantic Border Colors
        'border-accent': 'hsl(var(--border-accent))',
        'border-accent-hover': 'hsl(var(--border-accent-hover))',
        'border-default': 'hsl(var(--border-default))',
        'border-muted': 'hsl(var(--border-muted))',
        'border-subtle': 'hsl(var(--border-subtle))',
        
        // Semantic Button Colors
        'btn-primary-bg': 'hsl(var(--btn-primary-bg))',
        'btn-primary-text': 'hsl(var(--btn-primary-text))',
        'btn-secondary-bg': 'hsl(var(--btn-secondary-bg))',
        'btn-secondary-text': 'hsl(var(--btn-secondary-text))',
        'btn-secondary-hover': 'hsl(var(--btn-secondary-hover))',
        'btn-disabled-bg': 'hsl(var(--btn-disabled-bg))',
        'btn-disabled-text': 'hsl(var(--btn-disabled-text))',
        
        // Semantic Progress Colors
        'progress-track': 'hsl(var(--progress-track))',
        'progress-fill': 'hsl(var(--progress-fill))',
        
        // Legacy colors (for backward compatibility)
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
