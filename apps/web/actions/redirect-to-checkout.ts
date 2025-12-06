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
	'credits-25': '0bb00df5-ec83-44e0-bb53-4998721a2fb8',
	'credits-50': '3dde5497-92aa-4390-99cd-9d4730da9f83',
	'credits-150': '90be1713-b218-4c33-9a04-259a05915648',
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
