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

async function patchPresentation(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const accessToken = await requireAccessToken(request.cookies)

	const { id } = await params
	const body = await request.json()

	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${id}:batchUpdate`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requests: body.requests }),
		}
	)

	if (!response.ok) throw new Error('FAILED_TO_UPDATE_PRESENTATION')

	const supabase = await createSupabaseClient()
	await supabase
		.from('presentations')
		.update({ updated_at: new Date().toISOString() })
		.eq('id', id)

	return NextResponse.json({}, { status: 200 })
}

export const PATCH = await withNextResponseJsonError(patchPresentation)
