'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useLastEditionTime } from '@/contexts/last-edition-time'
import { useSlides } from '@/contexts/slides'
import FillerSkeleton from './filler-skeleton'

interface PresentationNavProps {
	presentationId: string
}

export default function PresentationNav(props: PresentationNavProps) {
	const slides = useSlides()
	const lastEditionTime = useLastEditionTime()

	return (
		<nav className='border-t z-10 p-4 flex gap-4 border-b md:border-b-0 bg-background overflow-auto'>
			{slides.value.map((slide) => (
				<Link
					key={slide.id}
					href={`${process.env.NEXT_PUBLIC_SITE_URL}/presentations/${props.presentationId}/${slide.id}`}
					className='h-full aspect-video relative hover:-translate-y-2 transition-transform rounded'
				>
					<FillerSkeleton />
					<Image
						src={`/api/presentations/${props.presentationId}/slides/${slide.id}/thumbnail?version=${lastEditionTime.value}`}
						alt={'Slide thumbnail'}
						layout='fill'
						className='rounded'
						unoptimized
					/>
				</Link>
			))}
		</nav>
	)
}
