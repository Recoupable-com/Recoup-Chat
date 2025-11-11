import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      keyframes: {
        "success-pulse": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      animation: {
        "success-pulse": "success-pulse 1.5s ease-in-out",
        "ping-slow": "ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
  		fontFamily: {
  			// Theme-based fonts (use CSS variables for centralized management)
  			primary: ['var(--font-primary)'],
  			'primary-medium': ['var(--font-primary-medium)'],
  			'primary-bold': ['var(--font-primary-bold)'],
  			secondary: ['var(--font-secondary)'],
  			'secondary-bold': ['var(--font-secondary-bold)'],
  			serif: ['var(--font-serif)'],
  			// Legacy font names (kept for backward compatibility)
  			inter_medium: [
  				'Inter Medium',
  				'sans-serif'
  			],
  			inter_bold: [
  				'Inter Bold',
  				'sans-serif'
  			],
  			inter: [
  				'Inter Regular',
  				'sans-serif'
  			],
  			plus_jakarta_sans_bold: [
  				'PlusJakartaSans Bold',
  				'sans-serif'
  			],
  			plus_jakarta_sans: [
  				'PlusJakartaSans Regular',
  				'sans-serif'
  			]
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			black: {
  				DEFAULT: '#000000',
  				light: '#444444'
  			},
  			while: {
  				DEFAULT: '#ffffff'
  			},
  			grey: {
  				DEFAULT: '#E6E6E6',
  				dark: '#71717A',
				"dark-1": "#A1A1AA",
  				primary: '#C6C6C6',
  				secondary: '#F8F8F8',
  				light: '#E0E0E0',
				"light-1": "#F1F1F1",
				"light-2": "#EBEBEB",
				"light-3": "#FAFAFA"
  			},
        dark: {
          bg: {
            primary: 'var(--dark-bg-primary)',
            secondary: 'var(--dark-bg-secondary)',
            tertiary: 'var(--dark-bg-tertiary)',
            input: 'var(--dark-bg-input)',
            'message-user': 'var(--dark-bg-message-user)',
            hover: 'var(--dark-bg-hover)',
            active: 'var(--dark-bg-active)',
          },
          border: {
            DEFAULT: 'var(--dark-border)',
            light: 'var(--dark-border-light)',
            focus: 'var(--dark-border-focus)',
          },
          text: {
            primary: 'var(--dark-text-primary)',
            secondary: 'var(--dark-text-secondary)',
            muted: 'var(--dark-text-muted)',
            placeholder: 'var(--dark-text-placeholder)',
          },
        },
  			green: {
  				DEFAULT: '#345A5D'
  			},
  			purple: {
  				DEFAULT: '#BD99B3',
  				dark: '#720762'
  			},
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		boxShadow: {
  			grey: '1px 1px 1px 1px #E6E6E6',
  			'grey-light': '1px 3px 8px 1px #E6E6E6'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
