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
export default async function getPresentation(presentationId: string): Promise<
	Presentation & {
		lastEditionTime: number
	}
> {
	const response = await fetch(`/api/presentations/${presentationId}`)

	const json = (await response.json()) as Presentation & {
		lastEditionTime: number
	}

	return json
}
