import { z } from 'zod'
import createInformativeElement, {
	createInformativeElementParamsSchema,
} from './create-informative-element'
import createInformativeSlide, {
	createInformativeSlideParamsSchema,
} from './create-informative-slide'
import createSectionOpeningSlide, {
	createSectionOpeningSlideParamsSchema,
} from './create-section-opening-slide'

export const prebuiltRequestsExecutables = {
	createInformativeSlide,
	createSectionOpeningSlide,
	createInformativeElement,
}

const prebuiltRequestsSchema = z.object({
	requests: z.array(
		z.union([
			z.object({ createInformativeSlide: createInformativeSlideParamsSchema }),
			z.object({
				createSectionOpeningSlide: createSectionOpeningSlideParamsSchema,
			}),
			z.object({
				createInformativeElement: createInformativeElementParamsSchema,
			}),
		])
	),
})

export default prebuiltRequestsSchema
