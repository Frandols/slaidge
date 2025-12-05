'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'

import createSupabaseClient from '@/clients/factories/supabase'
import { SANS_SERIF_FONTS, SERIF_FONTS } from '@/constants/fonts'
import googlePresentationSchema from '@/schemas/google/presentation'
import createSectionOpeningSlide from '@/schemas/template-requests/create-section-opening-slide'
import themeSchema from '@/schemas/theme'
import getUserProfile from '@/services/google/get-user-profile'
import updatePresentation from '@/services/google/update-presentation'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'

const createPresentationSchema = z.object({
	title: z.string().min(1),
	subtitle: z.string().optional(),
	theme: themeSchema,
})

export type CreatePresentationResult =
	| {
			type: 'success'
			presentation: z.infer<typeof googlePresentationSchema>
	  }
	| {
			type: 'error'
			error: string
	  }

/**
 * Creates a new presentation with the given title, subtitle, and theme.
 *
 * @param title - The title of the presentation.
 * @param subtitle - The subtitle of the presentation.
 * @param theme - The theme configuration.
 * @returns A promise resolving to the result of the operation.
 */
export async function createPresentation(
	title: string,
	subtitle: string,
	theme: z.infer<typeof themeSchema>
): Promise<CreatePresentationResult> {
	try {
		const cookieStore = await cookies()
		const accessToken = cookieStore.get('access_token')?.value

		if (!accessToken) {
			return { type: 'error', error: 'UNAUTHENTICATED' }
		}

		const parsing = createPresentationSchema.safeParse({
			title,
			subtitle,
			theme,
		})

		if (!parsing.success) {
			return { type: 'error', error: 'INVALID_INPUT' }
		}

		if (!SERIF_FONTS.includes(theme.fonts.serif)) {
			return { type: 'error', error: 'INVALID_SERIF_FONT' }
		}

		if (!SANS_SERIF_FONTS.includes(theme.fonts.sansSerif)) {
			return { type: 'error', error: 'INVALID_SANS_SERIF_FONT' }
		}

		const userProfile = await getUserProfile(accessToken)
		const userCreditBalance = await getUserCreditBalance(userProfile.id)

		if (userCreditBalance <= 0) {
			return { type: 'error', error: 'NO_CREDITS' }
		}

		const response = await fetch(
			'https://slides.googleapis.com/v1/presentations',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
				}),
			}
		)

		if (!response.ok) {
			return { type: 'error', error: 'FAILED_TO_CREATE_PRESENTATION' }
		}

		const json = await response.json()
		const presentationParsing = googlePresentationSchema.safeParse(json)

		if (!presentationParsing.success) {
			return { type: 'error', error: 'MALFORMED_PRESENTATION' }
		}

		const presentation = presentationParsing.data

		try {
			const slideId = crypto.randomUUID()
			const titleId = crypto.randomUUID()
			const subtitleId = crypto.randomUUID()

			const requests = createSectionOpeningSlide(
				{
					id: slideId,
					title: { id: titleId, content: title },
					subtitle: subtitle
						? { id: subtitleId, content: subtitle }
						: undefined,
				},
				theme,
				presentation.presentationId
			)

			const { success } = await updatePresentation(
				[{ deleteObject: { objectId: 'p' } }, ...requests],
				presentation.presentationId,
				accessToken
			)

			if (!success) throw new Error('FAILED_TO_UPDATE_PRESENTATION')

			const supabase = await createSupabaseClient()

			const { error } = await supabase.from('presentations').insert({
				id: presentation.presentationId,
				user_id: userProfile.id,
				title: presentation.title,
				background_color: theme.colors.background,
				foreground_color: theme.colors.foreground,
				muted_foreground_color: theme.colors.mutedForeground,
				chart_colors: theme.colors.chart,
				serif_font: theme.fonts.serif,
				sans_serif_font: theme.fonts.sansSerif,
			})

			if (error) throw new Error('FAILED_TO_INSERT_PRESENTATION')

			return { type: 'success', presentation }
		} catch (error) {
			await fetch(
				`https://slides.googleapis.com/v1/presentations/${presentation.presentationId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)

			if (error instanceof Error) {
				return { type: 'error', error: error.message }
			}
			return { type: 'error', error: 'UNKNOWN_ERROR' }
		}
	} catch (error) {
		console.error('Create Presentation Action Error:', error)
		return { type: 'error', error: 'INTERNAL_SERVER_ERROR' }
	}
}
