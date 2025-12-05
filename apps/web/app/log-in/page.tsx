import ContinueWithGoogleButton from '@/components/continue-with-google-button'
import requireAccessToken from '@/guards/require-access-token'
import { Separator } from '@workspace/ui/components/separator'
import { ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Connect your account | Slaidge',
	description:
		'Start every presentation with a smart data framework not an empty slide.',
}

async function isUserLoggedIn() {
	try {
		const cookieStore = await cookies()

		await requireAccessToken(cookieStore)

		return true
	} catch {
		return false
	}
}

export default async function LogInPage() {
	const isLoggedIn = await isUserLoggedIn()

	if (isLoggedIn) {
		return redirect('/presentations')
	}

	return (
		<main className='min-h-screen flex items-center justify-center'>
			<div className='rounded-2xl border p-4 flex flex-col gap-2 max-w-96'>
				<h1 className='text-2xl font-semibold'>Connect your account</h1>
				<p className='text-muted-foreground text-sm mb-2'>
					Connect with your Google account to start creating presentations
				</p>
				<ContinueWithGoogleButton />
				<Separator className='my-2' />
				<p className='text-muted-foreground text-sm'>
					Slaidge will create presentations for you and modify unique and
					exclusively those presentations that were created through the
					application.
				</p>
				<Link
					href={'/terms-and-conditions'}
					className='underline text-muted-foreground text-sm w-min text-nowrap'
				>
					Terms and conditions
					<ArrowRight
						className='inline ml-2'
						size={16}
					/>
				</Link>
			</div>
		</main>
	)
}
