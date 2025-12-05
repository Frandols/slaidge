import { Metadata } from 'next'

import BadgeLink from '@/components/badge-link'

export const metadata: Metadata = {
	title: 'No encontrado | Slaidge',
}

export default function NotFoundPage() {
	return (
		<section className='h-screen grid place-content-center'>
			<div className='flex flex-col gap-2 text-start px-4'>
				<p className='text-primary text-sm'>Lo sentimos...</p>
				<p className='text-2xl font-bold'>
					No encontramos lo que estabas buscando
				</p>
				<BadgeLink
					className='w-min'
					href='/'
				>
					Go back to home
				</BadgeLink>
			</div>
		</section>
	)
}
