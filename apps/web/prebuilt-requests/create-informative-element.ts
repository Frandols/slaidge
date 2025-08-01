import { z } from 'zod'

import backgroundSettingsSchema from '@/schemas/background-settings'
import styleSettingsSchema from '@/schemas/style-settings'
import generateQuickChartURL from '@/utils/generate-quickchart-url'
import getBackgroundRequests from '@/utils/get-background-requests'
import hexToRgb from '@/utils/hex-to-rgb'

const areasFontSizes: Record<number, number> = {
	22500: 12,
	33750: 14,
	67500: 16,
	135000: 18,
}

const elementSettingsCoreSchema = z.object({
	id: z.string().min(1).describe('ID of the element'),
	row: z
		.tuple([
			z
				.tuple([z.number().min(1).max(2), z.number().min(1).max(2)])
				.refine(([start, end]) => start <= end, {
					message: 'Index start can not be greater than index end',
				})
				.describe(
					'A tuple where the first element is the row where the element starts, and the second one the row where the element ends'
				),
			z.number().min(1).max(2),
		])
		.refine(([[_, indexEnd], total]) => indexEnd <= total, {
			message: 'Index end can not be greater than the amount of rows',
		})
		.describe(
			'A tuple where the first element is a tuple that specifies the rows where the element starts and ends, and the second one specifies the amount of rows. For example: [[1, 2], 2] -> Element uses rows 1 and 2, in a grid of two rows'
		),
	col: z
		.tuple([
			z
				.tuple([z.number().min(1).max(3), z.number().min(1).max(3)])
				.refine(([start, end]) => start <= end, {
					message: 'Index start can not be greater than index end',
				})
				.describe(
					'A tuple where the first element is the column where the element starts, and the second one the column where the element ends'
				),
			z.number().min(1).max(3),
		])
		.refine(([[_, indexEnd], total]) => indexEnd <= total, {
			message: 'Index end can not be greater than the amount of columns',
		})
		.describe(
			'A tuple where the first element is a tuple that specifies the columns where the element starts and ends, and the second one specifies the amount of columns. For example: [[1, 2], 3] -> Element uses column 1 and 2, in a grid of three columns'
		),
})

export const textElementSettingsSchema = elementSettingsCoreSchema.extend({
	type: z.literal('text'),
	content: z.string().min(1).max(300).describe('Content of the text'),
	style: styleSettingsSchema.optional(),
	background: backgroundSettingsSchema.optional(),
})

const imageElementSettingsSchema = elementSettingsCoreSchema.extend({
	type: z.literal('image'),
	url: z.string().min(1).url().describe('URL of the image'),
})

const chartElementSettingsSchema = elementSettingsCoreSchema.extend({
	type: z.literal('chart'),
	chartType: z.enum(['BAR', 'LINE', 'PIE']).describe('Type of chart'),
	title: z.string().min(1).max(100).describe('Title of the chart'),
	data: z
		.array(
			z.object({
				label: z.string().min(1),
				value: z.number(),
			})
		)
		.min(1)
		.describe('Data for the chart'),
})

export const informativeElementSchema = z.union([
	textElementSettingsSchema,
	imageElementSettingsSchema,
	chartElementSettingsSchema,
])

export const createInformativeElementParamsSchema = z.object({
	slideId: z.string().min(1).describe('ID of the slide to create the element'),
	element: informativeElementSchema,
})

export default function createInformativeElement(
	params: z.infer<typeof createInformativeElementParamsSchema>
): unknown[] {
	const colWidth = 600 / params.element.col[1]
	const rowHeight = 225 / params.element.row[1]

	const elementColsAmount =
		params.element.col[0][1] - params.element.col[0][0] + 1

	const elementWidth = elementColsAmount * colWidth
	const elementHeight =
		(params.element.row[0][1] - params.element.row[0][0] + 1) * rowHeight

	const area = elementWidth * elementHeight
	const fontSize = areasFontSizes[area] ?? 14

	const elementProperties = {
		pageObjectId: params.slideId,
		size: {
			width: { magnitude: elementWidth, unit: 'PT' },
			height: { magnitude: elementHeight, unit: 'PT' },
		},
		transform: {
			scaleX: 1,
			scaleY: 1,
			translateX: 60 + (params.element.col[0][0] - 1) * colWidth,
			translateY: 100 + (params.element.row[0][0] - 1) * rowHeight,
			unit: 'PT',
		},
	}

	if (params.element.type === 'text') {
		const backgroundRequests = params.element.background
			? params.element.background.type === 'solid'
				? [
						{
							updateShapeProperties: {
								objectId: params.element.id,
								shapeProperties: {
									shapeBackgroundFill: {
										solidFill: {
											color: {
												rgbColor: hexToRgb(params.element.background.color),
											},
										},
									},
								},
								fields: 'shapeBackgroundFill.solidFill.color',
							},
						},
					]
				: [
						{
							updateShapeProperties: {
								objectId: params.element.id,
								shapeProperties: {
									shapeBackgroundFill: {
										stretchedPictureFill: {
											contentUrl: params.element.background.url,
										},
									},
								},
								fields: 'shapeBackgroundFill.stretchedPictureFill.contentUrl',
							},
						},
					]
			: []

		return [
			{
				createShape: {
					objectId: params.element.id,
					shapeType: 'TEXT_BOX',
					elementProperties,
				},
			},
			...backgroundRequests,
			{
				insertText: {
					objectId: params.element.id,
					insertionIndex: 0,
					text: params.element.content,
				},
			},
			{
				updateTextStyle: {
					objectId: params.element.id,
					textRange: { type: 'ALL' },
					style: {
						fontFamily: params.element.style?.fontFamily ?? 'Arial',
						fontSize: {
							magnitude: fontSize,
							unit: 'PT',
						},
						bold: params.element.style?.bold,
						italic: params.element.style?.italic,
						foregroundColor: params.element.style?.color
							? {
									opaqueColor: {
										rgbColor: hexToRgb(params.element.style.color),
									},
								}
							: undefined,
					},
					fields: [
						'fontFamily',
						'fontSize',
						params.element.style?.bold ? 'bold' : null,
						params.element.style?.italic ? 'italic' : null,
						params.element.style?.color ? 'foregroundColor' : null,
					]
						.filter(Boolean)
						.join(','),
				},
			},
		]
	}

	if (params.element.type === 'image')
		return [
			{
				createImage: {
					objectId: params.element.id,
					url: params.element.url,
					elementProperties,
				},
			},
		]

	const chartUrl = generateQuickChartURL({
		type: params.element.chartType,
		data: params.element.data,
		title: params.element.title,
	})

	return [
		{
			createImage: {
				objectId: params.element.id,
				url: chartUrl,
				elementProperties,
			},
		},
	]
}
