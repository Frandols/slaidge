'use client'

import { useLastEditionTime } from '@/contexts/last-edition-time'
import Image from 'next/image'
import FillerSkeleton from './filler-skeleton'

interface SlideProps {
	url: string
}

export default function Slide(props: SlideProps) {
	const lastEditionTime = useLastEditionTime()

	return (
		<div className='aspect-video max-w-[960px] md:min-w-[736px] w-full relative overflow-hidden rounded-2xl border'>
			<FillerSkeleton />
			<Image
				src={`${props.url}?=${lastEditionTime.value}`}
				alt='Slide image'
				layout='fill'
			/>
		</div>
	)
}
