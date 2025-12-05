import z from 'zod'

const googleUserProfileSchema = z.object({
	sub: z.string().min(1),
	name: z.string().min(1),
	picture: z.string().min(1).url(),
})

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

	const parsing = googleUserProfileSchema.safeParse(json)

	if (!parsing.success) throw new Error('MALFORMED_USER_PROFILE')

	const unadaptedUserProfile = parsing.data

	const adaptedUserProfile = {
		id: unadaptedUserProfile.sub,
		name: unadaptedUserProfile.name,
		avatarUrl: unadaptedUserProfile.picture,
	}

	return adaptedUserProfile
}
