import { Payment } from 'mercadopago'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import createSupabaseClient from '@/clients/factories/supabase'
import mercadopago from '@/clients/mercadopago'
import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import offersData from '@/dictionaries/offers-data'
import offerIdSchema from '@/schemas/offer-id'

const bodySchema = z.object({
	data: z.object({
		id: z.string().min(1),
	}),
})

async function postCreditPurchase(request: NextRequest) {
	const body = await request.json()
	const parsing = bodySchema.safeParse(body)

	if (!parsing.success) throw new Error('INVALID_REQUEST_BODY')

	const { data } = parsing.data
	const payment = await new Payment(mercadopago).get({ id: data.id })

	if (payment.status !== 'approved') throw new Error('PAYMENT_NOT_APPROVED')

	const userId = payment.metadata?.user_id

	if (!userId) throw new Error('USER_ID_NOT_FOUND_IN_PAYMENT_METADATA')

	const offerId = payment.metadata?.offer_id

	if (!offerId) throw new Error('OFFER_ID_NOT_FOUND_IN_PAYMENT_METADATA')

	const offerIdParsing = offerIdSchema.safeParse(offerId)

	if (!offerIdParsing.success) throw new Error('INVALID_OFFER_ID')

	const validOfferId = offerIdParsing.data
	const creditsAmount = offersData[validOfferId].amount
	const supabase = await createSupabaseClient()
	const { error } = await supabase.rpc('insert_credit_purchase', {
		user_id: userId,
		amount: creditsAmount,
		payment_id: payment.id,
	})

	if (error) throw new Error('FAILED_TO_RECORD_CREDIT_PURCHASE')

	return NextResponse.json(null, { status: 200 })
}

export const POST = await withNextResponseJsonError(postCreditPurchase)
