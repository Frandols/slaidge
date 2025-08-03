import { z } from 'zod'

import { supabasePresentationSchema } from '@/schemas/presentation'

interface PresentationItem {
	id: string
	title: string
	updatedAt: string
}

export default function supabaseToItemPresentationAdapter(
	unadaptedPresentation: z.infer<typeof supabasePresentationSchema>
): PresentationItem {
	const adaptedPresentation = {
		id: unadaptedPresentation.id,
		title: unadaptedPresentation.title,
		updatedAt: unadaptedPresentation.updated_at,
	}

	return adaptedPresentation
}
