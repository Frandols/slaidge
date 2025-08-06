import getUserScopes from '@/services/google/get-user-scopes'

export default async function requiredUserScopes(
	accessToken: string,
	scopes: string[]
) {
	const userScopes = await getUserScopes(accessToken)

	if (scopes.some((scope) => !userScopes.includes(scope)))
		throw new Error('USER_MISSING_SCOPES')
}
