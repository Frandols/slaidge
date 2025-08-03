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

	return await response.text()
}
