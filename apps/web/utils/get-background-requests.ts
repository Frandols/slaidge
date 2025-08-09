import { z } from 'zod'

import themeSchema from '@/schemas/theme'
import hexToRgb from '@/utils/hex-to-rgb'

/**
 * Get the native requests for the background of an object.
 *
 * @param id The object ID.
 * @param theme The presentation's theme.
 * @returns Native requests for styling background.
 */
export default function getBackgroundRequests(
	id: string,
	theme: z.infer<typeof themeSchema>
) {
	const backgroundRequests = [
		{
			updatePageProperties: {
				objectId: id,
				pageProperties: {
					pageBackgroundFill: {
						solidFill: {
							color: {
								rgbColor: hexToRgb(theme.colors.background),
							},
						},
					},
				},
				fields: 'pageBackgroundFill.solidFill.color',
			},
		},
	]

	return backgroundRequests
}
