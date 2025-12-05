import { useEffect, useState } from 'react'

type SlideImage =
	| { status: 'error' | 'loading' }
	| {
			status: 'success'
			value: Blob
	  }

/**
 * Get the image URL of a slide.
 *
 * @param presentationId The ID of the presentation.
 * @param lastEditionTime The last edition time of the presentation.
 * @param slideId The ID of the slide. If not provided, the thumbnail of the first slide will be returned.
 * @returns The image URL of the slide, or null if the image is still loading or there was an error.
 */
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

	for (const request of await cache.keys()) {
		const key = request.url.split('/').pop() ?? ''

		if (
			key.startsWith(`${presentationId}${slideId ? `-${slideId}` : ''}-`) &&
			key !== id
		) {
			await cache.delete(request)
		}
	}

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
