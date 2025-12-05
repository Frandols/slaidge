import Slide from '@/components/slide'

export default async function SlidePage({
	params,
}: {
	params: Promise<{ id: string; slideId: string }>
}) {
	const { id: presentationId, slideId } = await params

	return (
		<Slide
			presentation={{
				id: presentationId,
			}}
			slide={{
				id: slideId,
			}}
		/>
	)
}
