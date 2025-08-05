/**
 * Get the email of a user.
 *
 * @param accessToken An access token.
 * @returns The user's email as a string.
 */
export default async function getUserEmail(
	accessToken: string
): Promise<string> {
	const response = await fetch(
		'https://www.googleapis.com/oauth2/v3/userinfo',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	if (!response.ok) {
		throw new Error('FAILED_TO_FETCH_USER_EMAIL')
	}

	const json = await response.json()

	if (typeof json.email !== 'string' || !json.email) {
		throw new Error('EMAIL_NOT_FOUND_IN_RESPONSE')
	}

	return json.email
}
