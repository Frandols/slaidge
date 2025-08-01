import { z } from 'zod'

export const APIUserProfileSchema = z.object({
	sub: z.string().min(1),
	name: z.string().min(1),
	picture: z.string().min(1).url(),
})
