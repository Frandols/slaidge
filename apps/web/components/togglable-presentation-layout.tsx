'use client'

import clsx from 'clsx'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'

import { useToggling } from '@/contexts/toggling'

import { Button } from '@workspace/ui/components/button'

export default function TogglablePresentationLayout(
	props: React.PropsWithChildren
) {
	const toggling = useToggling()

	return (
		<div
			className={clsx(
				'grid grid-rows-[min-content_1fr] grid-cols-1 md:grid-rows-1 h-full overflow-auto relative',
				toggling.value ? 'md:grid-cols-1' : 'md:grid-cols-[auto_500px]'
			)}
		>
			{props.children}
		</div>
	)
}

export function ToggablePresentationLayoutAside(
	props: React.PropsWithChildren
) {
	const toggling = useToggling()

	return (
		<aside
			className={clsx(
				'border-l h-full overflow-auto block',
				toggling.value ? 'md:hidden' : 'md:block'
			)}
		>
			{props.children}
		</aside>
	)
}

export function ToggablePresentationLayoutToggler() {
	const toggling = useToggling()

	return (
		<Button
			className='hidden md:block'
			variant='outline'
			onClick={toggling.toggle}
		>
			{toggling.value ? <PanelRightOpen /> : <PanelRightClose />}
		</Button>
	)
}
