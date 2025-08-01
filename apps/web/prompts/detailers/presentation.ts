interface Dimension {
	value: number
	unit: string
}

interface Size {
	width: Dimension
	height: Dimension
}

interface Transform {
	scaleX?: number
	scaleY?: number
	shearX?: number
	shearY?: number
	translateX: number
	translateY: number
	unit: string
}

interface ElementCore {
	id: string
	size: Size
	transform: Transform
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

export interface DetailablePresentation {
	id: string
	title: string
	slides: {
		id: string
		elements: Element[]
	}[]
	pageSize: Size
}

/**
 * Get the prompt that gives AI context of a presentation.
 *
 */
export default function presentationDetails(
	presentation: DetailablePresentation
): string {
	const slidePrompts = presentation.slides.map((slide, index) => {
		const elementPrompts = slide.elements.map((element, index) => {
			const header = `< Element ${index}, ID: "${element.id}" >
It's ID is "${element.id}".
It's size is ${element.size.width.value} ${element.size.width.unit} of width, and ${element.size.height.value} ${element.size.height.unit} of height. It's position is given by the following "AffineTransform" object: ${JSON.stringify(element.transform)}
`

			if ('shape' in element)
				return `${header} The element is a shape, it has ${element.shape.text.textElements.length} text elements inside: ${JSON.stringify(element.shape.text.textElements.map((element) => element.content))}.`

			if ('imageUrl' in element)
				return `${header} The element is an image, its url is ${element.imageUrl}.`

			if ('videoId' in element)
				return `${header} The element is a video, the video ID is "${element.videoId}".`

			return `${header} The type of the element is unknown.`
		})

		return `<-- Slide ${index}, ID: "${slide.id}" -->
It's ID is "${slide.id}". It has ${slide.elements.length} elements.

${
	slide.elements.length > 0
		? `<- Details about slide ${index}'s elements -> 
${elementPrompts.join('\n\n')}`
		: ''
}`
	})

	return `<---- DETAILS ABOUT THE PRESENTATION ---->
The presentation has the title ${presentation.title} and it's ID is "${presentation.id}". 
It has ${presentation.slides.length} slides.
It's page size is ${presentation.pageSize.width.value} ${presentation.pageSize.width.unit} of width, and ${presentation.pageSize.height.value} ${presentation.pageSize.height.unit} of height.

${
	presentation.slides.length > 0
		? `<--- Details about the slides --->
${slidePrompts.join('\n\n')}`
		: ''
}`
}
