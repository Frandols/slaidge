import { generateObject } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import z from 'zod'

import AIUsageToCreditsUsed from '@/adapters/ai-usage-to-credits-used'
import templateToRawRequests from '@/adapters/template-to-raw-requests'
import createSupabaseClient from '@/clients/factories/supabase'
import openrouter from '@/clients/openrouter'
import requireAccessToken from '@/guards/require-access-token'
import requireAdmitedPromptSize from '@/guards/require-admited-prompt-size'
import googlePresentationSchema from '@/schemas/google/presentation'
import templateRequestsSchema from '@/schemas/template-requests'
import createSectionOpeningSlide from '@/schemas/template-requests/create-section-opening-slide'
import themeSchema from '@/schemas/theme'
import getUserProfile from '@/services/google/get-user-profile'
import updatePresentation from '@/services/google/update-presentation'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'

export async function POST(request: NextRequest) {
	const accessToken = await requireAccessToken(request.cookies)

	const userProfile = await getUserProfile(accessToken)

	const userCreditBalance = await getUserCreditBalance(userProfile.id)

	if (userCreditBalance <= 0)
		return NextResponse.json({ message: 'NO_CREDITS' }, { status: 400 })

	const body = await request.json()

	if ('title' in body && 'theme' in body) {
		const { title, subtitle, theme } = body as {
			title: string
			subtitle?: string
			theme: z.infer<typeof themeSchema>
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

		if (!response.ok)
			return NextResponse.json(
				{ message: 'FAILED_TO_CREATE_PRESENTATION' },
				{ status: 500 }
			)

		const json = await response.json()
		const parsing = googlePresentationSchema.safeParse(json)
		if (!parsing.success)
			return NextResponse.json(
				{ message: 'MALFORMED_PRESENTATION' },
				{ status: 500 }
			)

		const presentation = parsing.data

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

			return NextResponse.json({ status: 'success', presentation })
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

			if (!(error instanceof Error))
				return NextResponse.json({ message: 'UNKNOWN_ERROR' }, { status: 500 })

			return NextResponse.json({ message: error.message }, { status: 500 })
		}
	}

	const { prompt, files } = body as {
		prompt: string
		files: {
			data: string
			filename: string
			mediaType: string
		}[]
	}

	const filesWithSize = files.map((file) => {
		const base64Length = file.data.length
		const padding = (file.data.match(/={1,2}$/) || [''])[0].length
		const size = (base64Length * 3) / 4 - padding
		return { size }
	})

	requireAdmitedPromptSize(prompt, filesWithSize)

	const fileParts = files.map((file) => ({
		type: 'file' as const,
		data: file.data,
		mediaType: file.mediaType,
	}))

	const { object, usage } = await generateObject({
		model: openrouter('anthropic/claude-sonnet-4'),
		messages: [
			{
				role: 'system',
				content:
					'You are an artificial intelligence agent specialized in slide design, ' +
					'integrated into a web application called "Slaidge" so that users can create ' +
					'their presentations more quickly.\n' +
					'Your goal is to initialize a new presentation based on the user prompt, you should ' +
					'generate a title for it, a theme, and the update requests. By default, the first slide ' +
					'is going to be deleted, then, the update requests generated by you are going to be run.\n\n' +
					'---\n\n' +
					'[1] Rules and restrictions\n\n' +
					'There will be rules and restrictions depending on the task you are performing; ' +
					'these rules are non-negotiable and you must follow them strictly.\n\n' +
					'1. Processing requests.\n\n' +
					'* Create a maximum of 5 slides per request.\n\n' +
					'2. Visual aesthetics in presentations:\n\n' +
					'Theme creation:\n' +
					'* Use colors and fonts that reflect the theme of the presentation. ' +
					'Take creative risks in your designs. The design should automatically evoke the subject matter.\n' +
					'* You can select any Google Font.\n\n' +
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
					"* Don't use more than 8 words per bullet point.\n",
			},
			{
				role: 'user',
				content: [{ type: 'text', text: prompt }, ...fileParts],
			},
		],
		schema: z.object({
			title: z.string().min(1).describe('Title for the presentation'),
			update: templateRequestsSchema,
			theme: themeSchema,
		}),
		maxOutputTokens: Number(process.env.OUTPUT_TOKENS_PER_CREDIT),
	})

	const supabase = await createSupabaseClient()

	await supabase.rpc('insert_credit_usage', {
		user_id: userProfile.id,
		amount: AIUsageToCreditsUsed(usage),
	})

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

	if (!response.ok)
		return NextResponse.json(
			{ message: 'FAILED_TO_CREATE_PRESENTATION' },
			{ status: 500 }
		)

	const json = await response.json()
	const parsing = googlePresentationSchema.safeParse(json)
	if (!parsing.success)
		return NextResponse.json(
			{ message: 'MALFORMED_PRESENTATION' },
			{ status: 500 }
		)

	const presentation = parsing.data

	try {
		const { success } = await updatePresentation(
			[
				{ deleteObject: { objectId: 'p' } },
				...templateToRawRequests(
					object.update.requests,
					object.theme,
					presentation.presentationId
				),
			],
			presentation.presentationId,
			accessToken
		)

		if (!success) throw new Error('FAILED_TO_UPDATE_PRESENTATION')

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

		return NextResponse.json({ status: 'success', presentation })
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

		if (!(error instanceof Error))
			return NextResponse.json({ message: 'UNKNOWN_ERROR' }, { status: 500 })

		return NextResponse.json({ message: error.message }, { status: 500 })
	}
}
