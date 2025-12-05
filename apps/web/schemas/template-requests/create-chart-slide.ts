import z from 'zod'

import createInformativeElement, {
	informativeElementSchema,
} from '@/schemas/template-requests/create-informative-element'
import createInformativeSlide, {
	createInformativeSlideParamsSchema,
} from '@/schemas/template-requests/create-informative-slide'
import themeSchema from '../theme'

export const createChartSlideParamsSchema =
	createInformativeSlideParamsSchema.extend({
		type: z
			.enum(['left', 'right'])
			.describe(
				'Defines if the chart must be shown to the left or to the right of the slide'
			),
		chart: z.object({
			id: z.string().min(1).describe('ID of the chart'),
			type: z.enum(['BAR', 'LINE', 'PIE']).describe('Type of chart'),
			title: z
				.string()
				.min(1)
				.max(50)
				.describe('Title of the chart, 50 characters maximum'),
			data: z
				.array(
					z.object({
						label: z.string().min(1),
						value: z.number(),
					})
				)
				.min(1)
				.describe('Data for the chart'),
		}),
		elements: z.array(informativeElementSchema).min(1).max(2),
	})

export default function createChartSlide(
	params: z.infer<typeof createChartSlideParamsSchema>,
	theme: z.infer<typeof themeSchema>,
	presentationId: string
) {
	const chartUrl = generateQuickChartURL({
		type: params.chart.type,
		data: params.chart.data,
		title: params.chart.title,
		theme,
	})

	const colWidth = 200
	const rowHeight = 112.5

	const elementColsAmount = 2

	const elementWidth = elementColsAmount * colWidth
	const elementHeight = 2 * rowHeight

	const elementProperties = {
		pageObjectId: params.id,
		size: {
			width: { magnitude: elementWidth, unit: 'PT' },
			height: { magnitude: elementHeight, unit: 'PT' },
		},
		transform: {
			scaleX: 1,
			scaleY: 1,
			translateX: 60 + (params.type === 'left' ? 0 : 1) * colWidth,
			translateY: 100,
			unit: 'PT',
		},
	}

	return [
		...createInformativeSlide(params, theme, presentationId),
		{
			createImage: {
				objectId: params.chart.id,
				url: chartUrl,
				elementProperties,
			},
		},
		...params.elements.flatMap((element) => {
			return createInformativeElement(
				{
					slideId: params.id,
					element: {
						...element,
						col: [params.type === 'left' ? [3, 3] : [1, 1], 3],
						row: element.row,
					},
				},
				theme
			)
		}),
	]
}

const baseUrl = 'https://quickchart.io/chart'
const chartTypeMap = {
	BAR: 'bar',
	LINE: 'line',
	PIE: 'pie',
} as const

function generateQuickChartURL({
	type,
	data,
	title,
	theme,
}: {
	type: 'BAR' | 'LINE' | 'PIE'
	data: { label: string; value: number }[]
	title: string
	theme: z.infer<typeof themeSchema>
}): string {
	const labels = data.map((d) => d.label)
	const values = data.map((d) => d.value)

	const chartConfig = {
		type: chartTypeMap[type],
		data: {
			labels,
			datasets: [
				{
					label: title,
					data: values,
					backgroundColor: theme.colors.chart,
				},
			],
		},
		options: {
			title: {
				display: true,
				text: title,
				fontSize: 18,
			},
			legend: {
				display: type !== 'BAR',
			},
		},
	}

	const encodedConfig = encodeURIComponent(JSON.stringify(chartConfig))

	return `${baseUrl}?c=${encodedConfig}`
}
