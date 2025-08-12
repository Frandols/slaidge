'use client'

import { Message, useChat } from '@ai-sdk/react'
import { CircleCheckBig, CircleX, Loader2Icon, Wrench } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import BuyCreditsDialog from '@/components/buy-credits-dialog'
import { Markdown } from '@/components/markdown'
import TextPrompt from '@/components/text-prompt'
import { useCreditBalance } from '@/contexts/credit-balance'
import { useLastEditionTime } from '@/contexts/last-edition-time'
import { useSlides } from '@/contexts/slides'
import getCreditBalance from '@/services/get-credit-balance'
import getPresentation from '@/services/get-presentation'
import sanitizeText from '@/utils/sanitize-text'

const toolNames: Record<string, string> = {
	updatePresentation: 'Actualizar la presentación',
	getPresentationProperty: 'Acceder a la presentación',
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
		const updatedPresentation = await getPresentation(props.presentationId)

		lastEditionTime.update(updatedPresentation.lastEditionTime)

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

	const {
		messages,
		setMessages,
		input,
		handleInputChange,
		handleSubmit,
		status,
		stop,
	} = useChat({
		api: apiURL,
		maxSteps: 2,
		onFinish(message) {
			if (message.role === 'user') return

			onFinishIncomingMessage(message)
		},
		onError(error) {
			const addMessage = (message: string) => {
				setMessages((messages) => [
					...messages,
					{
						id: `error-${Date.now()}`,
						role: 'assistant',
						content: message,
						parts: [
							{
								type: 'text',
								text: message,
							},
						],
					},
				])
			}

			switch (error.message) {
				case 'NO_CREDITS':
					addMessage(
						'No tenés mas créditos, adquirilos para seguir interactuando.'
					)

					return
				case 'INPUT_TOO_LARGE':
					addMessage(
						'El mensaje enviado tiene una longitud que no puede ser procesada.'
					)

					return
				default:
					addMessage(
						'Ocurrió un error inesperado, vuelve a intentarlo mas tarde.'
					)
			}
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
						<p className='font-bold text-2xl'>¿En qué te puedo ayudar?</p>
						<p className='text-muted-foreground'>Iniciá la conversación</p>
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
														status={
															part.toolInvocation.state !== 'result'
																? 'loading'
																: 'error' in part.toolInvocation.result
																	? 'error'
																	: 'success'
														}
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
						disabled={creditBalance <= 0}
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
				unoptimized
			/>
			<p className='font-semibold'>Slaidge</p>
		</div>
	)
}

interface ToolInvocationMessageProps {
	name: string
	status: 'loading' | 'success' | 'error'
}

export function ToolInvocationMessage(props: ToolInvocationMessageProps) {
	return (
		<div className='border rounded-md border-dashed p-4 my-4'>
			<div className='flex items-center gap-4 justify-between text-sm text-muted-foreground'>
				<div className='flex items-center gap-4'>
					<Wrench className='text-muted-foreground' />
					<span className='text-accent-foreground font-semibold'>
						{props.name}
					</span>
				</div>
				{props.status === 'loading' ? (
					<Loader2Icon className='ml-auto animate-spin' />
				) : null}
				{props.status === 'success' ? (
					<p className='flex items-center'>
						<CircleCheckBig
							size={16}
							className='text-green-500 inline mr-2'
						/>
						Completado
					</p>
				) : null}
				{props.status === 'error' ? (
					<p className='flex items-center'>
						<CircleX
							size={16}
							className='text-destructive inline mr-2'
						/>
						Error
					</p>
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
