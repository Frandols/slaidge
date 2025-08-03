import { NextRequest, NextResponse } from 'next/server'

export default async function withNextResponseJsonError<T>(
	handler: (request: NextRequest, context: T) => Promise<Response>
) {
	return async (request: NextRequest, context: T) => {
		try {
			return await handler(request, context)
		} catch (error) {
			if (!(error instanceof Error)) {
				return NextResponse.json({ error: 'UNKNOWN_ERROR' }, { status: 400 })
			}

			return NextResponse.json({ error: error.message }, { status: 400 })
		}
	}
}
