import { z } from 'zod'

export const CREDITS_25 = 'credits-25' as const
export const CREDITS_50 = 'credits-50' as const
export const CREDITS_150 = 'credits-150' as const

const offerIdSchema = z.enum([CREDITS_25, CREDITS_50, CREDITS_150])

export default offerIdSchema
