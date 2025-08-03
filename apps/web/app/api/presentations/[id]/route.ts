import { NextRequest, NextResponse } from 'next/server'

import createSupabaseClient from '@/clients/factories/supabase'
import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import { APIPresentationSchema } from '@/schemas/presentation'
import APIToAppPresentationAdapter from '@/schemas/presentation/adapters/api-to-app'

interface Presentation {
	id: string
	title: string
	pageSize: {
		width: number
		height: number
	}
	slides: {
		id: string
	}[]
}

export async function getPresentationById(
	id: string,
	accessToken: string
): Promise<Presentation> {
	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${id}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	const json = await response.json()

	const presentationParsing = APIPresentationSchema.safeParse(json)

	if (!presentationParsing.success) throw new Error('MALFORMED_PRESENTATION')

	const unadaptedPresentation = presentationParsing.data
	const adaptedPresentation: Presentation = APIToAppPresentationAdapter(
		unadaptedPresentation
	)

	return adaptedPresentation
}

async function getPresentation(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const accessToken = await requireAccessToken(request.cookies)

	const { id } = await params

	const presentation = await getPresentationById(id, accessToken)

	return NextResponse.json(presentation)
}

export const GET = await withNextResponseJsonError(getPresentation)

async function patchPresentation(
	request: NextRequest,
	{ params }: { params: { id: string } }
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
