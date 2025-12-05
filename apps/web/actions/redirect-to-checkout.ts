'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import polar from '@/clients/polar'
import requireAccessToken from '@/guards/require-access-token'
import offerIdSchema from '@/schemas/offer-id'
import getUserEmail from '@/services/google/get-user-email'
import getUserProfile from '@/services/google/get-user-profile'
import z from 'zod'

const offersProductIds: Record<z.infer<typeof offerIdSchema>, string> = {
	'credits-25': 'f70ce208-6730-4489-accf-d0557eb1bfe0',
	'credits-50': '32415726-29ff-484f-b8eb-667d84d63d22',
	'credits-150': 'cbb99a1b-68a4-4920-9898-da99097ebf4d',
}

/**
 * Redirect to Polar checkout.
 *
 * @param offerId Selected offer ID.
 */
export default async function redirectToCheckout(
	offerId: 'credits-25' | 'credits-50' | 'credits-150'
) {
	const parsing = offerIdSchema.safeParse(offerId)

	if (!parsing.success) return { error: 'INVALID_OFFER_ID' }

	const validOfferId = parsing.data

	const cookieStore = await cookies()
	const accessToken = await requireAccessToken(cookieStore).catch(() => null)

	if (accessToken === null) return { error: 'UNAUTHENTICATED' }

	const userProfile = await getUserProfile(accessToken)

	const checkout = await polar.checkouts.create({
		products: [offersProductIds[validOfferId]],
		metadata: {
			user_id: userProfile.id,
			offer_id: validOfferId,
		},
		customerEmail: await getUserEmail(accessToken),
	})

	redirect(checkout.url)
}
