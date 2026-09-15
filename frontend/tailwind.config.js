/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['"Nunito"', 'system-ui', 'sans-serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#FFF8EF',
          subtle: '#FFFBF3',
        },
        ink: {
          DEFAULT: '#3A2E27',
          muted: '#8B7E74',
          faint: '#C9BCAF',
        },
        candy: {
          brand: '#FF6F59',
          valentine: '#FF5C8A',
          beauty: '#C77DFF',
          'beauty-soft': '#FF8FC4',
          noel: '#2FBF83',
          'noel-ice': '#3DBBE0',
          tet: '#FF6B4A',
          'tet-gold': '#FFC93C',
          'tet-red': '#E23F3F',
        },
      },
      borderRadius: {
        chip: '12px',
        control: '18px',
        card: '26px',
        stage: '32px',
      },
      boxShadow: {
        'candy-sm': '0 6px 0 rgba(58,46,39,0.08)',
        'candy-md': '0 10px 22px -8px rgba(58,46,39,0.22)',
      }
    },
  },
  plugins: [],
}
