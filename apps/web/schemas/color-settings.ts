import { z } from 'zod'

const colorSettingsSchema = z.string().regex(/^#([A-Fa-f0-9]{6})$/)

export default colorSettingsSchema
