import { z } from 'zod'

import backgroundSettingsSchema from '@/schemas/background-settings'
import styleSettingsSchema from '@/schemas/style-settings'
import hexToRgb from '@/utils/hex-to-rgb'

export const createInformativeSlideParamsSchema = z.object({
	id: z.string().min(1).describe('ID of the new slide'),
	title: z.object({
		id: z.string().min(1).describe('ID of the title text box'),
		content: z
			.string()
			.min(1)
			.max(50)
			.describe('Content of the title, 50 characters maximum.'),
		style: styleSettingsSchema.omit({ bold: true }).optional(),
	}),
	footer: z.object({
		id: z.string().min(1).describe('ID of the footer text box'),
		content: z
			.string()
			.min(1)
			.max(50)
			.describe('Content of the footer, 50 characters maximum.'),
		style: styleSettingsSchema.omit({ bold: true }).optional(),
	}),
	background: backgroundSettingsSchema.optional(),
})

export default function createInformativeSlide(
	params: z.infer<typeof createInformativeSlideParamsSchema>
) {
	const backgroundRequests = params.background
		? params.background.type === 'solid'
			? [
					{
						updatePageProperties: {
							objectId: params.id,
							pageProperties: {
								pageBackgroundFill: {
									solidFill: {
										color: {
											rgbColor: hexToRgb(params.background.color),
										},
									},
								},
							},
							fields: 'pageBackgroundFill.solidFill.color',
						},
					},
				]
			: [
					{
						updatePageProperties: {
							objectId: params.id,
							pageProperties: {
								pageBackgroundFill: {
									stretchedPictureFill: {
										contentUrl: params.background.url,
									},
								},
							},
							fields: 'pageBackgroundFill.stretchedPictureFill.contentUrl',
						},
					},
				]
		: []

	return [
		{
			createSlide: {
				objectId: params.id,
				slideLayoutReference: {
					predefinedLayout: 'BLANK',
				},
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
						height: {
							magnitude: 60,
							unit: 'PT',
						},
						width: {
							magnitude: 600,
							unit: 'PT',
						},
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
				insertionIndex: 0,
				text: params.title.content,
			},
		},
		{
			updateTextStyle: {
				objectId: params.title.id,
				textRange: { type: 'ALL' },
				style: {
					fontFamily: params.title.style?.fontFamily ?? 'Arial',
					fontSize: {
						magnitude: 32,
						unit: 'PT',
					},
					bold: true,
					italic: params.title.style?.italic,
					foregroundColor: params.title.style?.color
						? { opaqueColor: { rgbColor: hexToRgb(params.title.style.color) } }
						: undefined,
				},
				fields: [
					'fontFamily',
					'fontSize',
					'bold',
					params.title.style?.italic ? 'italic' : null,
					params.title.style?.color ? 'foregroundColor' : null,
				]
					.filter(Boolean)
					.join(','),
			},
		},
		{
			createShape: {
				objectId: params.footer.id,
				shapeType: 'TEXT_BOX',
				elementProperties: {
					pageObjectId: params.id,
					size: {
						height: {
							magnitude: 30,
							unit: 'PT',
						},
						width: {
							magnitude: 600,
							unit: 'PT',
						},
					},
					transform: {
						scaleX: 1,
						scaleY: 1,
						translateX: 60,
						translateY: 325,
						unit: 'PT',
					},
				},
			},
		},
		{
			insertText: {
				objectId: params.footer.id,
				insertionIndex: 0,
				text: params.footer.content,
			},
		},
		{
			updateTextStyle: {
				objectId: params.footer.id,
				textRange: { type: 'ALL' },
				style: {
					fontFamily: params.footer.style?.fontFamily ?? 'Arial',
					fontSize: {
						magnitude: 12,
						unit: 'PT',
					},
					bold: true,
					italic: params.footer.style?.italic,
					foregroundColor: (params.footer.style?.color
						? { opaqueColor: { rgbColor: hexToRgb(params.footer.style.color) } }
						: undefined) ?? {
						opaqueColor: {
							rgbColor: {
								red: 0.4,
								green: 0.4,
								blue: 0.4,
							},
						},
					},
				},
				fields: [
					'fontFamily',
					'fontSize',
					'bold',
					params.footer.style?.italic ? 'italic' : null,
					'foregroundColor',
				]
					.filter(Boolean)
					.join(','),
			},
		},
	]
}
