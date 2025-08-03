import { z } from 'zod'

import prebuiltRequestsSchema, {
	prebuiltRequestsExecutables,
} from '@/schemas/prebuilt-requests'

/**
 * Go from prebuilt requests to Google Slides API requests.
 *
 * @param requests The prebuilt requests array.
 * @returns The Google Slides API compatible requests.
 */
export default function prebuiltRequestsToAPIRequests(
	requests: z.infer<typeof prebuiltRequestsSchema>['requests']
) {
	return requests
		.map((request) => {
			const argsId = Object.keys(request)[0]

			if (!argsId) throw new Error('PREBUILT_REQUEST_WITHOUT_ARGS')

			if (!(argsId in prebuiltRequestsExecutables))
				throw new Error('PREBUILT_REQUEST_WITHOUT_EXECUTABLE')

			const executable =
				prebuiltRequestsExecutables[
					argsId as keyof typeof prebuiltRequestsExecutables
				]

			const args = request[argsId as keyof typeof request] as Parameters<
				typeof executable
			>[0]

			// @ts-expect-error
			return executable(args)
		})
		.flat()
}
