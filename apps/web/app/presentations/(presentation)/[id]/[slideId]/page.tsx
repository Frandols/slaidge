import Slide from '@/components/slide'

export default async function SlidePage({
	params,
}: {
	params: Promise<{ id: string; slideId: string }>
}) {
	const { id, slideId } = await params

	return (
		<Slide
			presentationId={id}
			slideId={slideId}
		/>
	)
}
