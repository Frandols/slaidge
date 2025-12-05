import { z } from 'zod'

import templateRequestsSchema, {
	templateRequestsExecutables,
} from '@/schemas/template-requests'
import themeSchema from '@/schemas/theme'

/**
 * Go from template requests to Google Slides API requests.
 *
 * @param requests The template requests array.
 * @returns The Google Slides API compatible requests.
 */
export default function templateToRawRequests(
	requests: z.infer<typeof templateRequestsSchema>['requests'],
	theme: z.infer<typeof themeSchema>,
	presentationId: string
) {
	return requests
		.map((request) => {
			const argsId = Object.keys(request)[0]

			if (!argsId) throw new Error('TEMPLATE_REQUEST_WITHOUT_ARGS')

			if (!(argsId in templateRequestsExecutables))
				throw new Error('TEMPLATE_REQUEST_WITHOUT_EXECUTABLE')

			const executable =
				templateRequestsExecutables[
					argsId as keyof typeof templateRequestsExecutables
				]

			const args = request[argsId as keyof typeof request] as Parameters<
				typeof executable
			>[0]

			// @ts-expect-error
			return executable(args, theme, presentationId)
		})
		.flat()
}
