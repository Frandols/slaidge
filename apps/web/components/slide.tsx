'use client'

import { useLastEditionTime } from '@/contexts/last-edition-time'
import Image from 'next/image'

interface SlideProps {
	url: string
}

export default function Slide(props: SlideProps) {
	const lastEditionTime = useLastEditionTime()

	return (
		<Image
			src={`${props.url}?version=${lastEditionTime.value}`}
			alt='Slide image'
			layout='fill'
			unoptimized
		/>
	)
}
