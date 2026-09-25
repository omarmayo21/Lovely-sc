/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C1E1A',
          container: '#2C1E1A',
          hover: '#4A3B32',
          light: '#F7DDD6',
        },
        secondary: {
          DEFAULT: '#D99B8B',
          hover: '#C27D6B',
          container: '#F7ECE8',
          text: '#845144',
        },
        tertiary: {
          DEFAULT: '#758A73',
          hover: '#5F745D',
          container: '#E8EFE6',
          dark: '#384C38',
        },
        surface: {
          DEFAULT: '#FCF9F4',
          dim: '#DCDAD5',
          bright: '#FCF9F4',
          tint: '#6D5A55',
          variant: '#E5E2DD',
          container: {
            lowest: '#FFFFFF',
            low: '#F6F3EE',
            DEFAULT: '#F0EDE9',
            high: '#EBE8E3',
            highest: '#E5E2DD',
          },
        },
        'on-surface': {
          DEFAULT: '#2C1E1A',
          variant: '#6B5E55',
          muted: '#817471',
        },
        background: {
          DEFAULT: '#FAF7F2',
          alt: '#FCF9F4',
        },
        outline: {
          DEFAULT: '#817471',
          variant: '#EFE7DF',
          subtle: '#EFE6DC',
        },
        blush: '#F7ECE8',
        oatmeal: '#F5EFEB',
        espresso: '#2C1E1A',
        cream: '#FAF7F2',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Tajawal', 'Cairo', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'Tajawal', 'Cairo', 'sans-serif'],
        arabic: ['Tajawal', 'Cairo', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(44, 30, 26, 0.04)',
        'soft-md': '0 8px 24px -4px rgba(44, 30, 26, 0.06), 0 2px 6px -1px rgba(44, 30, 26, 0.03)',
        'soft-lg': '0 16px 36px -8px rgba(44, 30, 26, 0.08), 0 4px 12px -2px rgba(44, 30, 26, 0.04)',
        'card-lift': '0 10px 30px -8px rgba(74, 59, 50, 0.05), 0 4px 12px -2px rgba(74, 59, 50, 0.03)',
      },
      borderRadius: {
        'luxury': '0.75rem',
        'luxury-lg': '1rem',
        'luxury-xl': '1.5rem',
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.75rem',
        'space-xl': '3rem',
      },
    },
  },
  plugins: [],
}
