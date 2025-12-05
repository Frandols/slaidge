'use client'

import { ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { HTMLAttributes, useState } from 'react'
import { toast } from 'sonner'

import sendFeedback from '@/actions/send-feedback'
import BadgeLink from '@/components/badge-link'
import LogoLink from '@/components/logo-link'
import UserDropdownMenu from '@/components/user-dropdown-menu'

import { Button } from '@workspace/ui/components/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover'
import { Textarea } from '@workspace/ui/components/textarea'
import { cn } from '@workspace/ui/lib/utils'

interface PresentationsHeaderProps extends HTMLAttributes<HTMLElement> {
	presentation?: {
		id: string
		title: string
	}
	user: {
		avatarUrl: string
		name: string
		creditBalance: number
	}
}

export default function PresentationsHeader({
	presentation,
	user,
	className,
	children,
	...props
}: PresentationsHeaderProps) {
	const onSubmitFeedback = async (message: string) => {
		try {
			await sendFeedback(message)

			toast('Feedback sent! 🎉')
		} catch {
			toast.error('Error sending feedback, try again')

			throw new Error('FAILED_TO_SEND')
		}
	}

	return (
		<header
			className={cn(
				className,
				'h-14 border-b p-2 px-4 grid grid-cols-[1fr_auto] gap-4 justify-between'
			)}
			{...props}
		>
			<div className='flex gap-2 items-center justify-start min-w-0'>
				<LogoLink />
				{presentation ? (
					<>
						<div className='hidden sm:flex items-center min-w-0'>
							<Link
								href={'/presentations'}
								className='flex gap-2 items-center p-1 px-2 hover:underline text-muted-foreground'
							>
								<Image
									src={user.avatarUrl}
									alt={user.name}
									width={20}
									height={20}
									className='rounded-full min-w-[20px] min-h-[20px]'
									unoptimized
								/>
								<p className='hidden text-nowrap md:block'>
									{user.name.split(' ')[0]}&apos;s presentations
								</p>
							</Link>
							<ArrowRight
								className='text-muted-foreground'
								size={16}
							/>
							<p className='text-muted-foreground truncate text-nowrap px-2'>
								{presentation.title}
							</p>
						</div>
						<BadgeLink
							href={`https://docs.google.com/presentation/d/${presentation.id}`}
							target='_blank'
						>
							Open in Google Slides
						</BadgeLink>
					</>
				) : (
					<div className='flex gap-2 items-center rounded-md p-1 px-2'>
						<Image
							src={user.avatarUrl}
							alt={user.name}
							width={20}
							height={20}
							className='rounded-full min-w-[20px] min-h-[20px]'
							unoptimized
						/>
						<p className='text-muted-foreground hidden text-nowrap md:block'>
							{user.name.split(' ')[0]}&apos;s presentations
						</p>
					</div>
				)}
			</div>
			<div className='flex gap-2 items-center'>
				{children}
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
					className='hidden sm:block'
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
				<UserDropdownMenu user={user} />
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
