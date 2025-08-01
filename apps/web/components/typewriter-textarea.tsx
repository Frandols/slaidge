import { Textarea } from '@workspace/ui/components/textarea'
import React, { useEffect, useRef, useState } from 'react'

interface TypewriterTextareaProps
	extends React.ComponentProps<typeof Textarea> {
	placeholders?: string[]
}

const TypewriterTextarea: React.FC<TypewriterTextareaProps> = ({
	placeholder = '',
	placeholders = [],
	...rest
}) => {
	const [displayedPlaceholder, setDisplayedPlaceholder] = useState(placeholder)
	const index = useRef(0)
	const subIndex = useRef(0)
	const direction = useRef<'forward' | 'backward'>('forward')

	useEffect(() => {
		if (placeholders.length === 0) {
			setDisplayedPlaceholder(placeholder)

			return
		}

		const current = placeholders[index.current]

		if (!current) return

		const interval = setInterval(
			() => {
				if (direction.current === 'forward') {
					subIndex.current++
					if (subIndex.current > current.length) {
						direction.current = 'backward'
					}
				} else {
					subIndex.current--
					if (subIndex.current < 0) {
						direction.current = 'forward'
						index.current = (index.current + 1) % placeholders.length
					}
				}

				if (subIndex.current === -1) return

				const nextText = current.slice(0, subIndex.current)

				setDisplayedPlaceholder(placeholder + nextText)
			},
			direction.current === 'forward' ? 80 : 30
		)

		return () => clearInterval(interval)
	}, [displayedPlaceholder, placeholder, placeholders])

	return (
		<Textarea
			{...rest}
			placeholder={displayedPlaceholder}
		/>
	)
}

export default TypewriterTextarea
