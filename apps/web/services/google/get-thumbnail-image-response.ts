export default async function getThumbnailImageResponse(
	presentationId: string,
	slideId: string,
	accessToken: string
) {
	const thumbnailUrl = `https://slides.googleapis.com/v1/presentations/${presentationId}/pages/${slideId}/thumbnail?thumbnailProperties.mimeType=PNG&thumbnailProperties.thumbnailSize=LARGE`

	const response = await fetch(thumbnailUrl, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	if (!response.ok) throw new Error('FAILED_TO_FETCH_IMAGE')

	const data = await response.json()

	const signedThumbnailUrl = data.contentUrl

	const imageResponse = await fetch(signedThumbnailUrl)

	if (!imageResponse.ok) throw new Error('FAILED_TO_FETCH_SIGNED_IMAGE')

	return new Response(await imageResponse.arrayBuffer(), {
		status: 200,
		headers: {
			'Content-Type': imageResponse.headers.get('Content-Type') ?? 'image/png',
		},
	})
}
