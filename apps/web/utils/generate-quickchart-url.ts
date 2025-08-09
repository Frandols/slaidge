import themeSchema from '@/schemas/theme'
import z from 'zod'

const baseUrl = 'https://quickchart.io/chart'
const chartTypeMap = {
	BAR: 'bar',
	LINE: 'line',
	PIE: 'pie',
} as const

export default function generateQuickChartURL({
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
