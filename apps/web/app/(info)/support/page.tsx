import { Button } from '@workspace/ui/components/button'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Support | Slaidge',
	description:
		'The app that allows you to make your presentations with artificial intelligence and simplified tools.',
}

export default function SupportPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Support</h1>
			<p className='leading-relaxed'>
				1. Support email: <b className='underline'>support@slaidge.com</b>
				<br />
				<br />
				<Link href={'https://discord.gg/QRXBubu2'}>
					<Button>
						Join Discord channel <ExternalLink />
					</Button>
				</Link>
			</p>
		</>
	)
}
