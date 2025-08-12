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
	slideId: string
) {
	const lastEditionTime = useLastEditionTime()
	const [slideImage, setSlideImage] = useState<SlideImage>({
		status: 'loading',
	})

	useEffect(() => {
		getSlideImageBlob(presentationId, slideId, lastEditionTime.value).then(
			(blob) => {
				setSlideImage({ status: 'success', value: blob })
			}
		)
	}, [lastEditionTime.value])

	if (slideImage.status !== 'success') return null

	return URL.createObjectURL(slideImage.value)
}

async function getSlideImageBlob(
	presentationId: string,
	slideId: string,
	lastEditionTime: number
) {
	const id = `${presentationId}-${slideId}-${lastEditionTime}`
	const cache = await caches.open('slide_images')

	const cachedImage = await cache.match(id)

	if (cachedImage) return cachedImage.blob()

	const response = await fetch(
		`/api/presentations/${presentationId}/slides/${slideId}/thumbnail?version=${lastEditionTime}`
	)

	await cache.put(id, response.clone())

	return response.blob()
}
