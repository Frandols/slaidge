import { Webhooks } from '@polar-sh/nextjs'

import createSupabaseClient from '@/clients/factories/supabase'
import offersData from '@/dictionaries/offers-data'
import offerIdSchema from '@/schemas/offer-id'

export const POST = Webhooks({
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
	onPayload: async (payload) => {
		if (payload.type !== 'order.paid') return

		const { metadata } = payload.data

		const userId = metadata?.user_id

		if (!userId) throw new Error('USER_ID_NOT_FOUND_IN_PAYMENT_METADATA')

		const offerId = metadata?.offer_id

		if (!offerId) throw new Error('OFFER_ID_NOT_FOUND_IN_PAYMENT_METADATA')

		const offerIdParsing = offerIdSchema.safeParse(offerId)

		if (!offerIdParsing.success) throw new Error('INVALID_OFFER_ID')

		const validOfferId = offerIdParsing.data

		const creditsAmount = offersData[validOfferId].amount
		const supabase = await createSupabaseClient()

		const { error } = await supabase.rpc('insert_credit_purchase', {
			user_id: userId,
			amount: creditsAmount,
			payment_id: payload.data.id,
		})

		if (error) throw new Error('FAILED_TO_RECORD_CREDIT_PURCHASE')
	},
})
