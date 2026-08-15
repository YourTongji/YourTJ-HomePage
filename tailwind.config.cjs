/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: 'rgb(var(--background-page-rgb) / <alpha-value>)',
        surface: 'rgb(var(--background-surface-rgb) / <alpha-value>)',
        'surface-subtle': 'rgb(var(--background-surface-subtle-rgb) / <alpha-value>)',
        'surface-raised': 'rgb(var(--background-surface-raised-rgb) / <alpha-value>)',
        'surface-selected': 'rgb(var(--background-surface-selected-rgb) / <alpha-value>)',
        brand: 'rgb(var(--background-brand-rgb) / <alpha-value>)',
        action: 'rgb(var(--action-primary-rgb) / <alpha-value>)',
        'action-hover': 'rgb(var(--action-primary-hover-rgb) / <alpha-value>)',
        'action-pressed': 'rgb(var(--action-primary-pressed-rgb) / <alpha-value>)',
        'on-action': 'rgb(var(--text-on-action-rgb) / <alpha-value>)',
        'on-action-pressed': 'rgb(var(--text-on-action-pressed-rgb) / <alpha-value>)',
        primary: 'rgb(var(--text-primary-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary-rgb) / <alpha-value>)',
        tertiary: 'rgb(var(--text-tertiary-rgb) / <alpha-value>)',
        edge: 'rgb(var(--border-default-rgb) / <alpha-value>)',
        'edge-strong': 'rgb(var(--border-hover-rgb) / <alpha-value>)',
        link: 'rgb(var(--text-link-default-rgb) / <alpha-value>)',
        accent: 'rgb(var(--icon-accent-rgb) / <alpha-value>)',
      },
      fontFamily: {
        brand: ['"Faster One"', 'Inter', 'system-ui', 'sans-serif'],
        sans: [
          'Inter',
          '"Noto Sans SC"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif',
        ],
      },
      maxWidth: {
        page: '1180px',
      },
      boxShadow: {
        card: 'var(--shadow-sm)',
        'card-hover': 'var(--shadow-md)',
        panel: 'var(--shadow-lg)',
        lift: 'var(--shadow-lift)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.28s ease-out both',
      },
    },
  },
  plugins: [],
};
