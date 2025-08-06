'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import deleteTokens from '@/utils/delete-tokens'

/**
 * Log out from app.
 */
export default async function logOut() {
	const cookieStore = await cookies()

	deleteTokens(cookieStore)

	redirect('/')
}
