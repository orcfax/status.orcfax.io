module.exports = {
	content: ['./src/**/*.{svelte,js,ts}'],
	plugins: [require('daisyui')],
	theme: {
		extend: {
			screens: {
				xs: '500px'
			}
		}
	},
	daisyui: {
		themes: [
			{
				orcfax_light: {
					primary: '#63A19C',
					secondary: '#f5f9f9',
					accent: '#0975b5',
					neutral: '#A6A6A6',
					'base-100': '#eff5f5',
					info: '#66abf4',
					success: '#137654',
					warning: '#ac5c06',
					error: '#e43a50'
				},
				orcfax_dark: {
					primary: '#63A19C',
					secondary: '#1a1f1f',
					accent: '#0975b5',
					neutral: '#3B3B3B',
					'base-100': '#141414',
					'base-300': '#1C1C1C',
					info: '#66abf4',
					success: '#137654',
					warning: '#ac5c06',
					error: '#e43a50'
				}
			}
		]
	}
};
