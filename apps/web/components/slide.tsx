'use client'

import Image from 'next/image'

import { useLastEditionTime } from '@/contexts/last-edition-time'
import useSlideImageSrc from '@/hooks/use-slide-image-src'
import { cn } from '@workspace/ui/lib/utils'
import React from 'react'

interface SlideProps
	extends Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> {
	presentation: {
		id: string
	}
	slide: {
		id: string
	}
}

export default function Slide({
	presentation,
	slide,
	className,
	...props
}: SlideProps) {
	const lastEditionTime = useLastEditionTime()
	const slideImageSrc = useSlideImageSrc(
		presentation.id,
		lastEditionTime.value,
		slide.id
	)

	if (slideImageSrc === null) return null

	return (
		<Image
			src={slideImageSrc}
			alt='Slide image'
			layout='fill'
			className={cn(className, 'rounded-xl')}
			unoptimized
			{...props}
		/>
	)
}
