/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'goose-blue': {
          50: '#f2fafa',
          100: '#e0f4f7',
          200: '#c2e9ee',
          300: '#96d6df',
          400: '#64becb',
          500: '#46a2b1',
          600: '#388596',
          700: '#326d7b',
          800: '#2f5965',
          900: '#2a4a55',
        },
        wabi: {
          paper: '#f9f8f4',
          subtle: '#f2f0eb',
          stone: '#e8e6e1',
          darkstone: '#d1cdc7',
          text: '#44403c',
          muted: '#78716c',
          ink: '#292524',
        },
        'wabi-dark': {
          paper: '#2a2520',
          subtle: '#332e28',
          stone: '#3d3730',
          darkstone: '#4a443c',
          text: '#e8e6e1',
          muted: '#b8b4ae',
          ink: '#f2f0eb',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Keep the original global "hand" look; only Hitokoto uses a more artistic handwriting.
        hand: ['Gochi Hand', 'cursive'],
        // Prefer artistic system fonts (instant, no remote font loading).
        // Avoid KaiTi/Kaiti per request.
        hitokoto: [
          'HanziPen SC',
          'HanziPen TC',
          'STHupo',
          'STCaiyun',
          'FZShuTi',
          'Segoe Script',
          'Segoe Print',
          'Bradley Hand',
          'Gochi Hand',
          'cursive',
        ],
      },
      backgroundImage: {
        'paper-pattern':
          'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 4s infinite',
        blob: 'blob 20s infinite',
        'wiggle-slow': 'wiggle 5s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'spin-reverse-slow': 'spin-reverse 15s linear infinite',
        // Keep entrance motion subtle so it doesn't penalize LCP on mobile.
        'fade-in': 'fadeIn 0.24s ease-out',
        'fade-in-up': 'fadeInUp 0.28s ease-out',
        'fade-in-up-delayed': 'fadeInUp 0.28s ease-out 0.08s both',
        'scale-in': 'scaleIn 0.22s ease-out',
        'slide-in-left': 'slideInLeft 0.26s ease-out',
        'slide-in-right': 'slideInRight 0.26s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0.92' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0.92', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0.92', transform: 'scale(0.97)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0.92', transform: 'translateX(-18px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0.92', transform: 'translateX(18px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
};
