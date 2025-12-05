import FullSizeSkeleton from '@/components/full-size-skeleton'

export default function SlideLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='aspect-video max-w-[960px] md:min-w-[736px] w-full relative overflow-hidden rounded-2xl'>
			<FullSizeSkeleton />
			{children}
		</div>
	)
}
