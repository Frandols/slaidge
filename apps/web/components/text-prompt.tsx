import clsx from 'clsx'
import { ArrowUp, CircleStop, Coins, Mic, MicOff } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition'

import { Button } from '@workspace/ui/components/button'
import { Textarea } from '@workspace/ui/components/textarea'

interface TextPromptProps
	extends React.ComponentProps<typeof TypewriterTextarea> {
	onSubmit?: () => void
	showStop: boolean
	onStop: () => void
	creditBalance?: number
}

export default function TextPrompt({
	children,
	onSubmit,
	showStop,
	onStop,
	className,
	creditBalance,
	disabled,
	...props
}: TextPromptProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const { transcript, listening } = useSpeechRecognition({
		commands: [
			{
				command: '*',
				callback: () => {
					props.onChange?.({
						currentTarget: { value: transcript },
						target: { value: transcript },
					} as React.ChangeEvent<HTMLTextAreaElement>)

					if (!textareaRef.current) return

					textareaRef.current.focus()
				},
			},
		],
	})

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()

			showStop ? onStop() : onSubmit?.()
		}
	}

	return (
		<div className='relative h-full'>
			<TypewriterTextarea
				placeholder='Escribe algo...'
				className={clsx(
					'min-h-[100px] max-h-[250px] h-full pr-12 resize-none rounded-md text-sm p-4 pb-12 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none',
					className
				)}
				onKeyDown={handleKeyDown}
				disabled={showStop || disabled}
				ref={textareaRef}
				{...props}
			/>
			<div className='absolute bottom-0 left-0 w-full h-12 p-2 gap-2 flex justify-between'>
				<div className='w-full h-full truncate overflow-x-scroll flex gap-2'>
					{creditBalance !== undefined ? (
						<p className='flex items-center bg-accent p-2 text-sm rounded font-semibold text-muted-foreground'>
							<Coins
								className='inline mr-2 text-primary'
								size={16}
							/>
							{creditBalance}
						</p>
					) : null}
					{children}
				</div>
				<Button
					type='button'
					variant='secondary'
					size='icon'
					className='rounded h-8 p-0'
					onClick={() => {
						SpeechRecognition[listening ? 'stopListening' : 'startListening']()
					}}
					disabled={disabled || showStop}
				>
					{listening ? <MicOff /> : <Mic />}
				</Button>
				<Button
					type='submit'
					size={showStop ? 'default' : 'icon'}
					className={clsx(
						'rounded h-8 p-0 hover:bg-primary/90',
						showStop
							? 'bg-destructive hover:bg-destructive/80 text-white'
							: 'bg-primary'
					)}
					onClick={showStop ? onStop : onSubmit}
					disabled={(props.value === '' && !showStop) || disabled}
				>
					{showStop ? (
						<>
							<CircleStop className='h-4 w-4' />
							Parar
						</>
					) : (
						<ArrowUp className='h-4 w-4 text-black' />
					)}
				</Button>
			</div>
		</div>
	)
}

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
