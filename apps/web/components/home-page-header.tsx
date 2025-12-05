'use client'

import { Badge } from '@workspace/ui/components/badge'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip'
import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import BadgeLink from './badge-link'
import LogoLink from './logo-link'
import UserDropdownMenu from './user-dropdown-menu'

interface HomePageHeaderProps {
	userProfile: {
		creditBalance: number
		name: string
		avatarUrl: string
	} | null
}

export default function HomePageHeader(props: HomePageHeaderProps) {
	const [scrolled, setScrolled] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		if (scrolled === undefined) {
			setScrolled(window.scrollY > 0)
		}

		const handleScroll = () => {
			if (window.scrollY > 0 && scrolled) return

			setScrolled(window.scrollY > 0)
		}

		window.addEventListener('scroll', handleScroll)

		return () => window.removeEventListener('scroll', handleScroll)
	}, [scrolled])

	return (
		<header className='flex justify-center fixed top-0 left-0 w-full z-20 px-4'>
			<div
				className={clsx(
					'w-full mx-auto grid grid-cols-3 items-center overflow-hidden transition-[margin-top] duration-500 ease-in-out',
					scrolled
						? 'max-w-5xl bg-background/90 backdrop-blur-md rounded-full py-2.5 px-2 pl-4 md:px-4 mt-2.5 border'
						: 'max-w-7xl py-5 md:px-8'
				)}
			>
				<div className='flex gap-3 items-center justify-start'>
					<LogoLink />
					<h2 className='font-medium'>Slaidge</h2>
				</div>
				<nav className='flex justify-center'>
					<ul className='flex gap-6 items-center text-muted-foreground text-sm'>
						<li className='hover:underline hover:text-primary'>
							<Link href='#product'>Product</Link>
						</li>
						<li className='hover:underline hover:text-primary'>
							<Link href='#pricing'>Pricing</Link>
						</li>
						<li className='hover:underline hover:text-primary'>
							<Link href='#faq'>FAQ</Link>
						</li>
					</ul>
				</nav>
				<div className='flex justify-end'>
					{props.userProfile ? (
						<div className='grid place-content-center'>
							<UserDropdownMenu user={props.userProfile} />
						</div>
					) : (
						<div>
							<BadgeLink href={'/log-in'}>Ingresar</BadgeLink>
						</div>
					)}
				</div>
			</div>
		</header>
	)
}
