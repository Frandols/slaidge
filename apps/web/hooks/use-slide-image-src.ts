import { useEffect, useState } from 'react'

import { useLastEditionTime } from '@/contexts/last-edition-time'

type SlideImage =
	| { status: 'error' | 'loading' }
	| {
			status: 'success'
			value: Blob
	  }

export default function useSlideImageSrc(
	presentationId: string,
	lastEditionTime: number,
	slideId?: string
) {
	const [slideImage, setSlideImage] = useState<SlideImage>({
		status: 'loading',
	})

	useEffect(() => {
		getSlideImageBlob(presentationId, lastEditionTime, slideId).then((blob) => {
			setSlideImage({ status: 'success', value: blob })
		})
	}, [lastEditionTime])

	if (slideImage.status !== 'success') return null

	return URL.createObjectURL(slideImage.value)
}

async function getSlideImageBlob(
	presentationId: string,
	lastEditionTime: number,
	slideId?: string
) {
	const id = slideId
		? `${presentationId}-${slideId}-${lastEditionTime}`
		: `${presentationId}-${lastEditionTime}`
	const cache = await caches.open('slide_images')

	const cachedImage = await cache.match(id)

	if (cachedImage) return cachedImage.blob()

	const response = await fetch(
		slideId
			? `/api/presentations/${presentationId}/slides/${slideId}/thumbnail?version=${lastEditionTime}`
			: `/api/presentations/${presentationId}/thumbnail?version=${lastEditionTime}`
	)

	await cache.put(id, response.clone())

	return response.blob()
}
