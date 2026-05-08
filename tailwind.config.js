/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          900: 'oklch(20% 0.01 260)',
          700: 'oklch(38% 0.012 260)',
          500: 'oklch(55% 0.012 260)',
          400: 'oklch(65% 0.012 260)',
          300: 'oklch(78% 0.008 260)',
        },
        paper: {
          50:  'oklch(99% 0.003 90)',
          100: 'oklch(98% 0.004 90)',
          200: 'oklch(95.5% 0.005 90)',
          300: 'oklch(92% 0.006 90)',
        },
        brand: {
          50:  'oklch(96% 0.025 255)',
          100: 'oklch(92% 0.05 255)',
          500: 'oklch(55% 0.13 255)',
          600: 'oklch(48% 0.13 255)',
          700: 'oklch(40% 0.12 255)',
        },
        sage: {
          500: 'oklch(62% 0.09 155)',
          600: 'oklch(52% 0.09 155)',
        },
        rose: {
          500: 'oklch(60% 0.13 25)',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 2px 4px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.06)',
        ring: '0 0 0 4px oklch(92% 0.05 255 / 0.7)',
      },
      borderRadius: {
        xl2: '1.1rem',
      },
    },
  },
  plugins: [],
};
