'use client'

import { Button } from '@workspace/ui/components/button'
import Image from 'next/image'
import Link from 'next/link'

export default function ContinueWithGoogleButton() {
	const params = new URLSearchParams({
		client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
		redirect_uri: process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI!,
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
					src='/google.svg'
					alt='GitHub logo'
					width={16}
					height={16}
				/>
				Continuar con Google
			</Button>
		</Link>
	)
}
