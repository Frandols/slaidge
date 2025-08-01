import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function LinkBadge({
	children,
	...props
}: React.ComponentProps<typeof Link> & React.PropsWithChildren) {
	return (
		<Link
			className='bg-accent rounded-full px-4 py-1 text-sm truncate text-muted-foreground'
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
