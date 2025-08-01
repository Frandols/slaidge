import { APIUserProfileSchema } from '@/schemas/user'
import APIToAppUserProfileAdapter from '@/schemas/user/adapters/api-to-app'

interface UserProfile {
	id: string
	name: string
	avatarUrl: string
}

/**
 * Get the profile data of a user.
 *
 * @param accessToken An access token.
 * @returns A UserProfile object.
 */
export default async function getUserProfile(
	accessToken: string
): Promise<UserProfile> {
	const response = await fetch(
		'https://www.googleapis.com/oauth2/v3/userinfo',
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)

	if (!response.ok) {
		throw new Error('FAILED_TO_FETCH_USER_PROFILE')
	}

	const json = await response.json()

	const parsing = APIUserProfileSchema.safeParse(json)

	if (!parsing.success) throw new Error('MALFORMED_USER_PROFILE')

	const unadaptedUserProfile = parsing.data

	const adaptedUserProfile = APIToAppUserProfileAdapter(unadaptedUserProfile)

	return adaptedUserProfile
}
