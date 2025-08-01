import { z } from 'zod'
import { APIUserProfileSchema } from '..'

interface UserProfile {
	id: string
	name: string
	avatarUrl: string
}

export default function APIToAppUserProfileAdapter(
	unadaptedUserProfile: z.infer<typeof APIUserProfileSchema>
): UserProfile {
	return {
		id: unadaptedUserProfile.sub,
		name: unadaptedUserProfile.name,
		avatarUrl: unadaptedUserProfile.picture,
	}
}
