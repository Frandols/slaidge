import { Button } from '@workspace/ui/components/button'
import clsx from 'clsx'
import { ArrowUp, CircleStop, Coins } from 'lucide-react'
import TypewriterTextarea from './typewriter-textarea'

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
	...props
}: TextPromptProps) {
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()

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
				disabled={showStop}
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
					type='submit'
					size={showStop ? 'default' : 'icon'}
					className={clsx(
						'rounded h-8 p-0 hover:bg-primary/90',
						showStop ? 'bg-destructive hover:bg-destructive/80' : 'bg-primary'
					)}
					onClick={showStop ? onStop : onSubmit}
					disabled={props.value === '' && !showStop}
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
