'use server'

import createSupabaseClient from '@/clients/factories/supabase'
import z from 'zod'

const supabasePresentationSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	updated_at: z.string().refine((dateString) => {
		return !isNaN(Date.parse(dateString))
	}),
})

type PresentationsList = {
	id: string
	title: string
	updatedAt: string
}[]

/**
 * Get all presentations of a user.
 *
 * @param userId The user's ID.
 * @returns A PresentationsList array.
 */
export default async function getUserPresentations(
	userId: string
): Promise<PresentationsList> {
	const supabase = await createSupabaseClient()

	const { data } = await supabase
		.from('presentations')
		.select('id, title, updated_at')
		.eq('user_id', userId)
		.order('updated_at', { ascending: false })

	if (data === null) return []

	const adaptedPresentations = data.map((unparsedPresentation) => {
		const parsing = supabasePresentationSchema.safeParse(unparsedPresentation)

		if (!parsing.success) throw new Error('MALFORMED_PRESENTATION')

		const unadaptedPresentation = parsing.data

		const adaptedPresentation = {
			id: unadaptedPresentation.id,
			title: unadaptedPresentation.title,
			updatedAt: unadaptedPresentation.updated_at,
		}

		return adaptedPresentation
	})

	return adaptedPresentations
}
