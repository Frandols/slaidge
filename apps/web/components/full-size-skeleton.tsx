import { Skeleton } from '@workspace/ui/components/skeleton'
import { cn } from '@workspace/ui/lib/utils'

export default function FullSizeSkeleton({
	className,
	...props
}: React.ComponentProps<typeof Skeleton>) {
	return (
		<Skeleton
			className={cn(className, 'size-full absolute top-0 left-0')}
			{...props}
		/>
	)
}
