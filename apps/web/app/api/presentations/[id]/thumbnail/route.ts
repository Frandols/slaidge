import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import getPresentation from '@/services/google/get-presentation'
import getThumbnailImageResponse from '@/services/google/get-thumbnail-image-response'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

async function getThumbnail(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const cookieStore = await cookies()

	const accessToken = await requireAccessToken(cookieStore)
	const { id } = await params

	const presentation = await getPresentation(id, accessToken)

	const firstSlide = presentation.slides[0]

	if (!firstSlide) throw new Error('FIRST_SLIDE_NOT_FOUND')

	return await getThumbnailImageResponse(id, firstSlide.id, accessToken)
}

export const GET = await withNextResponseJsonError(getThumbnail)
