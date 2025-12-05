'use client'

import {
	PanelBottomClose,
	PanelBottomOpen,
	PanelRightClose,
	PanelRightOpen,
} from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'

export default function PresentationAside({
	className,
	children,
	...props
}: HTMLAttributes<HTMLElement>) {
	const [toggled, setToggled] = useState<boolean>(false)

	const toggle = () => {
		setToggled(!toggled)
	}

	return (
		<aside
			className={cn(
				className,
				'h-full grid grid-rows-[min-content_1fr] z-20 bg-background md:relative',
				toggled
					? 'absolute top-0 left-0 w-full'
					: 'md:grid-rows-1 relative border-l'
			)}
			{...props}
		>
			<div className='absolute top-0 -left-20 w-20 h-20 grid place-content-center z-20'>
				<div className='p-1'>
					<Button
						className='hidden md:block'
						variant='outline'
						onClick={toggle}
					>
						{toggled ? <PanelRightOpen /> : <PanelRightClose />}
					</Button>
				</div>
			</div>
			<Button
				className='w-full rounded-none flex md:hidden'
				variant={'ghost'}
				onClick={toggle}
			>
				{toggled ? <PanelBottomClose /> : <PanelBottomOpen />}
			</Button>
			<div
				className={cn(
					'border-t md:border-t-0 md:w-[499px] w-full',
					toggled ? 'md:hidden' : 'md:block'
				)}
			>
				{children}
			</div>
		</aside>
	)
}
