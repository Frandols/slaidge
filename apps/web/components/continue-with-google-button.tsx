'use client'

import { Button } from '@workspace/ui/components/button'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'

export default function ContinueWithGoogleButton() {
	const { theme } = useTheme()

	const params = new URLSearchParams({
		client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
		redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL!}/auth/callback`,
		response_type: 'code',
		scope: [
			'https://www.googleapis.com/auth/drive.file',
			'https://www.googleapis.com/auth/userinfo.profile',
		].join(' '),
		access_type: 'offline',
		prompt: 'consent',
	})

	const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

	return (
		<Link href={url}>
			<Button
				variant='secondary'
				className='w-full flex items-center justify-center gap-2 border'
			>
				<Image
					src={theme === 'dark' ? '/google.svg' : '/google-dark.svg'}
					alt={`Google's logo`}
					width={16}
					height={16}
					unoptimized
				/>
				Continuar con Google
			</Button>
		</Link>
	)
}
