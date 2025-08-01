import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
	size?: number
}

export default function Logo({ size = 40 }: LogoProps) {
	return (
		<Link
			className='hidden md:block'
			href={'/'}
		>
			<Image
				src='/logo.svg'
				alt='Slaidge logo'
				width={size}
				height={size}
			/>
		</Link>
	)
}
