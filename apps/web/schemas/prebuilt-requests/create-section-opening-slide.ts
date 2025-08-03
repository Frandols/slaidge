import { z } from 'zod'

import backgroundSettingsSchema from '@/schemas/background-settings'
import styleSettingsSchema from '@/schemas/style-settings'
import getBackgroundRequests from '@/utils/get-background-requests'
import hexToRgb from '@/utils/hex-to-rgb'

export const createSectionOpeningSlideParamsSchema = z.object({
	id: z.string().min(1).describe('ID of the slide'),
	title: z.object({
		id: z.string().min(1).describe('ID of the title text box'),
		content: z
			.string()
			.min(1)
			.max(50)
			.describe('Content of the title, 50 characters maximum'),
		style: styleSettingsSchema.omit({ italic: true, bold: true }).optional(),
	}),
	subtitle: z
		.object({
			id: z.string().min(1).describe('ID of the subtitle text box'),
			content: z
				.string()
				.min(1)
				.max(50)
				.describe('Content of the subtitle, 50 characters maximum'),
			style: styleSettingsSchema.omit({ italic: true, bold: true }).optional(),
		})
		.optional(),
	background: backgroundSettingsSchema.optional(),
})

export default function createSectionOpeningSlide(
	params: z.infer<typeof createSectionOpeningSlideParamsSchema>
) {
	const backgroundRequests = params.background
		? getBackgroundRequests(params.id, params.background)
		: []

	return [
		{
			createSlide: {
				objectId: params.id,
				slideLayoutReference: { predefinedLayout: 'BLANK' },
			},
		},
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
					fontFamily: params.title.style?.fontFamily ?? 'Arial',
					fontSize: { magnitude: 48, unit: 'PT' },
					bold: true,
					foregroundColor: (params.title.style?.color
						? { opaqueColor: { rgbColor: hexToRgb(params.title.style.color) } }
						: undefined) ?? {
						opaqueColor: { rgbColor: { red: 0, green: 0, blue: 0 } },
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
								fontFamily: params.subtitle.style?.fontFamily ?? 'Arial',
								fontSize: { magnitude: 24, unit: 'PT' },
								italic: true,
								foregroundColor: (params.subtitle.style?.color
									? {
											opaqueColor: {
												rgbColor: hexToRgb(params.subtitle.style.color),
											},
										}
									: undefined) ?? {
									opaqueColor: {
										rgbColor: { red: 0.3, green: 0.3, blue: 0.3 },
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
