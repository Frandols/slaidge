'use server'

import createSupabaseClient from '@/clients/factories/supabase'

/**
 * Get a user's credit balance.
 *
 * @param userId The user's ID.
 * @returns The credit balance value.
 */
export default async function getUserCreditBalance(
	userId: string
): Promise<number> {
	const supabase = await createSupabaseClient()

	const { data, error } = await supabase.rpc('get_credit_balance', {
		user_id: userId,
	})

	if (error) throw new Error('ERROR_GETTING_CREDIT_BALANCE')

	return data
}
