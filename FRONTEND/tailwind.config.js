export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'slide-right-fade': 'slideRightFade 0.8s ease-in-out forwards',
        'slide-left-fade': 'slideLeftFade 0.8s ease-in-out forwards',
      },
      keyframes: {
        slideRightFade: {
          '0%': {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(100px) scale(1.05)', // Slight scale up
            filter: 'blur(2px)', // Add blur for depth
          },
        },
        slideLeftFade: {
          '0%': {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
            filter: 'blur(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(-100px) scale(0.95)', // Slight scale down
            filter: 'blur(2px)', // Add blur for depth
          },
        },
      },
      colors: {
        surface: 'rgb(241 243 242 / var(--tw-bg-opacity))',
        primary: 'rgb(0 181 98 / var(--tw-bg-opacity))',
      },
 
    },
  },
  plugins: [],
}
