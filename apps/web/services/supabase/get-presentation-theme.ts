import createSupabaseClient from '@/clients/factories/supabase'
import themeSchema from '@/schemas/theme'

/**
 * Get a presentation's theme by ID.
 *
 * @param presentationId The presentation's ID.
 * @returns A theme object.
 */
export async function getPresentationTheme(presentationId: string) {
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

	const parsed = themeSchema.parse(rawTheme)

	return parsed
}
