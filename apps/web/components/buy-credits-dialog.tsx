'use client'

import offersData from '@/dictionaries/offers-data'
import offerIdSchema, {
	CREDITS_150,
	CREDITS_25,
	CREDITS_50,
} from '@/schemas/offer-id'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

import redirectToCheckout from '@/actions/redirect-to-checkout'
import { Button } from '@workspace/ui/components/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'

interface BuyCreditsDialogProps extends React.ComponentProps<typeof Dialog> {
	currentCreditBalance: number
}

export default function BuyCreditsDialog(props: BuyCreditsDialogProps) {
	const [selectedOfferId, setSelectedOfferId] =
		useState<z.infer<typeof offerIdSchema>>(CREDITS_50)

	const selectedAmount =
		offersData[selectedOfferId as keyof typeof offersData].amount

	const onSubmit = () => {
		redirectToCheckout(selectedOfferId)
	}

	return (
		<Dialog
			{...props}
			onOpenChange={(open) => {
				props.onOpenChange?.(open)

				if (!open) setSelectedOfferId(CREDITS_50)
			}}
		>
			{props.children}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{props.currentCreditBalance > 0
							? 'Buy credits'
							: 'You ran out of credits'}
					</DialogTitle>
					<DialogDescription>
						{props.currentCreditBalance > 0
							? "Get ahead and don't run out of edits for your presentations"
							: 'Purchase them to continue editing your presentations'}
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-2 grid-cols-[repeat(3,_minmax(125px,_1fr))]'>
					<OfferRadioInput
						offer={{ id: CREDITS_50 }}
						label='50 credits'
						description='If you have good work ahead'
						trending
						selectedId={selectedOfferId}
						onSelect={setSelectedOfferId}
					/>
					<OfferRadioInput
						offer={{ id: CREDITS_25 }}
						label='25 credits'
						description='Ideal if you need to finish something now'
						selectedId={selectedOfferId}
						onSelect={setSelectedOfferId}
					/>
					<OfferRadioInput
						offer={{ id: CREDITS_150 }}
						label='150 credits'
						description='For very long jobs or teams'
						selectedId={selectedOfferId}
						onSelect={setSelectedOfferId}
					/>
				</div>
				<div className='flex flex-col gap-1'>
					<p className='text-sm text-muted-foreground'>
						Your balance after the purchase will be:{' '}
					</p>
					<p className='text-muted-foreground font-mono bg-accent p-1 px-2 rounded'>
						{props.currentCreditBalance} + {selectedAmount} ={' '}
						{(props.currentCreditBalance + selectedAmount).toFixed(2)}
					</p>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>Cancel</Button>
					</DialogClose>
					<Button onClick={onSubmit}>
						Buy credits <ArrowRight />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

interface OfferRadioInputProps {
	offer: { id: z.infer<typeof offerIdSchema> }
	label: string
	description: string
	trending?: boolean
	selectedId: z.infer<typeof offerIdSchema>
	onSelect: (checkedId: z.infer<typeof offerIdSchema>) => void
}

function OfferRadioInput({ trending = false, ...props }: OfferRadioInputProps) {
	return (
		<div className='grid grid-cols-[1rem_1fr] border rounded-md p-3'>
			<div className='flex flex-row justify-start'>
				<Input
					className='h-min'
					type='radio'
					checked={props.selectedId === props.offer.id}
					onChange={(event) => {
						const { checked } = event.currentTarget

						if (checked) {
							props.onSelect(props.offer.id)
						}
					}}
				/>
			</div>
			<div className='grid gap-1 grid-rows-[min-content_auto_min-content] font-normal'>
				<label className='font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
					{props.label}
				</label>
				<p className='text-muted-foreground text-xs leading-snug text-balance'>
					{props.description}
				</p>
				{trending ? (
					<div className='bg-green-200 border-green-700 rounded px-1 w-min mt-2'>
						<p className='text-green-700 text-[.75rem] truncate font-medium'>
							Trending{' '}
							<TrendingUp
								size={12}
								className='inline'
							/>
						</p>
					</div>
				) : null}
			</div>
		</div>
	)
}
