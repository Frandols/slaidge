import createSupabaseClient from '@/clients/factories/supabase'
import getUserEmail from '@/services/google/get-user-email'
import getUserProfile from '@/services/google/get-user-profile'

/**
 * Sync a Google-authenticated user with the Supabase 'users' table.
 *
 * @param accessToken The OAuth access token from Google.
 */
export async function syncGoogleUser(accessToken: string): Promise<void> {
	const [userProfile, userEmail] = await Promise.all([
		getUserProfile(accessToken),
		getUserEmail(accessToken),
	])

	const supabase = await createSupabaseClient()

	const { error } = await supabase.from('users').upsert([
		{
			id: userProfile.id,
			name: userProfile.name,
			email: userEmail,
			avatar_url: userProfile.avatarUrl,
		},
	])

	if (error) {
		throw new Error('FAILED_TO_SYNC_USER')
	}
}
