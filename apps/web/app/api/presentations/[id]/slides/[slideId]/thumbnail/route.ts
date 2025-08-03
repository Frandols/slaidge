import { NextRequest, NextResponse } from 'next/server'

import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import getThumbnailImageResponse from '@/services/google/get-thumbnail-image-response'

async function getThumbnail(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string; slideId: string }> }
) {
	const accessToken = await requireAccessToken(request.cookies)

	const { id, slideId } = await params

	return await getThumbnailImageResponse(id, slideId, accessToken)
}

export const GET = await withNextResponseJsonError(getThumbnail)
