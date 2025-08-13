import axios from 'axios'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { syncGoogleUser } from '@/services/supabase/sync-google-user'
import deleteTokens from '@/utils/delete-tokens'

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export async function middleware(request: NextRequest) {
	const cookieStore = await cookies()

	const accessToken = cookieStore.get('access_token')?.value

	try {
		if (accessToken) throw new Error('UNNECESSARY_REFRESH')

		const refreshToken = cookieStore.get('refresh_token')?.value

		if (!refreshToken) throw new Error('REFRESH_TOKEN_NOT_FOUND')

		deleteTokens(cookieStore)

		const { data: session } = await axios.post<{
			access_token: string
			refresh_token?: string
		}>(
			'https://oauth2.googleapis.com/token',
			{},
			{
				params: {
					client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
					client_secret: GOOGLE_CLIENT_SECRET,
					grant_type: 'refresh_token',
					refresh_token: refreshToken,
				},
				headers: { Accept: 'application/json' },
			}
		)

		await syncGoogleUser(session.access_token)

		cookieStore.set('access_token', session.access_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60,
		})

		cookieStore.set('refresh_token', refreshToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
		})

		return NextResponse.redirect(new URL(request.nextUrl))
	} catch {
		return NextResponse.next()
	}
}

export const config = {
	matcher: ['/((?!auth|_next/static|_next/image|favicon.ico).*)'],
}
