'use client'

import clsx from 'clsx'
import { Check } from 'lucide-react'

import createPreference from '@/actions/create-preference'
import { Button } from '@workspace/ui/components/button'
import { useState } from 'react'
import ConnectYourAccountDialog from './connect-your-account-dialog'

interface PricingCardProps {
	offerId: 'credits-25' | 'credits-50' | 'credits-150'
	title: string
	credits: number
	price: string
	description: string
	suggestion: string
	features: string[]
	variant: 'primary' | 'secondary' | 'ghost'
}

export default function PricingCard(props: PricingCardProps) {
	const [showDialog, setShowDialog] = useState<boolean>(false)

	const onClick = async () => {
		try {
			await createPreference(props.offerId)
		} catch (error) {
			console.log(error)

			if (!(error instanceof Error)) return

			if (error.message === 'UNAUTHENTICATED') setShowDialog(true)
		}
	}

	return (
		<>
			<ConnectYourAccountDialog
				open={showDialog}
				onOpenChange={(open) => {
					if (!open) setShowDialog(false)
				}}
			>
				Necesitamos poder asignar los créditos a tu identidad.
			</ConnectYourAccountDialog>
			<div
				className={clsx(
					'border border-dashed flex flex-col justify-between gap-4 p-4 rounded-lg min-w-[365px] max-w-[500px] flex-1',
					variantStyles[props.variant].border
				)}
			>
				<div className='flex flex-col'>
					<p
						className={clsx(
							'p-1 px-4 font-semibold rounded bg-accent w-min text-nowrap mb-4',
							variantStyles[props.variant].title.background,
							variantStyles[props.variant].title.text
						)}
					>
						{props.title}
					</p>
					<p className='text-2xl font-semibold mb-1'>
						{props.credits} créditos
					</p>
					<p className='text-3xl font-semibold mb-2'>{props.price}</p>
					<p className='text-muted-foreground mb-4'>{props.description}</p>
					<p className='text-sm p-1 bg-muted rounded text-nowrap'>
						✨ {props.suggestion}
					</p>
					<ul className='py-4 flex flex-col gap-2 text-sm mt-4'>
						{props.features.map((feature, index) => (
							<li key={index}>
								<p className='flex items-center gap-2'>
									<Check
										size={16}
										className='text-green-500 inline'
									/>
									{feature}
								</p>
							</li>
						))}
					</ul>
				</div>
				<Button
					onClick={onClick}
					className={clsx(
						variantStyles[props.variant].button.background,
						variantStyles[props.variant].button.text
					)}
				>
					Comprar créditos
				</Button>
			</div>
		</>
	)
}

const variantStyles = {
	primary: {
		border: 'border-primary',
		title: {
			background: 'bg-primary',
			text: 'text-black',
		},
		button: {
			background: 'bg-primary hover:bg-primary/80',
			text: 'text-black',
		},
	},
	secondary: {
		border: 'border-chart-5',
		title: {
			background: 'bg-chart-5',
			text: 'text-white',
		},
		button: {
			background: 'bg-chart-5 hover:bg-chart-5/80',
			text: 'text-white',
		},
	},
	ghost: {
		border: 'border-ghost',
		title: {
			background: 'bg-accent',
			text: 'text-accent-foreground',
		},
		button: {
			background: 'bg-accent hover:bg-accent/80',
			text: 'text-accent-foreground',
		},
	},
}
