'use server'

import createSupabaseClient from '@/clients/factories/supabase'
import requireAccessToken from '@/guards/require-access-token'
import getUserProfile from '@/services/google/get-user-profile'
import { cookies } from 'next/headers'

/**
 * Send a feedback message.
 *
 * @param message The message.
 */
export default async function sendFeedback(message: string) {
	const cookieStore = await cookies()

	const accessToken = await requireAccessToken(cookieStore)

	const userProfile = await getUserProfile(accessToken)

	const supabase = await createSupabaseClient()

	const { error } = await supabase.from('feedback').insert([
		{
			message,
			user_id: userProfile.id,
		},
	])

	if (error) throw error
}
