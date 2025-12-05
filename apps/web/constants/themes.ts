import { z } from 'zod'

import themeSchema from '@/schemas/theme'

export const FIRST_THEME_SUGGESTION = {
	id: 'modern-dark',
	name: 'Modern Dark',
	theme: {
		colors: {
			background: '#1a1a1a',
			foreground: '#ffffff',
			mutedForeground: '#a1a1aa',
			chart: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
		},
		fonts: {
			serif: 'Merriweather',
			sansSerif: 'Inter',
		},
	},
}

const THEME_SUGGESTIONS: {
	id: string
	name: string
	theme: z.infer<typeof themeSchema>
}[] = [
	FIRST_THEME_SUGGESTION,
	{
		id: 'elegant-beige',
		name: 'Elegant Beige',
		theme: {
			colors: {
				background: '#fffbf0',
				foreground: '#292524',
				mutedForeground: '#78716c',
				chart: ['#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
			},
			fonts: {
				serif: 'Playfair Display',
				sansSerif: 'Lato',
			},
		},
	},
	{
		id: 'ocean-blue',
		name: 'Ocean Blue',
		theme: {
			colors: {
				background: '#f0f9ff',
				foreground: '#0c4a6e',
				mutedForeground: '#64748b',
				chart: ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e'],
			},
			fonts: {
				serif: 'Lora',
				sansSerif: 'Open Sans',
			},
		},
	},
	{
		id: 'forest-green',
		name: 'Forest Green',
		theme: {
			colors: {
				background: '#f0fdf4',
				foreground: '#14532d',
				mutedForeground: '#65a30d',
				chart: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d'],
			},
			fonts: {
				serif: 'Bitter',
				sansSerif: 'Lato',
			},
		},
	},
	{
		id: 'sunset-warmth',
		name: 'Sunset Warmth',
		theme: {
			colors: {
				background: '#fff7ed',
				foreground: '#7c2d12',
				mutedForeground: '#ea580c',
				chart: ['#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
			},
			fonts: {
				serif: 'Merriweather',
				sansSerif: 'Lato',
			},
		},
	},
	{
		id: 'neon-cyber',
		name: 'Neon Cyber',
		theme: {
			colors: {
				background: '#09090b',
				foreground: '#e4e4e7',
				mutedForeground: '#a1a1aa',
				chart: ['#d946ef', '#8b5cf6', '#06b6d4', '#10b981', '#facc15'],
			},
			fonts: {
				serif: 'Roboto Slab',
				sansSerif: 'Roboto',
			},
		},
	},
	{
		id: 'minimalist-grey',
		name: 'Minimalist Grey',
		theme: {
			colors: {
				background: '#f8fafc',
				foreground: '#0f172a',
				mutedForeground: '#64748b',
				chart: ['#94a3b8', '#64748b', '#475569', '#334155', '#1e293b'],
			},
			fonts: {
				serif: 'Lora',
				sansSerif: 'Open Sans',
			},
		},
	},
	{
		id: 'royal-purple',
		name: 'Royal Purple',
		theme: {
			colors: {
				background: '#faf5ff',
				foreground: '#581c87',
				mutedForeground: '#9333ea',
				chart: ['#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87'],
			},
			fonts: {
				serif: 'Playfair Display',
				sansSerif: 'Montserrat',
			},
		},
	},
	{
		id: 'earthy-clay',
		name: 'Earthy Clay',
		theme: {
			colors: {
				background: '#fef2f2',
				foreground: '#7f1d1d',
				mutedForeground: '#b91c1c',
				chart: ['#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
			},
			fonts: {
				serif: 'Bitter',
				sansSerif: 'Source Sans Pro',
			},
		},
	},
] as const

export { THEME_SUGGESTIONS }
