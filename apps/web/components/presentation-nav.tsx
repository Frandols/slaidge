'use client'

import Link from 'next/link'
import { HTMLAttributes } from 'react'

import FullSizeSkeleton from '@/components/full-size-skeleton'
import Slide from '@/components/slide'
import { useSlides } from '@/contexts/slides'

import { cn } from '@workspace/ui/lib/utils'

interface PresentationNavProps extends HTMLAttributes<HTMLElement> {
	presentation: {
		id: string
	}
}

export default function PresentationNav({
	presentation,
	className,
	children,
	...props
}: PresentationNavProps) {
	const slides = useSlides()

	return (
		<nav
			className={cn(
				className,
				'border-t z-10 p-4 flex gap-4 border-b md:border-b-0 bg-background overflow-auto'
			)}
			{...props}
		>
			{slides.value.map((slide) => (
				<Link
					key={slide.id}
					href={`/presentations/${presentation.id}/${slide.id}`}
					className='h-full aspect-video relative hover:-translate-y-2 transition-transform'
				>
					<FullSizeSkeleton className='rounded-xl' />
					<Slide
						presentation={{
							id: presentation.id,
						}}
						slide={{
							id: slide.id,
						}}
					/>
				</Link>
			))}
			{children}
		</nav>
	)
}
