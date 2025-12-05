'use client'

import getCreditBalance from '@/actions/get-credit-balance'
import BuyCreditsDialog from '@/components/buy-credits-dialog'
import FilesPopover from '@/components/files-popover'
import PromptTextarea from '@/components/prompt-textarea'
import { useCreditBalance } from '@/contexts/credit-balance'
import { useLastEditionTime } from '@/contexts/last-edition-time'
import { useSlides } from '@/contexts/slides'
import getPresentation from '@/services/get-presentation'
import { useChat } from '@ai-sdk/react'
import { cn } from '@workspace/ui/lib/utils'
import { DefaultChatTransport, UIMessage } from 'ai'
import {
	CircleCheckBig,
	CircleX,
	Loader2Icon,
	LucideProps,
	ScanSearch,
	SearchX,
	Wrench,
} from 'lucide-react'
import Image from 'next/image'
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Streamdown } from 'streamdown'

const toolsData: Record<
	string,
	{
		name: string
		icon: React.ForwardRefExoticComponent<
			Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
		>
	}
> = {
	updatePresentation: {
		name: 'Update presentation',
		icon: Wrench,
	},
	getPresentationProperty: {
		name: 'Access presentation',
		icon: ScanSearch,
	},
}

interface ChatProps extends HTMLAttributes<HTMLDivElement> {
	presentation: {
		id: string
	}
}

export default function Chat({
	presentation,
	className,
	children,
	...props
}: ChatProps) {
	const updatableCreditBalance = useCreditBalance()
	const lastEditionTime = useLastEditionTime()
	const slides = useSlides()

	const onFinishIncomingMessage = async (message: UIMessage) => {
		const newCreditBalance = await getCreditBalance()

		updatableCreditBalance.update(newCreditBalance)

		if (!message.parts) return

		const invokedUpdatePresentation = message.parts.some((part) => {
			const toolId = part.type.split('-')[1]

			return toolId === 'updatePresentation'
		})

		if (!invokedUpdatePresentation) return

		const updatedPresentation = await getPresentation(presentation.id)

		lastEditionTime.update(updatedPresentation.lastEditionTime)

		if (
			updatedPresentation.slides.some(
				(slide) =>
					!slides.value.some((currentSlide) => currentSlide.id === slide.id)
			)
		) {
			slides.update(updatedPresentation.slides)
			toast.success('Presentation updated')
		}
	}

	const apiURL = `/api/presentations/${presentation.id}/chat`
	const creditBalance = updatableCreditBalance.value

	const messagesContainerRef = useRef<HTMLDivElement>(null)

	const { messages, setMessages, sendMessage, status, stop } = useChat({
		experimental_throttle: 100,
		transport: new DefaultChatTransport({
			api: apiURL,
		}),
		onFinish({ message }) {
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
				case 'TOO_MANY_FILES':
					addMessage('You cannot send more than 5 files in a single message.')

					return
				case 'NO_CREDITS':
					addMessage(
						'You have no more credits, purchase more to continue interacting.'
					)

					return
				case 'INPUT_TOO_LARGE':
					addMessage('The message sent has a length that cannot be processed.')

					return
				default:
					addMessage('An unexpected error occurred, please try again later.')
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

	const [files, setFiles] = useState<FileList | undefined>(undefined)
	const [input, setInput] = useState('')

	return (
		<div
			className={cn(
				className,
				'grid grid-rows-[1fr_min-content] w-full h-full overflow-hidden bg-background'
			)}
			{...props}
		>
			<div
				ref={messagesContainerRef}
				className='flex flex-col px-4 pt-4 pb-12 overflow-y-scroll gap-6'
			>
				{children ? (
					children
				) : messages.length === 0 ? (
					<div className='h-full grid place-content-center text-center'>
						<p className='font-bold text-2xl'>What are we uploading today?</p>
						<p className='text-muted-foreground'>I&apos;ll do it for you</p>
					</div>
				) : null}
				{messages.map((message) => {
					return (
						<div
							key={message.id}
							className='break-words whitespace-pre-wrap'
						>
							{message.role === 'user' ? (
								<div className='flex flex-col items-end gap-2'>
									<div className='flex gap-2 items-end'>
										{message.parts.some((part) => part.type === 'file') ? (
											<FilesPopover
												files={message.parts
													.filter((part) => part.type === 'file')
													.map((file) => ({
														name: file.filename ?? 'Unnamed file',
														url: file.url,
														isImage: file.mediaType.startsWith('image/'),
													}))}
											/>
										) : null}
									</div>
									<p className='bg-secondary p-2 max-w-full px-4 rounded-md'>
										{message.parts.map((part, index) => {
											if (part.type === 'text') {
												return <span key={index}>{part.text}</span>
											}

											return null
										})}
									</p>
								</div>
							) : (
								<>
									<SystemMessageMark />
									{message.parts.map((part, i) => {
										if (part.type === 'text')
											return (
												<Streamdown key={`${message.id}-${i}`}>
													{part.text}
												</Streamdown>
											)

										if ('toolCallId' in part) {
											const toolId = part.type.split('-')[1]

											const fallbackData = {
												name: 'Unknown tool',
												icon: SearchX,
											}

											const toolData =
												toolId && toolId in toolsData
													? (toolsData[toolId] ?? fallbackData)
													: fallbackData

											return (
												<ToolInvocationMessage
													key={`${message.id}-${i}`}
													{...toolData}
													status={
														part.state !== 'output-available'
															? 'loading'
															: Object.hasOwn(part.output as object, 'error')
																? 'error'
																: 'success'
													}
												/>
											)
										}

										return null
									})}
								</>
							)}
						</div>
					)
				})}
			</div>
			<footer className='flex justify-center p-4 max-w-full w-full overflow-auto border-t relative'>
				<form
					className='w-full'
					onSubmit={(e) => e.preventDefault()}
				>
					<PromptTextarea
						value={input}
						placeholder='Type something...'
						onChange={(e) => setInput(e.target.value)}
						onSubmit={() => {
							sendMessage({ text: input, files })

							setFiles(undefined)
							setInput('')
						}}
						stoppable={status === 'streaming' || status === 'submitted'}
						onStop={stop}
						creditBalance={creditBalance}
						disabled={creditBalance <= 0}
						onAttachFiles={(newFiles) => {
							if (newFiles.length + files?.length! > 5) {
								toast.error(
									'You cannot send more than 5 files in a single message.'
								)

								return
							}

							const newFilesArray = Array.from(newFiles)
							const currentFilesArray = files ? Array.from(files) : []
							const dataTransfer = new DataTransfer()

							;[...newFilesArray, ...currentFilesArray].forEach((file) =>
								dataTransfer.items.add(file)
							)

							setFiles(dataTransfer.files)
						}}
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
						{files !== undefined ? (
							<FilesPopover
								files={Array.from(files).map((file) => ({
									name: file.name,
									url: URL.createObjectURL(file),
									isImage: file.type.startsWith('image/'),
								}))}
								onDeleteFile={(fileIndex) => {
									const newFilesArray = Array.from(files).filter(
										(_, currentFileIndex) => currentFileIndex !== fileIndex
									)

									if (newFilesArray.length === 0) {
										setFiles(undefined)

										return
									}

									const dataTransfer = new DataTransfer()

									newFilesArray.forEach((file) => dataTransfer.items.add(file))

									setFiles(dataTransfer.files)
								}}
							/>
						) : null}
					</PromptTextarea>
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
	icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
	>
}

export function ToolInvocationMessage(props: ToolInvocationMessageProps) {
	return (
		<div
			className={
				'border flex flex-col justify-between gap-4 p-4 m-4 rounded-lg min-w-[365px] max-w-[500px] flex-1 ' +
				'group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl ' +
				'bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] ' +
				'transform-gpu dark:bg-background dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ' +
				'border-ghost dark:[border:1px_solid_rgba(255,255,255,.1)]'
			}
		>
			<div className='flex items-center gap-4 justify-between text-sm text-muted-foreground'>
				<div className='flex items-center gap-4'>
					<props.icon className='text-muted-foreground' />
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
						Completed
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
