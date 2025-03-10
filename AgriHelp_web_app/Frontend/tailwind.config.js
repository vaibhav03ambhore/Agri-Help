/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  
  ],
  theme: {
    extend: {
      transitionProperty: {
        'width': 'width',
        'margin': 'margin',
        'transform': 'transform'
      }
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
      transform: ['responsive'],
      translate: ['responsive']
    }
  },
  plugins: [],
}

