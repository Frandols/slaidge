import { z } from 'zod'

export const APIPresentationSchema = z.object({
	presentationId: z.string().min(1),
	title: z.string().min(1),
	pageSize: z.object({
		width: z.object({
			magnitude: z.number().int().positive(),
		}),
		height: z.object({
			magnitude: z.number().int().positive(),
		}),
	}),
	slides: z.array(
		z.object({
			objectId: z.string().min(1),
		})
	),
})

const timestampSchema = z.string().refine((val) => {
	return !isNaN(Date.parse(val))
})

export const supabasePresentationSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	updated_at: timestampSchema,
})
