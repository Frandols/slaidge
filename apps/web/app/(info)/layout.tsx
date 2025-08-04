import { Button } from '@workspace/ui/components/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LegalLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='bg-background min-h-dvh'>
			<header className='max-w-3xl mx-auto py-5 px-8 flex gap-2 justify-between'>
				<Link href='/'>
					<Button variant='outline'>
						<ArrowLeft />
						Volver
					</Button>
				</Link>
			</header>
			<main className='max-w-3xl mx-auto py-8 px-8 flex flex-col items-center pb-24 items-start'>
				{children}
			</main>
		</div>
	)
}
