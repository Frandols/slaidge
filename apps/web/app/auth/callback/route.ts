import createSupabaseClient from '@/clients/factories/supabase'
import requireUserScopes from '@/guards/require-user-scopes'
import getUserEmail from '@/services/google/get-user-email'
import getUserProfile from '@/services/google/get-user-profile'
import { syncGoogleUser } from '@/services/supabase/sync-google-user'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

export async function GET(req: NextRequest) {
	const url = new URL(req.url)
	const code = url.searchParams.get('code')

	try {
		if (!code) throw new Error('CODE_NOT_FOUND')

		const { data: session, status } = await axios.post<{
			access_token: string
			refresh_token?: string
		}>(
			'https://oauth2.googleapis.com/token',
			{},
			{
				params: {
					client_id: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
					client_secret: GOOGLE_CLIENT_SECRET,
					code,
					redirect_uri: REDIRECT_URI,
					grant_type: 'authorization_code',
				},
				headers: { Accept: 'application/json' },
			}
		)

		await requireUserScopes(session.access_token, [
			'https://www.googleapis.com/auth/drive.file',
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		])

		await syncGoogleUser(session.access_token)

		const redirection = NextResponse.redirect(new URL('/', req.url))

		redirection.cookies.set('access_token', session.access_token, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60,
		})

		if (session.refresh_token) {
			redirection.cookies.set('refresh_token', session.refresh_token, {
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				path: '/',
				maxAge: 60 * 60 * 24 * 30,
			})
		}

		return redirection
	} catch (error) {
		if (!(error instanceof Error))
			return NextResponse.json({ error: 'UNKNOWN_ERROR' }, { status: 400 })

		return NextResponse.json({ error: error.message }, { status: 400 })
	}
}
