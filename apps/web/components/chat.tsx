'use client'

import { useCreditBalance } from '@/contexts/credit-balance'
import { useLastEditionTime } from '@/contexts/last-edition-time'
import { useSlides } from '@/contexts/slides'
import getCreditBalance from '@/services/get-credit-balance'
import getPresentation from '@/services/get-presentation'
import sanitizeText from '@/utils/sanitize-text'
import { Message, useChat } from '@ai-sdk/react'
import { Loader2Icon, Wrench } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import BuyCreditsDialog from './buy-credits-dialog'
import { Markdown } from './markdown'
import TextPrompt from './text-prompt'

const toolNames: Record<string, string> = {
	updatePresentation: 'Actualizar presentacion',
}

interface ChatProps extends React.PropsWithChildren {
	presentationId: string
}

export default function Chat(props: ChatProps) {
	const updatableCreditBalance = useCreditBalance()
	const lastEditionTime = useLastEditionTime()
	const slides = useSlides()

	const onFinishIncomingMessage = async (message: Message) => {
		const newCreditBalance = await getCreditBalance()

		updatableCreditBalance.update(newCreditBalance)

		if (!message.parts) return

		const invokedUpdatePresentation = message.parts.some(
			(part) =>
				part.type === 'tool-invocation' &&
				part.toolInvocation.toolName === 'updatePresentation'
		)

		if (!invokedUpdatePresentation) return

		toast.success('Se actualizó la presentación')
		lastEditionTime.update()
		const updatedPresentation = await getPresentation(props.presentationId)

		if (
			updatedPresentation.slides.some(
				(slide) =>
					!slides.value.some((currentSlide) => currentSlide.id === slide.id)
			)
		) {
			slides.update(updatedPresentation.slides)
		}
	}

	const apiURL = `/api/presentations/${props.presentationId}/chat`
	const creditBalance = updatableCreditBalance.value

	const messagesContainerRef = useRef<HTMLDivElement>(null)

	const { messages, input, handleInputChange, handleSubmit, status, stop } =
		useChat({
			api: apiURL,
			maxSteps: 2,
			onFinish(message) {
				if (message.role === 'user') return

				onFinishIncomingMessage(message)
			},
		})

	useEffect(() => {
		const messagesContainer = messagesContainerRef.current

		if (!messagesContainer) return

		messagesContainer.scroll({
			top: messagesContainer.scrollHeight,
			behavior: 'smooth',
		})
	}, [messages])

	return (
		<div className='grid grid-rows-[1fr_min-content] w-full h-full overflow-hidden bg-background'>
			<div
				ref={messagesContainerRef}
				className='flex flex-col px-4 pt-4 pb-12 overflow-y-scroll gap-6'
			>
				{props.children ? (
					props.children
				) : messages.length === 0 ? (
					<div className='h-full grid place-content-center text-center'>
						<p className='font-bold text-2xl'>¿En que te puedo ayudar?</p>
						<p className='text-muted-foreground'>Inicia la conversacion</p>
					</div>
				) : null}
				{messages.map((message) => {
					return (
						<div
							key={message.id}
							className='break-words whitespace-pre-wrap'
						>
							{message.role === 'user' ? (
								<div className='flex justify-end'>
									<p className='bg-secondary p-2 max-w-full px-4 rounded-md'>
										{message.content}
									</p>
								</div>
							) : (
								<>
									<SystemMessageMark />
									{message.parts.map((part, i) => {
										switch (part.type) {
											case 'text':
												return (
													<Markdown key={`${message.id}-${i}`}>
														{sanitizeText(part.text)}
													</Markdown>
												)
											case 'tool-invocation':
												const toolName =
													toolNames[part.toolInvocation.toolName] ||
													'Herramienta desconocida'

												return (
													<ToolInvocationMessage
														key={`${message.id}-${i}`}
														name={toolName}
														loading={part.toolInvocation.state !== 'result'}
													/>
												)
										}
									})}
								</>
							)}
						</div>
					)
				})}
			</div>
			<footer className='flex justify-center p-4 max-w-full w-full overflow-auto border-t'>
				<form
					onSubmit={handleSubmit}
					className='w-full'
				>
					<TextPrompt
						value={input}
						placeholder='Escribe algo...'
						onChange={handleInputChange}
						onSubmit={handleSubmit}
						showStop={status === 'streaming' || status === 'submitted'}
						onStop={stop}
						creditBalance={creditBalance}
					>
						{creditBalance !== undefined ? (
							<>
								<OpenOnNoCreditsBuyCreditsDialog
									key={creditBalance}
									currentCreditBalance={creditBalance}
									open
								/>
							</>
						) : null}
					</TextPrompt>
				</form>
			</footer>
		</div>
	)
}

function SystemMessageMark() {
	return (
		<div className='flex gap-2 items-center mb-2'>
			<Image
				src={'/logo.svg'}
				alt='Slaidge logo'
				width={20}
				height={20}
			/>
			<p className='font-semibold'>Slaidge</p>
		</div>
	)
}

interface ToolInvocationMessageProps {
	name: string
	loading: boolean
}

export function ToolInvocationMessage(props: ToolInvocationMessageProps) {
	return (
		<div className='border-b p-4 my-4'>
			<div className='flex items-center gap-4 text-sm text-muted-foreground'>
				<Wrench className='text-accent-foreground' />
				<span className='text-muted-foreground font-semibold'>
					{props.name}
				</span>
				{props.loading ? (
					<Loader2Icon className='ml-auto animate-spin' />
				) : null}
			</div>
		</div>
	)
}

function OpenOnNoCreditsBuyCreditsDialog(
	props: React.ComponentProps<typeof BuyCreditsDialog>
) {
	const [showDialog, setShowDialog] = useState<boolean>(
		props.currentCreditBalance <= 0
	)

	return (
		<BuyCreditsDialog
			{...props}
			open={props.open && showDialog}
			onOpenChange={(open) => {
				props.onOpenChange?.(open)

				if (!open) setShowDialog(false)
			}}
		/>
	)
}
