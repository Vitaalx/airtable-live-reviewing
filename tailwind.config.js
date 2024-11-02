/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
  ],
  theme: {
    container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
    extend: {
      height: {
				"screen-nh": "calc(100vh - 6rem)", // screen - header
			},
			minHeight: {
				"screen-nh": "calc(100vh - 6rem)", // screen - header
			},
    },
  },
  plugins: [],
}

