/**
 * Get user available scopes by access token.
 *
 * @param accessToken User's access token.
 * @returns A list of scopes.
 */
export default async function getUserScopes(accessToken: string) {
	const res = await fetch(
		`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
	)

	if (!res.ok) {
		throw new Error('INVALID_ACCESS_TOKEN')
	}

	const data: { scope: string } = await res.json()

	const scopes = data.scope?.split(' ') || []

	return scopes
}
