import { generateObject } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

import AIUsageToCreditsUsed from '@/adapters/ai-usage-to-credits-used'
import prebuiltRequestsToAPIRequests from '@/adapters/prebuilt-requests-to-batch-update-requests'
import anthropic from '@/clients/anthropic'
import createSupabaseClient from '@/clients/factories/supabase'
import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import creator from '@/prompts/creator'
import prebuiltRequestsSchema from '@/schemas/prebuilt-requests'
import { APIPresentationSchema } from '@/schemas/presentation'
import themeSchema from '@/schemas/theme'
import getMaxOutputTokens from '@/services/anthropic/get-max-output-tokens'
import getUserProfile from '@/services/google/get-user-profile'
import updatePresentation from '@/services/google/update-presentation'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'
import getUserPresentations from '@/services/supabase/get-user-presentations'

async function postPresentation(request: NextRequest) {
	const accessToken = await requireAccessToken(request.cookies)

	const userProfile = await getUserProfile(accessToken)
	const userPresentations = await getUserPresentations(userProfile.id)
	const userCreditBalance = await getUserCreditBalance(userProfile.id)

	const userHasOnePresentationAtLeast = userPresentations.length > 0

	if (userHasOnePresentationAtLeast && userCreditBalance <= 0)
		throw new Error('NO_CREDITS')

	const { prompt } = await request.json()

	const generateObjectArgs = {
		model: anthropic('claude-4-sonnet-20250514'),
		system: creator,
		prompt,
		schema: z.object({
			title: z.string().min(1).describe('Title for the presentation'),
			update: prebuiltRequestsSchema,
			theme: themeSchema,
		}),
	}

	const maxTokens = await getMaxOutputTokens(
		[{ role: 'user', content: prompt }],
		generateObjectArgs.model.modelId,
		generateObjectArgs.system,
		[
			{
				name: 'schema',
				description: 'Generated object schema',
				input_schema: {
					...zodToJsonSchema(generateObjectArgs.schema, 'input_schema'),
					type: 'object',
				},
			},
		]
	)

	const { object, usage } = await generateObject({
		...generateObjectArgs,
		maxTokens,
	})

	const supabase = await createSupabaseClient()

	if (userHasOnePresentationAtLeast) {
		await supabase.rpc('insert_credit_usage', {
			user_id: userProfile.id,
			amount: AIUsageToCreditsUsed(usage),
		})
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
				title: object.title,
			}),
		}
	)

	if (!response.ok) throw new Error('FAILED_TO_CREATE_PRESENTATION')

	const json = await response.json()
	const parsing = APIPresentationSchema.safeParse(json)
	if (!parsing.success) throw new Error('MALFORMED_PRESENTATION')

	const presentation = parsing.data

	try {
		await updatePresentation(
			[
				{ deleteObject: { objectId: 'p' } },
				...prebuiltRequestsToAPIRequests(object.update.requests, object.theme),
			],
			presentation.presentationId,
			accessToken
		)

		const { error } = await supabase.from('presentations').insert({
			id: presentation.presentationId,
			user_id: userProfile.id,
			title: presentation.title,
			background_color: object.theme.colors.background,
			foreground_color: object.theme.colors.foreground,
			muted_foreground_color: object.theme.colors.mutedForeground,
			chart_colors: object.theme.colors.chart,
			serif_font: object.theme.fonts.serif,
			sans_serif_font: object.theme.fonts.sansSerif,
		})

		if (error) throw new Error('FAILED_TO_INSERT_PRESENTATION')

		return NextResponse.json(presentation, { status: 201 })
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

		throw error
	}
}

export const POST = await withNextResponseJsonError(postPresentation)
