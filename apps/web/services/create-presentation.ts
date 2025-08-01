'use client'

/**
 * Create a presentation using a natural language prompt.
 *
 * @param text The natural language prompt.
 * @param abortController Controller to abort the request.
 * @returns Presentation data.
 */
export default async function createPresentation(
	text: string,
	abortController: AbortController
) {
	const response = await fetch('/api/presentations', {
		method: 'POST',
		body: JSON.stringify({ prompt: text }),
		signal: abortController.signal,
	})

	const data = await response.json()

	if (response.status !== 201) throw new Error(data.error)

	return data as { presentationId: string }
}
