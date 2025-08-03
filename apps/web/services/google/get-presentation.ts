import { APIPresentationSchema } from '@/schemas/presentation'
import APIToAppPresentationAdapter from '@/schemas/presentation/adapters/api-to-app'

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

export default async function getPresentation(
	id: string,
	accessToken: string
): Promise<Presentation> {
	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${id}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	const json = await response.json()

	const presentationParsing = APIPresentationSchema.safeParse(json)

	if (!presentationParsing.success) throw new Error('MALFORMED_PRESENTATION')

	const unadaptedPresentation = presentationParsing.data
	const adaptedPresentation: Presentation = APIToAppPresentationAdapter(
		unadaptedPresentation
	)

	return adaptedPresentation
}
