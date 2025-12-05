import { z } from 'zod'

import hexToRgb from '@/adapters/hex-to-rgb'
import themeSchema from '@/schemas/theme'
import getQRCodeRequests from '@/utils/get-qr-code-requests'

export const createSectionOpeningSlideParamsSchema = z.object({
	id: z.string().min(1).describe('ID of the slide'),
	title: z.object({
		id: z.string().min(1).describe('ID of the title text box'),
		content: z
			.string()
			.min(1)
			.max(50)
			.describe('Content of the title, 50 characters maximum'),
	}),
	subtitle: z
		.object({
			id: z.string().min(1).describe('ID of the subtitle text box'),
			content: z
				.string()
				.min(1)
				.max(100)
				.describe('Content of the subtitle, 100 characters maximum'),
		})
		.optional(),
})

export default function createSectionOpeningSlide(
	params: z.infer<typeof createSectionOpeningSlideParamsSchema>,
	theme: z.infer<typeof themeSchema>,
	presentationId: string
) {
	const backgroundRequests = getBackgroundRequests(params.id, theme)

	return [
		{
			createSlide: {
				objectId: params.id,
				slideLayoutReference: { predefinedLayout: 'BLANK' },
			},
		},
		...getQRCodeRequests(params.id, presentationId),
		...backgroundRequests,
		{
			createShape: {
				objectId: params.title.id,
				shapeType: 'TEXT_BOX',
				elementProperties: {
					pageObjectId: params.id,
					size: {
						height: { magnitude: 137.5, unit: 'PT' },
						width: { magnitude: 600, unit: 'PT' },
					},
					transform: {
						scaleX: 1,
						scaleY: 1,
						translateX: 60,
						translateY: 40,
						unit: 'PT',
					},
				},
			},
		},
		{
			insertText: {
				objectId: params.title.id,
				text: params.title.content,
			},
		},
		{
			updateTextStyle: {
				objectId: params.title.id,
				textRange: { type: 'ALL' },
				style: {
					fontFamily: theme.fonts.serif,
					fontSize: { magnitude: 48, unit: 'PT' },
					bold: true,
					foregroundColor: {
						opaqueColor: { rgbColor: hexToRgb(theme.colors.foreground) },
					},
				},
				fields: ['fontFamily', 'fontSize', 'bold', 'foregroundColor']
					.filter(Boolean)
					.join(','),
			},
		},
		{
			updateParagraphStyle: {
				objectId: params.title.id,
				style: { alignment: 'CENTER' },
				textRange: { type: 'ALL' },
				fields: 'alignment',
			},
		},
		{
			updateShapeProperties: {
				objectId: params.title.id,
				shapeProperties: {
					contentAlignment: 'BOTTOM',
				},
				fields: 'contentAlignment',
			},
		},
		...(params.subtitle
			? [
					{
						createShape: {
							objectId: params.subtitle.id,
							shapeType: 'TEXT_BOX',
							elementProperties: {
								pageObjectId: params.id,
								size: {
									height: { magnitude: 177.5, unit: 'PT' },
									width: { magnitude: 600, unit: 'PT' },
								},
								transform: {
									scaleX: 1,
									scaleY: 1,
									translateX: 60,
									translateY: 177.5,
									unit: 'PT',
								},
							},
						},
					},
					{
						insertText: {
							objectId: params.subtitle.id,
							text: params.subtitle.content,
						},
					},
					{
						updateTextStyle: {
							objectId: params.subtitle.id,
							textRange: { type: 'ALL' },
							style: {
								fontFamily: theme.fonts.sansSerif,
								fontSize: { magnitude: 24, unit: 'PT' },
								italic: true,
								foregroundColor: {
									opaqueColor: {
										rgbColor: hexToRgb(theme.colors.mutedForeground),
									},
								},
							},
							fields: ['fontFamily', 'fontSize', 'italic', 'foregroundColor']
								.filter(Boolean)
								.join(','),
						},
					},
					{
						updateParagraphStyle: {
							objectId: params.subtitle.id,
							style: { alignment: 'CENTER' },
							textRange: { type: 'ALL' },
							fields: 'alignment',
						},
					},
					{
						updateShapeProperties: {
							objectId: params.subtitle.id,
							shapeProperties: {
								contentAlignment: 'TOP',
							},
							fields: 'contentAlignment',
						},
					},
				]
			: []),
	]
}

function getBackgroundRequests(id: string, theme: z.infer<typeof themeSchema>) {
	const backgroundRequests = [
		{
			updatePageProperties: {
				objectId: id,
				pageProperties: {
					pageBackgroundFill: {
						solidFill: {
							color: {
								rgbColor: hexToRgb(theme.colors.background),
							},
						},
					},
				},
				fields: 'pageBackgroundFill.solidFill.color',
			},
		},
	]

	return backgroundRequests
}
