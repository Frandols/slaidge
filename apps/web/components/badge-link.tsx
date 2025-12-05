import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@workspace/ui/lib/utils'

export default function BadgeLink({
	className,
	children,
	...props
}: React.ComponentProps<typeof Link>) {
	return (
		<Link
			className={cn(
				className,
				'bg-accent rounded-full px-4 py-1 text-sm truncate text-muted-foreground'
			)}
			{...props}
		>
			{children}{' '}
			<ArrowRight
				className='inline'
				size={16}
			/>
		</Link>
	)
}
