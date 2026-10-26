import flowbite from 'flowbite/plugin'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': 'var(--color-brand, #06CF99)',
        brand: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#000000', // Warna utama diubah menjadi hitam pekat
          600: '#222222',
          700: '#313131',
          800: '#414141',
          900: '#525252',
          950: '#636363',
        }
      },
    },
  },

  plugins: [
    flowbite
  ]
}