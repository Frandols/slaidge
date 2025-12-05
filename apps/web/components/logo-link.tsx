import { cn } from '@workspace/ui/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps extends Omit<React.ComponentProps<typeof Link>, 'href'> {
	size?: number
}

export default function LogoLink({
	size = 40,
	className,
	...props
}: LogoProps) {
	return (
		<Link
			className={cn(className, 'hidden md:block')}
			href={'/'}
			{...props}
		>
			<Image
				src='/logo.svg'
				alt='Slaidge logo'
				width={size}
				height={size}
				unoptimized
			/>
		</Link>
	)
}
