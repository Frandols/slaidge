'use server'

import { Preference } from 'mercadopago'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import mercadopago from '@/clients/mercadopago'
import offersData from '@/dictionaries/offers-data'
import requireAccessToken from '@/guards/require-access-token'
import offerIdSchema from '@/schemas/offer-id'
import getUserProfile from '@/services/google/get-user-profile'

const publicErrors = ['INVALID_OFFER_ID', 'UNAUTHENTICATED'] as const

/**
 * Create a MercadoPago preference.
 *
 * @param offerId Selected offer ID.
 */
export default async function createPreference(
	offerId: 'credits-25' | 'credits-50' | 'credits-150'
) {
	const parsing = offerIdSchema.safeParse(offerId)

	if (!parsing.success) return { error: 'INVALID_OFFER_ID' }

	const validOfferId = parsing.data

	const cookieStore = await cookies()
	const accessToken = await requireAccessToken(cookieStore).catch(() => null)

	if (accessToken === null) return { error: 'UNAUTHENTICATED' }

	const userProfile = await getUserProfile(accessToken)

	const preference = await new Preference(mercadopago).create({
		body: {
			items: [
				{
					id: validOfferId,
					title: `${offersData[validOfferId].amount} créditos en Slaidge para ${userProfile.name}`,
					quantity: 1,
					unit_price: offersData[validOfferId].price,
					currency_id: 'USD',
				},
			],
			metadata: {
				user_id: userProfile.id,
				offer_id: validOfferId,
			},
			back_urls: {
				success: process.env.NEXT_PUBLIC_SITE_URL,
				failure: process.env.NEXT_PUBLIC_SITE_URL,
				pending: process.env.NEXT_PUBLIC_SITE_URL,
			},
		},
	})

	redirect(preference.init_point!)
}
