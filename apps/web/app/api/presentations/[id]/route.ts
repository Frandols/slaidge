import { NextRequest, NextResponse } from 'next/server'

import createSupabaseClient from '@/clients/factories/supabase'
import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import getPresentation from '@/services/google/get-presentation'

export const GET = await withNextResponseJsonError(
	async (
		request: NextRequest,
		{ params }: { params: Promise<{ id: string }> }
	) => {
		const accessToken = await requireAccessToken(request.cookies)

		const { id } = await params

		const presentation = await getPresentation(id, accessToken)

		return NextResponse.json(presentation)
	}
)
