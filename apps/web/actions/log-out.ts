'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Log out from app.
 */
export default async function logOut() {
	const cookieStore = await cookies()

	cookieStore.delete('access_token')
	cookieStore.delete('refresh_token')

	redirect('/')
}
