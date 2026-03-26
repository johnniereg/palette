export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          700: '#334155',
          900: '#0f172a',
        }
      },
      spacing: {
        safe: 'max(1rem, env(safe-area-inset-bottom))',
      }
    },
  },
  plugins: [],
}
