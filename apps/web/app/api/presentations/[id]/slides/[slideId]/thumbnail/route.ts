import { NextRequest, NextResponse } from 'next/server'

import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'

export async function getThumbnailImageResponse(
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

async function getThumbnail(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string; slideId: string }> }
) {
	const accessToken = await requireAccessToken(request.cookies)

	const { id, slideId } = await params

	return await getThumbnailImageResponse(id, slideId, accessToken)
}

export const GET = await withNextResponseJsonError(getThumbnail)
