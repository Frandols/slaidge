/**
 * Sanitize AI response text.
 *
 * @param text The raw text.
 * @returns The sanitized text.
 */
export default function sanitizeText(text: string) {
	return text.replace('<has_function_call>', '')
}
