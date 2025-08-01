import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { getPresentationById } from '../route'
import { getThumbnailImageResponse } from '../slides/[slideId]/thumbnail/route'

async function getThumbnail(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const cookieStore = await cookies()

	const accessToken = await requireAccessToken(cookieStore)
	const { id } = await params

	const presentation = await getPresentationById(id, accessToken)

	const firstSlide = presentation.slides[0]

	if (!firstSlide) throw new Error('FIRST_SLIDE_NOT_FOUND')

	return await getThumbnailImageResponse(id, firstSlide.id, accessToken)
}

export const GET = await withNextResponseJsonError(getThumbnail)
