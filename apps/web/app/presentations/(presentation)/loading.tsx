import PresentationHeaderSkeleton from '@/components/presentation-header-skeleton'
import { Skeleton } from '@workspace/ui/components/skeleton'

export default async function PresentationLoading() {
	return (
		<div className='grid grid-rows-[min-content_1fr] h-screen'>
			<PresentationHeaderSkeleton />
			<div className='grid grid-rows-[min-content_1fr] grid-cols-1 md:grid-rows-1 h-full overflow-auto relative md:grid-cols-[auto_500px]'>
				<div className='grid grid-rows-[1fr_133px] overflow-auto'>
					<main className='p-4 overflow-hidden flex flex-col justify-center items-center relative'>
						<Skeleton className='aspect-video max-w-[960px] md:min-w-[736px] w-full rounded-2xl' />
					</main>
					<nav className='border-t z-10 p-4 flex gap-4 border-b md:border-b-0 bg-background overflow-auto'>
						{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
							<Skeleton
								key={index}
								className='h-full aspect-video rounded-xl relative hover:-translate-y-2 transition-transform'
							/>
						))}
					</nav>
				</div>
				<aside>
					<Skeleton className='w-full h-full rounded-none' />
				</aside>
			</div>
		</div>
	)
}
