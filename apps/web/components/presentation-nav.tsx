'use client'

import Link from 'next/link'

import { useSlides } from '@/contexts/slides'
import FillerSkeleton from './filler-skeleton'
import Slide from './slide'

interface PresentationNavProps {
	presentationId: string
}

export default function PresentationNav(props: PresentationNavProps) {
	const slides = useSlides()

	return (
		<nav className='border-t z-10 p-4 flex gap-4 border-b md:border-b-0 bg-background overflow-auto'>
			{slides.value.map((slide) => (
				<Link
					key={slide.id}
					href={`/presentations/${props.presentationId}/${slide.id}`}
					className='h-full aspect-video relative hover:-translate-y-2 transition-transform rounded'
				>
					<FillerSkeleton />
					<Slide
						presentationId={props.presentationId}
						slideId={slide.id}
					/>
				</Link>
			))}
		</nav>
	)
}
