import { NextRequest, NextResponse } from 'next/server'

/**
 * Redirect to get access token endpoint if unautheticated.
 *
 * @param handler Wrapped handler.
 * @param getRedirectPath Redirect path obtention strategy.
 * @returns Promise of Response.
 */
export default function withTokenRefreshIfUnauthenticated<T>(
	handler: (
		request: NextRequest,
		{ params }: { params: T }
	) => Promise<Response>,
	getRedirectPath: (params: T) => string
) {
	return async (request: NextRequest, context: { params: T }) => {
		try {
			return await handler(request, context)
		} catch (error) {
			if (!(error instanceof Error) || error.message !== 'UNAUTHENTICATED')
				throw error

			return NextResponse.redirect(
				new URL(
					`/api/access-tokens?redirect_path=${getRedirectPath(context.params)}`,
					request.url
				)
			)
		}
	}
}
