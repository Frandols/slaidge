import { z } from 'zod'

const googlePresentationSchema = z.object({
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

export default googlePresentationSchema
