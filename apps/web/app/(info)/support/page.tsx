import { Button } from '@workspace/ui/components/button'
import { ExternalLink } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Soporte | Slaidge',
	description:
		'La app que te permite hacer tus presentaciones con inteligencia artificial y herramientas simplificadas.',
}

export default function SupportPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Soporte</h1>
			<p className='leading-relaxed'>
				1. Correo electrónico de soporte:
				<br />
				support@slaidge.com
				<br />
				<br />
				2. Canal de Discord
				<br />
				<br />
				<Link href={'https://discord.gg/QRXBubu2'}>
					<Button>
						Unirse al canal de Discord <ExternalLink />
					</Button>
				</Link>
			</p>
		</>
	)
}
