'use server'

import createSupabaseClient from '@/clients/factories/supabase'

/**
 * Send a feedback message.
 *
 * @param message The message.
 */
export default async function sendFeedback(message: string) {
	const supabase = await createSupabaseClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) throw new Error('UNAUTHENTICATED')

	const userId = user.id

	const { error } = await supabase.from('feedback').insert([
		{
			message,
			user_id: userId,
		},
	])

	if (error) throw error
}
