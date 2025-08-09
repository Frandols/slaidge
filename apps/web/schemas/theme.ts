import z from 'zod'

const themeSchema = z.object({
	colors: z.object({
		background: z.string().describe('The background color in hex'),
		foreground: z.string().describe('The foreground color in hex'),
		mutedForeground: z.string().describe('The muted foreground color in hex'),
		chart: z.array(z.string().describe('Chart color in hex')).length(5),
	}),
	fonts: z.object({
		serif: z.string().min(1).describe('Serif font name'),
		sansSerif: z.string().min(1).describe('Sans-serif font name'),
	}),
})

export default themeSchema
