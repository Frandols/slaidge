import { z } from 'zod'
import colorSettingsSchema from './color-settings'

const styleSettingsSchema = z.object({
	fontFamily: z.string().describe('Font family of the text').optional(),
	bold: z.boolean().describe('Whether the text is bold').optional(),
	italic: z.boolean().describe('Whether the text is italic').optional(),
	color: colorSettingsSchema.describe('Hex color for the text').optional(),
})

export default styleSettingsSchema
