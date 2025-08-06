import getUserScopes from '@/services/google/get-user-scopes'

/**
 * Require scopes by access token.
 *
 * @param accessToken The access token.
 * @param scopes The required scopes array.
 */
export default async function requireUserScopes(
	accessToken: string,
	scopes: string[]
) {
	const userScopes = await getUserScopes(accessToken)

	if (scopes.some((scope) => !userScopes.includes(scope)))
		throw new Error('USER_MISSING_SCOPES')
}
