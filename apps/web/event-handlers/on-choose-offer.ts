'use client'

import { toast } from 'sonner'
import { z } from 'zod'

import createPreference from '@/actions/create-preference'
import offerIdSchema from '@/schemas/offerId'

/**
 * Triggered when a user chooses an offer.
 *
 * @param offerId ID of the offer.
 * @returns The MercadoPago preference.
 */
export default async function onChooseOffer(
	offerId: z.infer<typeof offerIdSchema>
) {
	try {
		await createPreference(offerId)
	} catch (error) {
		if (!(error instanceof Error)) return

		switch (error.message) {
			case 'INVALID_OFFER_ID':
				toast.error('La oferta seleccionada no es válida.')
				break
			default:
				toast.error('No se pudo inicializar la compra.')
		}
	}
}
