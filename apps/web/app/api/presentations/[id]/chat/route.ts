import AIUsageToCreditsUsed from '@/adapters/ai-usage-to-credits-used'
import templateToRawRequests from '@/adapters/template-to-raw-requests'
import createSupabaseClient from '@/clients/factories/supabase'
import openrouter from '@/clients/openrouter'
import requireAccessToken from '@/guards/require-access-token'
import requireAdmitedPromptSize from '@/guards/require-admited-prompt-size'
import templateRequestsSchema from '@/schemas/template-requests'
import themeSchema from '@/schemas/theme'
import getUserProfile from '@/services/google/get-user-profile'
import updatePresentation from '@/services/google/update-presentation'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'
import {
	convertToModelMessages,
	stepCountIs,
	streamText,
	StreamTextOnFinishCallback,
	UIMessage,
} from 'ai'
import { NextRequest } from 'next/server'
import { z } from 'zod'

async function postChat(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const accessToken = await requireAccessToken(request.cookies)

	const userProfile = await getUserProfile(accessToken)

	const userCreditBalance = await getUserCreditBalance(userProfile.id)

	if (userCreditBalance <= 0) return new Response('NO_CREDITS', { status: 400 })

	// Concurrently get presentation's ID and UI messages
	const [{ id: presentationId }, { messages }]: [
		{ id: string },
		{ messages: UIMessage[] },
	] = await Promise.all([params, request.json()])

	const modelMessages = convertToModelMessages(messages)
	const lastModelMessage = modelMessages[modelMessages.length - 1]

	if (lastModelMessage && lastModelMessage.role === 'user') {
		let text = ''
		const files: { size: number }[] = []

		if (typeof lastModelMessage.content === 'string') {
			text = lastModelMessage.content
		} else if (Array.isArray(lastModelMessage.content)) {
			for (const part of lastModelMessage.content) {
				if (part.type === 'text') {
					text += part.text
				} else if (part.type === 'image') {
					if (typeof part.image === 'string') {
						const base64Length = part.image.length
						const padding = (part.image.match(/={1,2}$/) || [''])[0].length
						const size = (base64Length * 3) / 4 - padding
						files.push({ size })
					}
				} else if (part.type === 'file') {
					if (typeof part.data === 'string') {
						const base64Length = part.data.length
						const padding = (part.data.match(/={1,2}$/) || [''])[0].length
						const size = (base64Length * 3) / 4 - padding
						files.push({ size })
					}
				}
			}
		}

		requireAdmitedPromptSize(text, files)
	}

	// Get raw presentation
	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${presentationId}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		}
	)

	if (!response.ok)
		return new Response('FAILED_TO_FETCH_PRESENTATION', { status: 400 })

	const presentation = await response.json()

	const tools = {
		updatePresentation: {
			description: 'Update the presentation elements',
			inputSchema: updatePresentationToolInputSchema,
			execute: async ({
				updates,
			}: z.infer<typeof updatePresentationToolInputSchema>) => {
				try {
					// Get presentation's theme
					const supabase = await createSupabaseClient()

					const { data, error } = await supabase
						.from('presentations')
						.select(
							`
						  background_color,
						  foreground_color,
						  muted_foreground_color,
						  chart_colors,
						  serif_font,
						  sans_serif_font
						  `
						)
						.eq('id', presentationId)
						.single()

					if (error) {
						throw new Error(`FAILED_TO_FETCH_THEME`)
					}

					const rawTheme = {
						colors: {
							background: data.background_color,
							foreground: data.foreground_color,
							mutedForeground: data.muted_foreground_color,
							chart: data.chart_colors,
						},
						fonts: {
							serif: data.serif_font,
							sansSerif: data.sans_serif_font,
						},
					}

					const theme = themeSchema.parse(rawTheme)
					// Transform updates to raw requests
					const rawRequests = []

					for (const update of updates) {
						if (update.type === 'template') {
							rawRequests.push(
								templateToRawRequests(update.requests, theme, presentationId)
							)

							continue
						}

						rawRequests.push(update.requests)
					}

					const { success, text } = await updatePresentation(
						rawRequests,
						presentationId,
						accessToken
					)

					if (success) {
						// Sync update time at database
						await supabase
							.from('presentations')
							.update({ updated_at: new Date().toISOString() })
							.eq('id', presentationId)
					}

					return text
				} catch (error) {
					if (!(error instanceof Error)) return { error: 'Unknown error' }

					return { error: error.message }
				}
			},
		},
		getPresentationProperty: {
			description: 'Get a property of the presentation the user is editting',
			inputSchema: getPresentationPropertiesToolInputSchema,
			execute: async (
				args: z.infer<typeof getPresentationPropertiesToolInputSchema>
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
						// If the value is an object, convert all its nested objects
						// to strings to avoid model's information overloading
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
	} as const

	const streamTextConfig = {
		model: openrouter('anthropic/claude-sonnet-4'),
		system:
			'You are an artificial intelligence agent specialized in slide design, ' +
			'integrated into a web application called "Slaidge" so that users can create ' +
			'their presentations more quickly.\n' +
			"Your goal is to use the provided tools to follow the user's requests regarding " +
			'the editing of their presentation, always prioritizing accuracy, strict compliance ' +
			'with rules, and token efficiency.\n\n' +
			'---\n\n' +
			'[1] Rules and restrictions\n\n' +
			'There will be rules and restrictions depending on the task you are performing; ' +
			'these rules are non-negotiable and you must follow them strictly.\n\n' +
			'1. Behavior when interacting with the user:\n\n' +
			'* You should not mention application-specific terms or concepts to users such as ' +
			'"template requests", "raw requests", "informative slides", "section opening slides", etc. ' +
			'You must act as a mere server that attends to their requests, only explaining in broad terms WHAT ' +
			'you are going to do, not HOW.\n' +
			'* Do not talk to users about your tools; only execute them when necessary.\n' +
			'* Before executing a tool, you must explain, as mentioned earlier, *in broad terms* ' +
			'what you will do in that tool invocation.\n\n' +
			'2. Processing requests.\n\n' +
			'* Create a maximum of 5 slides per request.\n' +
			'* When creating a new element (no matter which type), always use the current time in its ID, ' +
			'current time is: "' +
			Date.now() +
			'"\n\n' +
			'3. Visual aesthetics in presentations:\n\n' +
			'Information selection:\n\n' +
			'* Each slide must be minimal and scannable. Break content into short sections with clear titles ' +
			'and concise bullets.\n' +
			'* Prioritize short and meaningful information over long and overly descriptive information.\n\n' +
			'Elements configuration:\n\n' +
			'* When using informative elements, you should always use all the rows and columns of the grid, ' +
			'in any distribution or configuration, but using them all.\n' +
			'* You should add images and charts when relevant.\n' +
			'* You should use emojis for stronger visual memory.\n' +
			'* Charts should be visible in detail; they should use all the available rows and 2/3 of the columns.\n' +
			"* Don't add more than 1 bullet points list per informative element.\n" +
			"* Don't add more than 3 bullets per bullet points list.\n" +
			"* Don't use more than 8 words per bullet point.\n\n" +
			'---\n\n' +
			'[2] Reasoning procedure / approach\n\n' +
			'You are free to chat with users without editing the presentation, but if you are simply having a conversation, ' +
			'remind them that you are only there to edit the presentation; do not talk with the user about topics unrelated ' +
			'to your main task.\n\n' +
			'1. When a request from the user arrives to edit their presentation, reason as follows:\n\n' +
			'Is it possible to perform this edit through a finite sequence of template requests?\n\n' +
			'If not, try to use raw requests to carry out the task.\n\n' +
			'If the answer to the question is yes, proceed as follows:\n\n' +
			'Should I add slides?\n\n' +
			'If the answer is no, use the creation of informative elements to fill an existing slide with the relevant content.\n\n' +
			'If the answer is yes, add all the necessary slides. Remember to consider that if a new topic is being addressed, ' +
			'the first slide must be of type section opening.\n' +
			'Once all slides are created, go through them sequentially, adding the information that corresponds to what they are intended to explain.\n\n' +
			"2. When you need data related to an existing element of the presentation, and you don't have it because you didn't create it recently, follow this path:\n\n" +
			'Is the element inside of one or many arrays?\n\n' +
			'If it is not part of any array, just try to access it normally going through the presentation properties and subproperties.\n\n' +
			"If it is part of an array, you'll probably need to do more than one tool call:\n\n" +
			'* First, go to the array and get the length.\n' +
			'* Once you have the length:\n' +
			'  If the user gave you the position of the element like "the 4th slide", access with the number index, and then keep going until you find the requested data.\n' +
			"  If you don't know in which position the element can be:\n" +
			'  If the array is not too long, make a request for each element of the array and once you guess the position, ' +
			'make a new request just for that position and keep going until you find the needed data.\n' +
			'  If it is too long, tell the user.\n\n' +
			'---\n\n' +
			'[3] Output format\n\n' +
			'For a user message that does not lead to a presentation edit, your response should be short and end by asking how you can help them with their presentation.\n\n' +
			'For a message that does lead to an edit, you will respond in the following format:\n\n' +
			'<- Brief summary of what you will do ->\n\n' +
			'<- Summary of what you will do when calling the tool ->\n' +
			'<- Tool call ->\n\n' +
			'(These last two steps can be repeated as many times as needed)\n\n' +
			'<- Summary of everything you managed to do ->\n',
		messages: convertToModelMessages(messages),
		tools,
		maxRetries: 10,
		stopWhen: stepCountIs(10),
		onFinish: async ({
			totalUsage: usage,
		}: Parameters<StreamTextOnFinishCallback<typeof tools>>[0]) => {
			if (usage.inputTokens === undefined || usage.outputTokens === undefined)
				return

			const supabase = await createSupabaseClient()

			await supabase.rpc('insert_credit_usage', {
				user_id: userProfile.id,
				amount: AIUsageToCreditsUsed(usage),
			})
		},
	}

	const result = streamText({
		...streamTextConfig,
		maxOutputTokens: Number(process.env.OUTPUT_TOKENS_PER_CREDIT),
	})

	return result.toUIMessageStreamResponse()
}

export const POST = postChat

const updatePresentationToolInputSchema = z.object({
	updates: z.array(
		z.discriminatedUnion('type', [
			z.object({ type: z.literal('template') }).merge(templateRequestsSchema),
			z.object({
				type: z.literal('raw'),
				requests: z.array(z.object({}).passthrough()),
			}),
		])
	),
})

const getPresentationPropertiesToolInputSchema = z.object({
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

export async function GET() {
	return Response.json({}, { status: 200 })
}
