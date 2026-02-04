/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Premium: 다크 네이비(신뢰) + 골드(권위) + 넥소 블루
        navy: '#0f1729',
        navyLight: '#1e293b',
        navyMuted: '#334155',
        gold: '#c9a227',
        goldLight: '#e5c76b',
        goldMuted: '#a68b1e',
        nexoBlue: '#1e5f8a',
        nexoBlueLight: '#2563eb',
        accent: '#e85d2a', // CTA 강렬한 오렌지
      },
    },
  },
  plugins: [],
}
