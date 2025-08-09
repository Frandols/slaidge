import { streamText } from 'ai'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

import AIUsageToCreditsUsed from '@/adapters/ai-usage-to-credits-used'
import prebuiltRequestsToAPIRequests from '@/adapters/prebuilt-requests-to-batch-update-requests'
import anthropic from '@/clients/anthropic'
import createSupabaseClient from '@/clients/factories/supabase'
import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import guidelines from '@/prompts/guidelines'
import prebuiltRequestsSchema from '@/schemas/prebuilt-requests'
import getMaxOutputTokens from '@/services/anthropic/get-max-output-tokens'
import getUserProfile from '@/services/google/get-user-profile'
import updatePresentation from '@/services/google/update-presentation'
import { getPresentationTheme } from '@/services/supabase/get-presentation-theme'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'

async function usePrebuiltRequests(
	args: z.infer<typeof prebuiltRequestsSchema>,
	presentationId: string,
	accessToken: string
) {
	const theme = await getPresentationTheme(presentationId)

	const batchUpdateRequests = prebuiltRequestsToAPIRequests(
		args.requests,
		theme
	)

	return await updatePresentation(
		batchUpdateRequests,
		presentationId,
		accessToken
	)
}

const updatesSchema = z.array(
	z.discriminatedUnion('type', [
		z.object({ type: z.literal('prebuilt') }).merge(prebuiltRequestsSchema),
		z.object({
			type: z.literal('custom'),
			requests: z.array(z.object({}).passthrough()),
		}),
	])
)

async function useUpdates(
	updates: z.infer<typeof updatesSchema>,
	presentationId: string,
	accessToken: string
) {
	try {
		const results = []

		for (const update of updates) {
			if (update.type === 'prebuilt') {
				results.push(
					await usePrebuiltRequests(
						{
							requests: update.requests,
						},
						presentationId,
						accessToken
					)
				)
				continue
			}

			results.push(
				await updatePresentation(update.requests, presentationId, accessToken)
			)
		}

		return results
	} catch (error) {
		if (!(error instanceof Error)) return { error: 'Unknown error' }

		return { error: error.message }
	}
}

const updatePresentationParamsSchema = z.object({
	updates: updatesSchema,
})

const getPresentationPropertiesParamsSchema = z.object({
	properties: z.array(
		z.tuple([
			z
				.string()
				.describe(
					'Alias of the property you are looking for, for example "presentationTitle" or "presentationWidth"'
				),
			z
				.array(z.union([z.string(), z.number()]))
				.describe(
					'Given a presentation object obtained from the GET presentation endpoint of the Google Slides API, this must be the path to access the presentation property you are looking for, for example, if you are looking for presentation title, this could be ["title"]'
				),
		])
	),
})

async function postChat(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const accessToken = await requireAccessToken(request.cookies)

	const userProfile = await getUserProfile(accessToken)

	const userCreditBalance = await getUserCreditBalance(userProfile.id)

	if (userCreditBalance <= 0) throw new Error('NO_CREDITS')

	const { id } = await params
	const { messages } = await request.json()

	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${id}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok) throw new Error('FAILED_TO_FETCH_PRESENTATION')

	const presentation = await response.json()

	const streamTextArgs = {
		model: anthropic('claude-4-sonnet-20250514'),
		system: `You are the Slaidge edition manager, you are in charge of editing a presentation through the given tools.
${guidelines('editor')}`,
		messages,
		tools: {
			updatePresentation: {
				description: 'Update the presentation elements',
				parameters: updatePresentationParamsSchema,
				execute: async (args: z.infer<typeof updatePresentationParamsSchema>) =>
					await useUpdates(args.updates, id, accessToken),
			},
			getPresentationProperty: {
				description: 'Get a property of the presentation the user is editting',
				parameters: getPresentationPropertiesParamsSchema,
				execute: async (
					args: z.infer<typeof getPresentationPropertiesParamsSchema>
				) => {
					try {
						const aliasesValues = args.properties.map(([alias, path]) => {
							const value = path.reduce((previous, current) => {
								const newValue = previous[current]

								if (!newValue) {
									throw new Error(
										`${path.slice(0, path.indexOf(current) + 1).join('.')} does not exist`
									)
								}

								return newValue
							}, presentation)

							if (typeof value !== 'object') return [alias, value]

							const optimizedValue: Record<string, any> = {}

							for (const [k, v] of Object.entries(value)) {
								optimizedValue[k] =
									typeof v === 'object' && v !== null ? String(v) : v
							}

							return [alias, optimizedValue]
						})

						return Object.fromEntries(aliasesValues)
					} catch (error) {
						if (!(error instanceof Error)) return { error: 'Unknown error' }

						return { error: error.message }
					}
				},
			},
		},
	}

	const maxTokens = await getMaxOutputTokens(
		messages,
		streamTextArgs.model.modelId,
		streamTextArgs.system,
		Object.keys(streamTextArgs.tools).map((toolKey) => {
			const tool =
				streamTextArgs.tools[toolKey as keyof typeof streamTextArgs.tools]

			return {
				name: toolKey,
				description: tool.description,
				input_schema: {
					...zodToJsonSchema(tool.parameters, 'input_schema'),
					type: 'object',
				},
			}
		})
	)

	const result = streamText({
		...streamTextArgs,
		maxTokens,
		maxSteps: 10,
		onFinish: async ({ usage }) => {
			const supabase = await createSupabaseClient()

			await supabase.rpc('insert_credit_usage', {
				user_id: userProfile.id,
				amount: AIUsageToCreditsUsed(usage),
			})
		},
	})

	return result.toDataStreamResponse()
}

export const POST = await withNextResponseJsonError(postChat)

export async function GET() {
	return Response.json({}, { status: 200 })
}
