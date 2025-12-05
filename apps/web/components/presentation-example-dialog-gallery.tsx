'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@workspace/ui/lib/utils'

interface PresentationExampleDialogGalleryProps {
	id: string
	slideCount: number
}

export default function PresentationExampleDialogGallery(
	props: PresentationExampleDialogGalleryProps
) {
	const [slideId, setSlideId] = useState<number>(1)

	const isLastSlide = slideId === props.slideCount
	const isFirstSlide = slideId === 1

	const goNext = () => {
		if (isLastSlide) return

		setSlideId(slideId + 1)
	}

	const goPrevious = () => {
		if (isFirstSlide) return

		setSlideId(slideId - 1)
	}

	return (
		<>
			<img
				className='rounded-2xl w-full h-full'
				src={`/presentation_examples/${props.id}/${slideId}.webp`}
			/>
			<button
				onClick={goPrevious}
				className={cn(
					'absolute -bottom-16 left-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black',
					isFirstSlide ? 'opacity-50' : 'opacity-100'
				)}
			>
				<ChevronLeft />
			</button>
			<button
				onClick={goNext}
				className={cn(
					'absolute -bottom-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black',
					isLastSlide ? 'opacity-50' : 'opacity-100'
				)}
			>
				<ChevronRight />
			</button>
		</>
	)
}
