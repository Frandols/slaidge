import presentationDetails, {
	DetailablePresentation,
} from './detailers/presentation'

interface ElementCore {
	id: string
}

type Element =
	| ElementCore
	| (ElementCore &
			(
				| {
						shape: {
							type: 'RECTANGLE' | 'ELLIPSE'
							text: {
								textElements: {
									content: string
								}[]
							}
						}
				  }
				| {
						imageUrl: string
				  }
				| {
						videoId: string
				  }
			))

/**
 * Generate a text for fixing a object with requests.
 *
 * @param presentation The presentation object.
 * @param failedObject The stringified object with the requests that failed.
 * @param error The error text.
 * @returns The text with the details for fixing the object.
 */
export default function fixRequestsObjectPrompt(
	presentation: DetailablePresentation,
	fail: { object: string; error: string }
) {
	return `You are in charge of fixing an object with the requests for submitting a batchUpdate request to the Google Slides API. A previous request was send, but it failed and now you have to fix it.

${presentationDetails(presentation)}

<---- THE FAILED REQUEST ---->
${fail.object}

<---- DETAILS ABOUT THE ERROR ---->
${fail.error}`
}
