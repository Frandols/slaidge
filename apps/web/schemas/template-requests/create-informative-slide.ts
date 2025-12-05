import { z } from 'zod'

import hexToRgb from '@/adapters/hex-to-rgb'
import themeSchema from '@/schemas/theme'
import getQRCodeRequests from '@/utils/get-qr-code-requests'

export const createInformativeSlideParamsSchema = z.object({
	id: z.string().min(1).describe('ID of the new slide'),
	title: z.object({
		id: z.string().min(1).describe('ID of the title text box'),
		content: z
			.string()
			.min(1)
			.max(50)
			.describe('Content of the title, 50 characters maximum.'),
	}),
	footer: z.object({
		id: z.string().min(1).describe('ID of the footer text box'),
		content: z
			.string()
			.min(1)
			.max(50)
			.describe('Content of the footer, 50 characters maximum.'),
	}),
})

export default function createInformativeSlide(
	params: z.infer<typeof createInformativeSlideParamsSchema>,
	theme: z.infer<typeof themeSchema>,
	presentationId: string
) {
	const presentationLink = `https://slaidge.com/presentations/${presentationId}`

	return [
		{
			createSlide: {
				objectId: params.id,
				slideLayoutReference: {
					predefinedLayout: 'BLANK',
				},
			},
		},
		...getQRCodeRequests(params.id, presentationId),
		{
			updatePageProperties: {
				objectId: params.id,
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
		,
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
					fontFamily: theme.fonts.serif,
					fontSize: {
						magnitude: 32,
						unit: 'PT',
					},
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
					fontFamily: theme.fonts.sansSerif,
					fontSize: {
						magnitude: 12,
						unit: 'PT',
					},
					bold: true,
					foregroundColor: {
						opaqueColor: {
							rgbColor: hexToRgb(theme.colors.mutedForeground),
						},
					},
				},
				fields: ['fontFamily', 'fontSize', 'bold', 'foregroundColor']
					.filter(Boolean)
					.join(','),
			},
		},
	]
}
