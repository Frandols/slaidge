import createSupabaseClient from '@/clients/factories/supabase'
import googlePresentationSchema from '@/schemas/google/presentation'

interface Presentation {
	id: string
	title: string
	pageSize: {
		width: number
		height: number
	}
	slides: {
		id: string
	}[]
}

/**
 * Get a Google Slides presentation and its last edition time from Supabase.
 *
 * @param id The ID of the presentation.
 * @param accessToken The OAuth2 access token.
 * @returns The presentation and its last edition time.
 */
export default async function getPresentation(
	id: string,
	accessToken: string
): Promise<Presentation & { lastEditionTime: number }> {
	const [adaptedPresentation, lastEditionTime] = await Promise.all([
		(async () => {
			const response = await fetch(
				`https://slides.googleapis.com/v1/presentations/${id}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			if (response.status !== 200)
				throw new Error('FAILED_TO_FETCH_GOOGLE_PRESENTATION')

			const json = await response.json()

			const presentationParsing = googlePresentationSchema.safeParse(json)

			if (!presentationParsing.success)
				throw new Error('MALFORMED_PRESENTATION')

			const unadaptedPresentation = presentationParsing.data
			const adaptedPresentation: Presentation = {
				id: unadaptedPresentation.presentationId,
				title: unadaptedPresentation.title,
				pageSize: {
					width: unadaptedPresentation.pageSize.width.magnitude,
					height: unadaptedPresentation.pageSize.height.magnitude,
				},
				slides: unadaptedPresentation.slides.map((slide) => ({
					id: slide.objectId,
				})),
			}

			return adaptedPresentation
		})(),
		(async () => {
			const supabase = await createSupabaseClient()

			const { data, error } = await supabase
				.from('presentations')
				.select('updated_at')
				.eq('id', id)
				.single()

			if (error) throw new Error('FAILED_TO_FETCH_SUPABASE_PRESENTATION')

			return data.updated_at
		})(),
	])

	return { ...adaptedPresentation, lastEditionTime }
}
