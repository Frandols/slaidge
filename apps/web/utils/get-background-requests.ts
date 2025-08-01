import backgroundSettingsSchema from '@/schemas/background-settings'
import { z } from 'zod'
import hexToRgb from './hex-to-rgb'

export default function getBackgroundRequests(
	id: string,
	backgroundSettings: z.infer<typeof backgroundSettingsSchema>
) {
	const backgroundRequests =
		backgroundSettings.type === 'solid'
			? [
					{
						updatePageProperties: {
							objectId: id,
							pageProperties: {
								pageBackgroundFill: {
									solidFill: {
										color: {
											rgbColor: hexToRgb(backgroundSettings.color),
										},
									},
								},
							},
							fields: 'pageBackgroundFill.solidFill.color',
						},
					},
				]
			: [
					{
						updatePageProperties: {
							objectId: id,
							pageProperties: {
								pageBackgroundFill: {
									stretchedPictureFill: {
										contentUrl: backgroundSettings.url,
									},
								},
							},
							fields: 'pageBackgroundFill.stretchedPictureFill.contentUrl',
						},
					},
				]

	return backgroundRequests
}
