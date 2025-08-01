import PresentationHeaderSkeleton from '@/components/presentation-header-skeleton'
import { PresentationItemSkeleton } from '@/components/presentation-item'

export default function PresentationsLoading() {
	return (
		<div className='grid grid-rows-[min-content_1fr] h-screen'>
			<PresentationHeaderSkeleton />
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4'>
				<PresentationItemSkeleton />
			</div>
		</div>
	)
}
