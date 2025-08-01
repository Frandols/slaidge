import axios from 'axios'
import { cookies, headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export async function GET(request: NextRequest) {
	const cookieStore = await cookies()

	const refreshToken = cookieStore.get('refresh_token')
	const redirectPath = request.nextUrl.searchParams.get('redirect_path')

	try {
		if (!refreshToken) throw new Error('REFRESH_TOKEN_NOT_FOUND')

		const { data: session } = await axios.post<{
			access_token: string
			refresh_token: string
		}>(
			'https://oauth2.googleapis.com/token',
			{},
			{
				params: {
					client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
					client_secret: GOOGLE_CLIENT_SECRET,
					grant_type: 'refresh_token',
					refresh_token: refreshToken.value,
				},
				headers: { Accept: 'application/json' },
			}
		)

		cookieStore.set('access_token', session.access_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60,
		})

		if (session.refresh_token) {
			cookieStore.set('refresh_token', session.refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/api/access-tokens',
				maxAge: 60 * 60 * 24 * 30,
			})
		}

		const redirectUrl = new URL(redirectPath ?? '/', request.url)

		return NextResponse.redirect(redirectUrl)
	} catch {
		if (redirectPath && redirectPath.startsWith('/api'))
			return NextResponse.json({ error: 'UNAUTHENTICATED' })

		return NextResponse.redirect(new URL('/log-in', request.url))
	}
}
