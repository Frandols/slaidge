'use client'

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
 * Get a presentation.
 *
 * @param presentationId The presentation's ID.
 * @returns A Presentation object.
 */
export default async function getPresentation(
	presentationId: string
): Promise<Presentation> {
	const response = await fetch(`/api/presentations/${presentationId}`)

	const data = await response.json()

	const adaptedPresentation = data as Presentation

	return adaptedPresentation
}
