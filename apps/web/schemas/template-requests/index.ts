import { z } from 'zod'

import createChartSlide, {
	createChartSlideParamsSchema,
} from './create-chart-slide'
import createInformativeElement, {
	createInformativeElementParamsSchema,
} from './create-informative-element'
import createInformativeSlide, {
	createInformativeSlideParamsSchema,
} from './create-informative-slide'
import createSectionOpeningSlide, {
	createSectionOpeningSlideParamsSchema,
} from './create-section-opening-slide'

export const templateRequestsExecutables = {
	createInformativeSlide,
	createSectionOpeningSlide,
	createInformativeElement,
	createChartSlide,
}

const templateRequestsSchema = z.object({
	requests: z.array(
		z.union([
			z.object({ createInformativeSlide: createInformativeSlideParamsSchema }),
			z.object({
				createSectionOpeningSlide: createSectionOpeningSlideParamsSchema,
			}),
			z.object({
				createInformativeElement: createInformativeElementParamsSchema,
			}),
			z.object({
				createChartSlide: createChartSlideParamsSchema,
			}),
		])
	),
})

export default templateRequestsSchema
