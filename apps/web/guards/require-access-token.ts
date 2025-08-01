import { NextRequest } from 'next/server'

/**
 * Get user's access token.
 *
 * @returns The access token.
 */
export default async function requireAccessToken(
	cookies: Pick<NextRequest['cookies'], 'get'>
): Promise<string> {
	const accessToken = cookies.get('access_token')?.value

	if (accessToken) return accessToken

	throw new Error('UNAUTHENTICATED')
}
