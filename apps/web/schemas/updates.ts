import { z } from 'zod'

import prebuiltRequestsSchema from './prebuilt-requests'

const updatesSchema = z.array(
	z.discriminatedUnion('type', [
		z
			.object({
				type: z.literal('custom'),
				requests: z
					.array(z.object({}).passthrough())
					.describe('Google Slides API compatible batchUpdate requests'),
			})
			.describe('Used for custom requests to the Google Slides API'),
		z.object({ type: z.literal('prebuilt') }).merge(prebuiltRequestsSchema),
	])
)

export default updatesSchema
