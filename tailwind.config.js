/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark': '#222831',
        'grey': '#393E46',
        'gold': '#FFD700',
        'light': '#EEEEEE',
        background: {
          DEFAULT: '#EEEEEE',
          dark: '#222831',
          medium: '#393E46',
        },
        text: {
          DEFAULT: '#222831',
          light: '#EEEEEE',
          medium: '#393E46',
        },
        accent: {
          DEFAULT: '#FFD700',
          hover: '#E6C200',
          light: '#FFE44D',
        },
        card: {
          DEFAULT: '#EEEEEE',
          hover: '#E6E6E6',
          border: '#393E46',
        }
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(34, 40, 49, 0.05), 0 1px 2px rgba(34, 40, 49, 0.1)',
        'soft-md': '0 4px 6px rgba(34, 40, 49, 0.07), 0 2px 4px rgba(34, 40, 49, 0.12)',
        'soft-lg': '0 10px 15px rgba(34, 40, 49, 0.08), 0 4px 6px rgba(34, 40, 49, 0.12)',
        'glow': '0 0 15px rgba(255, 215, 0, 0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
