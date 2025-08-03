'use client'

import { ArrowRight, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'

import offersData from '@/dictionaries/offers-data'
import offerIdSchema, {
	CREDITS_150,
	CREDITS_25,
	CREDITS_50,
} from '@/schemas/offer-id'
import { zodResolver } from '@hookform/resolvers/zod'

import createPreference from '@/actions/create-preference'
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
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'

const offerSchema = z.object({
	id: offerIdSchema,
})

interface BuyCreditsDialogProps extends React.ComponentProps<typeof Dialog> {
	currentCreditBalance: number
}

export default function BuyCreditsDialog(props: BuyCreditsDialogProps) {
	const [selectedAmount, setSelectedAmount] = useState<number>(50)

	const form = useForm({
		resolver: zodResolver(offerSchema),
		defaultValues: {
			id: CREDITS_50,
		},
	})

	const onSubmit = (offer: z.infer<typeof offerSchema>) => {
		createPreference(offer.id)
	}

	const onCheckOffer = (offerId: z.infer<typeof offerSchema>['id']) => {
		setSelectedAmount(offersData[offerId].amount)
	}

	return (
		<Dialog
			{...props}
			onOpenChange={(open) => {
				props.onOpenChange?.(open)

				if (!open) form.reset()
			}}
		>
			{props.children}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{props.currentCreditBalance > 0
							? 'Comprá créditos'
							: 'Te quedaste sin créditos'}
					</DialogTitle>
					<DialogDescription>
						{props.currentCreditBalance > 0
							? 'Adelantate y no te quedes sin poder editar tus presentaciones'
							: 'Adquirilos para poder seguir editando tus presentaciones'}
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className='grid gap-2 grid-cols-[repeat(3,_minmax(125px,_1fr))]'>
						<OfferRadioInput
							offer={{ id: CREDITS_50 }}
							label='50 créditos'
							description='Si te queda un buen trabajo por delante'
							trending
							onCheck={onCheckOffer}
						/>
						<OfferRadioInput
							offer={{ id: CREDITS_25 }}
							label='25 créditos'
							description='Ideal si necesitas terminar algo ya'
							onCheck={onCheckOffer}
						/>
						<OfferRadioInput
							offer={{ id: CREDITS_150 }}
							label='150 créditos'
							description='Para trabajos muy largos o equipos'
							onCheck={onCheckOffer}
						/>
					</form>
				</Form>
				<div className='border border-dashed p-2 rounded-md flex flex-col gap-1'>
					<p className='text-sm text-muted-foreground'>
						Tu balance despues de la carga será:{' '}
					</p>
					<p className='text-muted-foreground font-mono bg-accent p-1 rounded'>
						{props.currentCreditBalance} + {selectedAmount} ={' '}
						{(props.currentCreditBalance + selectedAmount).toFixed(2)}
					</p>
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant='outline'>Cancelar</Button>
					</DialogClose>
					<Button onClick={form.handleSubmit(onSubmit)}>
						Comprar créditos <ArrowRight />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

interface OfferRadioInputProps<T extends z.infer<typeof offerSchema>> {
	offer: T
	label: string
	description: string
	trending?: boolean
	onCheck: (checkedId: T['id']) => void
}

function OfferRadioInput<T extends z.infer<typeof offerSchema>>({
	trending = false,
	...props
}: OfferRadioInputProps<T>) {
	const form = useFormContext()

	return (
		<FormField
			control={form.control}
			name='id'
			render={({ field }) => (
				<FormItem className='grid grid-cols-[1rem_1fr] border rounded-md p-3'>
					<FormControl className='flex flex-row justify-start'>
						<Input
							className='h-min'
							type='radio'
							checked={field.value === props.offer.id}
							{...field}
							onChange={(event) => {
								const { checked } = event.currentTarget

								if (checked) {
									form.setValue('id', props.offer.id)
									props.onCheck(props.offer.id)
								}
							}}
						/>
					</FormControl>
					<div className='grid gap-1 grid-rows-[min-content_auto_min-content] font-normal'>
						<FormLabel className='font-medium'>{props.label}</FormLabel>
						<FormDescription className='text-muted-foreground text-xs leading-snug text-balance'>
							{props.description}
						</FormDescription>
						{trending ? (
							<div className='bg-green-200 border-green-700 rounded px-1 w-min mt-2'>
								<p className='text-green-700 text-[.75rem] truncate font-medium'>
									En tendencia{' '}
									<TrendingUp
										size={12}
										className='inline'
									/>
								</p>
							</div>
						) : null}
					</div>
				</FormItem>
			)}
		/>
	)
}
