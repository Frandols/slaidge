'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import sendFeedback from '@/actions/send-feedback'
import LinkBadge from '@/components/link-badge'
import Logo from '@/components/logo'
import UserMenu from '@/components/user-menu'

import { Button } from '@workspace/ui/components/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover'
import { Textarea } from '@workspace/ui/components/textarea'

interface PresentationHeaderProps {
	presentation?: {
		id: string
		title: string
	}
	user: {
		avatarUrl: string
		name: string
		creditBalance: {
			value: number
		}
	}
}

export default function PresentationsHeader(props: PresentationHeaderProps) {
	const onSubmitFeedback = async (message: string) => {
		try {
			await sendFeedback(message)

			toast('¡Feedback enviado! 🎉')
		} catch {
			toast.error('Error enviando el feedback, vuelve a intentarlo')

			throw new Error('FAILED_TO_SEND')
		}
	}

	return (
		<header className='h-14 border-b p-2 px-4 grid grid-cols-[1fr_auto] gap-4 justify-between'>
			<div className='flex gap-2 items-center justify-start min-w-0'>
				<Logo />
				<span className='text-muted-foreground hidden md:block'>/</span>
				{props.presentation ? (
					<>
						<Link
							href={'/presentations'}
							className='flex gap-2 items-center rounded-md md:hover:bg-accent/75 p-1 px-2'
						>
							<Image
								src={props.user.avatarUrl}
								alt={props.user.name}
								width={20}
								height={20}
								className='rounded-full min-w-[20px] min-h-[20px]'
								unoptimized
							/>
							<p className='text-muted-foreground hidden text-nowrap md:block'>
								Presentaciones de {props.user.name.split(' ')[0]}
							</p>
						</Link>
						<span className='text-muted-foreground'>/</span>
						<p className='text-muted-foreground truncate text-nowrap'>
							{props.presentation.title}
						</p>
						<LinkBadge
							href={`https://docs.google.com/presentation/d/${props.presentation.id}`}
							target='_blank'
						>
							Abrir en Google Slides
						</LinkBadge>
					</>
				) : (
					<div className='flex gap-2 items-center rounded-md p-1 px-2'>
						<Image
							src={props.user.avatarUrl}
							alt={props.user.name}
							width={20}
							height={20}
							className='rounded-full min-w-[20px] min-h-[20px]'
							unoptimized
						/>
						<p className='text-muted-foreground hidden text-nowrap md:block'>
							Presentaciones de {props.user.name.split(' ')[0]}
						</p>
					</div>
				)}
			</div>
			<div className='flex gap-2 items-center'>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant='outline'>Feedback</Button>
					</PopoverTrigger>
					<PopoverContent
						align='end'
						className='flex flex-col p-2 gap-2'
					>
						<FeedbackForm onSubmit={onSubmitFeedback} />
					</PopoverContent>
				</Popover>
				<Link
					href={'https://github.com/Frandols/slaidge'}
					target='_blank'
					rel='noreferrer'
				>
					<Button>
						<Image
							src='/github.svg'
							alt='GitHub logo'
							width={16}
							height={16}
							unoptimized
						/>
						GitHub
					</Button>
				</Link>
				<UserMenu
					name={props.user.name}
					avatar={props.user.avatarUrl}
					creditBalance={props.user.creditBalance.value}
				/>
			</div>
		</header>
	)
}

interface FeedbackFormProps {
	onSubmit: (message: string) => Promise<void>
}

function FeedbackForm(props: FeedbackFormProps) {
	const [message, setMessage] = useState<string>('')
	const [submitting, setSubmitting] = useState<boolean>(false)

	const onChangeTextarea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = event.currentTarget.value

		setMessage(newValue)
	}

	const isMessageValid = message !== ''

	const onClickButton = async () => {
		if (!isMessageValid) return

		setSubmitting(true)

		try {
			await props.onSubmit(message)

			setMessage('')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>
			<Textarea
				value={message}
				onChange={onChangeTextarea}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						event.preventDefault()

						onClickButton()
					}
				}}
			/>
			<Button
				className='self-end-safe'
				disabled={!isMessageValid || submitting}
				onClick={onClickButton}
			>
				{submitting ? (
					<>
						Enviando <Loader2 className='animate-spin' />
					</>
				) : (
					'Enviar'
				)}
			</Button>
		</>
	)
}
