import { NextRequest, NextResponse } from 'next/server'

import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import getUserProfile from '@/services/google/get-user-profile'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'

async function getCreditBalance(request: NextRequest, _: { params: {} }) {
	const accessToken = await requireAccessToken(request.cookies)
	const userProfile = await getUserProfile(accessToken)
	const creditBalance = await getUserCreditBalance(userProfile.id)

	return NextResponse.json({ creditBalance }, { status: 200 })
}

export const GET = await withNextResponseJsonError(getCreditBalance)
