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
}: {
	type: 'BAR' | 'LINE' | 'PIE'
	data: { label: string; value: number }[]
	title: string
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
					backgroundColor: [
						'#3366CC',
						'#DC3912',
						'#FF9900',
						'#109618',
						'#990099',
						'#0099C6',
						'#DD4477',
					],
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
