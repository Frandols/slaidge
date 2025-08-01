import { streamText } from 'ai'
import { NextRequest } from 'next/server'
import { z } from 'zod'

import getCreditsUsed from '@/adapters/get-credits-used'
import anthropic from '@/clients/anthropic'
import createSupabaseClient from '@/clients/factories/supabase'
import withNextResponseJsonError from '@/decorators/with-next-response-json-error'
import requireAccessToken from '@/guards/require-access-token'
import prebuiltRequestsSchema, {
	prebuiltRequestsExecutables,
} from '@/prebuilt-requests'
import getUserProfile from '@/services/google/get-user-profile'

export async function updatePresentation(
	requests: unknown[],
	presentationId: string,
	accessToken: string
) {
	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requests }),
		}
	)

	return await response.text()
}

export function prebuiltRequestsToAPIRequests(
	requests: z.infer<typeof prebuiltRequestsSchema>['requests']
) {
	return requests
		.map((request) => {
			const argsId = Object.keys(request)[0]

			if (!argsId) throw new Error('PREBUILT_REQUEST_WITHOUT_ARGS')

			if (!(argsId in prebuiltRequestsExecutables))
				throw new Error('PREBUILT_REQUEST_WITHOUT_EXECUTABLE')

			const executable =
				prebuiltRequestsExecutables[
					argsId as keyof typeof prebuiltRequestsExecutables
				]

			const args = request[argsId as keyof typeof request] as Parameters<
				typeof executable
			>[0]

			// @ts-expect-error
			return executable(args)
		})
		.flat()
}

export async function usePrebuiltRequests(
	args: z.infer<typeof prebuiltRequestsSchema>,
	presentationId: string,
	accessToken: string
) {
	const batchUpdateRequests = prebuiltRequestsToAPIRequests(args.requests)

	return await updatePresentation(
		batchUpdateRequests,
		presentationId,
		accessToken
	)
}

export const updatesSchema = z.array(
	z.discriminatedUnion('type', [
		z
			.object({
				type: z.literal('custom'),
				requests: z
					.array(z.object({}).passthrough())
					.describe('Google Slides API compatible batchUpdate requests'),
			})
			.describe('Used for custom requests to the Google Slides API'),
		z.object({ type: z.literal('prebuilt') }).merge(prebuiltRequestsSchema),
	])
)

export async function useUpdates(
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

	const result = streamText({
		model: anthropic('claude-4-sonnet-20250514'),
		system:
			'Sos el agente encargado de una aplicacion llamada Slaidge, tu trabajo es escuchar las peticiones del usuario y realizar cambios en una presentacion que el esta editando. Recuerda siempre usar informacion relevante, si usas elementos informativos siempre deberias ocupar todas las filas y columnas de la diapositiva, en cualquier distribucion que quieras, pero usandolas todas. Debes agregar imagenes y graficos cuando sea pertinente, y usar emoticonos para mejorar la memoria visual.',
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
		maxSteps: 10,
		onFinish: async ({ usage }) => {
			const supabase = await createSupabaseClient()

			await supabase.rpc('insert_credit_usage', {
				user_id: userProfile.id,
				amount: getCreditsUsed(usage),
				changelog_id: null,
			})
		},
	})

	return result.toDataStreamResponse()
}

export const POST = await withNextResponseJsonError(postChat)

export async function GET() {
	return Response.json({}, { status: 200 })
}
