import { APIPresentationSchema } from '@/schemas/presentation'
import { z } from 'zod'

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

export default function APIToAppPresentationAdapter(
	unadaptedPresentation: z.infer<typeof APIPresentationSchema>
): Presentation {
	const adaptedPresentation = {
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
}
