/**
 * Get the Google Slides API requests to add a QR code that links to the presentation.
 *
 * @param slideId The ID of the slide where the QR code will be placed.
 * @param presentationId The ID of the presentation.
 * @returns The requests to add the QR code.
 */
export default function getQRCodeRequests(
	slideId: string,
	presentationId: string
): unknown[] {
	const presentationLink = `https://slaidge.com/presentations/${presentationId}`

	return [
		{
			createImage: {
				objectId: `${slideId}_QR`,
				url: `https://quickchart.io/qr?text=${presentationLink}&margin=2&size=150`,
				elementProperties: {
					pageObjectId: slideId,
					size: {
						width: { magnitude: 1000000, unit: 'EMU' },
						height: { magnitude: 1000000, unit: 'EMU' },
					},
					transform: {
						scaleX: 1,
						scaleY: 1,
						translateX: 9150000,
						translateY: 0,
						unit: 'EMU',
					},
				},
			},
		},
		{
			updateImageProperties: {
				objectId: `${slideId}_QR`,
				imageProperties: {
					link: {
						url: presentationLink,
					},
				},
				fields: 'link',
			},
		},
	]
}
