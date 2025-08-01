import Slide from '@/components/slide'

export default async function SlidePage({
	params,
}: {
	params: Promise<{ id: string; slideId: string }>
}) {
	const { id, slideId } = await params

	const url = `/api/presentations/${id}/slides/${slideId}/thumbnail`

	return <Slide url={url} />
}
