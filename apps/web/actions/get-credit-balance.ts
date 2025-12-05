'use server'

import requireAccessToken from '@/guards/require-access-token'
import getUserProfile from '@/services/google/get-user-profile'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'
import { cookies } from 'next/headers'

export default async function getCreditBalance() {
	const cookieStore = await cookies()

	const accessToken = await requireAccessToken(cookieStore)

	const userProfile = await getUserProfile(accessToken)

	const creditBalance = await getUserCreditBalance(userProfile.id)

	return creditBalance
}
