'use client'

import Image from 'next/image'

import useSlideImageSrc from '@/hooks/use-slide-image-src'

interface SlideProps {
	presentationId: string
	slideId: string
}

export default function Slide(props: SlideProps) {
	const slideImageSrc = useSlideImageSrc(props.presentationId, props.slideId)

	if (slideImageSrc === null) return null

	return (
		<Image
			src={slideImageSrc}
			alt='Slide image'
			layout='fill'
			className='rounded'
			unoptimized
		/>
	)
}
