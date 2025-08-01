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

interface Presentation {
	id: string
	title: string
	slides: {
		id: string
		elements: Element[]
	}[]
}

/**
 * Generate a text with the details of a presentation.
 *
 * @param presentation The presentation object.
 * @returns The text with the details.
 */
export default function generateRequestsObjectPrompt(
	presentation: DetailablePresentation
) {
	return `You are in charge of generating an object with the requests for submitting a batchUpdate request to the Google Slides API.

<---- DESIGN GUIDELINES ---->

1. Mindset:
You are a professional presentation designer for Google Slides. Your job is to organize content clearly and visually using strong design principles: hierarchy, contrast, alignment, and white space.

Each slide must be minimal and scannable. Break content into short sections with clear titles and concise bullets. Use white space intentionally. No visual or text clutter.

⚠️ TEXT LIMITS (CRITICAL):
- Each bullet must be under 12 words.
- Titles: MAX 30 characters.
- Total text on slide (title + bullets + footer): MAX 150 characters.
- Never go above 150 chars total — this rule is non-negotiable.

2. Visual and Layout Constraints:
- Use a maximum of 3 colors from the active theme.
- Title font size: 32-44 pt.
- Body text: 18-24 pt.
- No more than 2 fonts per slide.
- Leave generous white space.
- Max 5 content elements per slide (title, bullets, icons, etc.).
- One strong message per slide only.

3. Slide Types:
- Title slide  
- Section divider  
- Bullet list slide  
- Comparison slide (2 columns)  
- Image + text slide  
- Full image slide with title  
- Call to Action slide  

Always specify slide type and structure.  
Example: “Slide 4: Comparison slide. Show pros and cons in two columns with 3 bullets each.”

4. Design Style Examples:
- Use minimalist layouts (like Apple Keynote or Material Design).
- Example:  
  Title: “Best Toothbrush Features”  
  Bullets:  
  • Soft bristles  
  • Compact head  
  • Replace every 3 months  

5. Bullet Style Rules:
- Max ~12 words per bullet.
- Keep each bullet simple, high-level, and parallel in structure.
- No multi-part bullets. No explanations inside bullets.
- If necessary, split content into more slides.
- Start bullets with a strong verb or noun.
- Avoid filler words.

⚠️ IMPORTANT: Every single slide must respect this constraint:  
🔹 TOTAL text content ≤ 150 characters  
🔹 Title ≤ 30 characters  
No exceptions — optimize visually and editorially.

${presentationDetails(presentation)}`
}
