import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        greyScale: {
          background: '#EDEEED',
          surface: {
            subtitle: '#F5F5F5',
            default: '#DCDCDA',
            disabled: '#CACBC8',
          },
          border: {
            default: '#B9BAB6',
            disabled: '#CACBC8',
            darker: '#656661',
          },
          text: {
            title: '#10100F',
            body: '#222220',
            subtitle: '#434440',
            caption: '#878881',
            negative: '#F5F5F5',
            disabled: '#B9BAB6',
          },
        },
        primaryVariant: {
          primaryGreen: 'var(--Colours-PrimaryGreen-50, #DBFFED)',
          surface: {
            subtitle: '#DBFFED',
            lighter: '#00DB6A',
            default: '#13afef',
            darker: '#005C2C',
          },
          border: {
            subtitle: '#B8FFDA',
            lighter: '#29FF90',
            default: '#29FF90',
            darker: '#005C2C',
          },
          text: {
            label: '#005C2C',
          },
        },
        errorVariant: {
          surface: {
            subtitle: '#FEE6E6',
            lighter: '#F96161',
            default: '#E30908',
            darker: '#8A0505',
          },
          border: {
            subtitle: '#FDC9C9',
            lighter: '#F96161',
            default: '#F96161',
            darker: '#8A0505',
          },
          text: {
            label: '#8A0505',
          },
        },
        warningVariant: {
          surface: {
            subtitle: '#FFF4E5',
            lighter: '#FFB861',
            default: '#FA8B00',
            darker: '#945100',
          },
          border: {
            subtitle: '#FFE8CC',
            lighter: '#FFB861',
            default: '#FFB861',
            darker: '#945100',
          },
          text: {
            label: '#945100',
          },
        },
        successVariant: {
          surface: {
            subtitle: '#D6FFEB',
            lighter: '#0AFF89',
            default: '#006534',
            darker: '#003D20',
          },
          border: {
            subtitle: '#ADFFD8',
            lighter: '#0AFF89',
            default: '#0AFF89',
            darker: '#003D20',
          },
          text: {
            label: '#003D20',
          },
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
