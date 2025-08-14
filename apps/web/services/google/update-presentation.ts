/**
 * Update a presentation using raw requests.
 *
 * @param requests Raw requests array.
 * @param presentationId The presentation's ID.
 * @param accessToken User's access token.
 * @returns An object with the response text and a success flag.
 */
export default async function updatePresentation(
	requests: unknown[],
	presentationId: string,
	accessToken: string
) {
	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requests }),
		}
	)

	return { success: response.ok, text: await response.text() }
}
