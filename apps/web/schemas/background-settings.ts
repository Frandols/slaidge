import { z } from 'zod'
import colorSettingsSchema from './color-settings'

const backgroundSettingsSchema = z.discriminatedUnion('type', [
	z.object({
		type: z.literal('solid').describe('Solid color background'),
		color: colorSettingsSchema.describe(
			'Hex color used for the solid background'
		),
	}),
	z.object({
		type: z.literal('image').describe('Image background'),
		url: z
			.string()
			.url()
			.describe('Public URL of the image to use as background'),
	}),
])

export default backgroundSettingsSchema
