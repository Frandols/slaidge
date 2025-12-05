'use client'

import { CircleStop, Coins, Mic, MicOff, Paperclip, Send } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition'
import { toast } from 'sonner'

import { Button } from '@workspace/ui/components/button'
import { Textarea } from '@workspace/ui/components/textarea'
import { cn } from '@workspace/ui/lib/utils'

interface TypewriterTextareaProps
	extends React.ComponentProps<typeof Textarea> {
	placeholders?: string[]
}

interface PromptTextareaProps extends TypewriterTextareaProps {
	onSubmit?: (event?: { preventDefault?: () => void }) => void
	stoppable: boolean
	onStop: () => void
	creditBalance?: number
	onAttachFiles: (fileList: FileList) => void
	children?: React.ReactNode
}

export default function PromptTextarea({
	children,
	onSubmit,
	stoppable,
	onStop,
	className,
	creditBalance,
	onAttachFiles,
	disabled,
	...props
}: PromptTextareaProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const { transcript, listening, isMicrophoneAvailable } = useSpeechRecognition(
		{
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
		}
	)

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()

			stoppable ? onStop() : onSubmit?.()
		}
	}

	return (
		<div className='relative h-full'>
			<TypewriterTextarea
				placeholder='Escribe algo...'
				className={cn(
					className,
					'min-h-[100px] max-h-[250px] h-full pr-12 resize-none rounded-xl text-sm p-4 pb-12 shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none'
				)}
				onKeyDown={handleKeyDown}
				disabled={stoppable || disabled}
				ref={textareaRef as any}
				{...props}
			/>
			<div className='absolute bottom-0 left-0 w-full h-12 p-2 gap-2 flex justify-between'>
				<div className='w-full h-full truncate overflow-x-scroll flex gap-2'>
					<div>
						<input
							type='file'
							id='file-upload'
							className='hidden'
							onChange={(event) => {
								event.preventDefault()

								const files = event.target.files

								if (!files || files.length === 0) return

								onAttachFiles(files)
							}}
							multiple
						/>
						<label htmlFor='file-upload'>
							<Button
								variant='secondary'
								className='cursor-pointer h-full text-muted-foreground'
								asChild
							>
								<span>
									Attach
									<Paperclip />
								</span>
							</Button>
						</label>
					</div>
					{children}
					{creditBalance !== undefined ? (
						<p className='flex items-center bg-secondary p-2 text-sm rounded-md font-semibold text-muted-foreground'>
							<Coins
								className='inline mr-2 text-primary'
								size={16}
							/>
							{creditBalance}
						</p>
					) : null}
				</div>
				<Button
					type='button'
					variant='secondary'
					size='icon'
					className='rounded-md h-8 p-0'
					onClick={() => {
						if (!isMicrophoneAvailable) {
							toast.error('The mic is not available in this browser')

							return
						}

						SpeechRecognition[listening ? 'stopListening' : 'startListening']()
					}}
					disabled={disabled || stoppable}
				>
					{listening ? <MicOff /> : <Mic />}
				</Button>
				<Button
					type='submit'
					size={stoppable ? 'default' : 'icon'}
					className={cn(
						'rounded-md h-8 p-0 hover:bg-primary/90',
						stoppable
							? 'bg-destructive hover:bg-destructive/80 text-white'
							: 'bg-primary'
					)}
					onClick={stoppable ? onStop : onSubmit}
					disabled={(props.value === '' && !stoppable) || disabled}
				>
					{stoppable ? (
						<>
							<CircleStop className='h-4 w-4' />
							Parar
						</>
					) : (
						<Send className='h-4 w-4 text-black' />
					)}
				</Button>
			</div>
		</div>
	)
}

const TypewriterTextarea = React.forwardRef<
	HTMLTextAreaElement,
	TypewriterTextareaProps
>(({ placeholder = '', placeholders = [], ...rest }, ref) => {
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
			ref={ref as any}
			placeholder={displayedPlaceholder}
		/>
	)
})

TypewriterTextarea.displayName = 'TypewriterTextarea'
