/** @type {import('tailwindcss').Config} */
export default {
  content: [
    //incluimos el arhivo index
    "./index.html",
    //incluimos todos los archivos que tengan com oextension vue, js, jsx, etc
    "./src/**/*.{vue,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '25': '6.25rem', 
      },
      gridTemplateRows: {
        'layout': '64px 1fr 100px', 
      }
    },
  },
  plugins: [],
}

