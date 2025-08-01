const INPUT_TOKENS_PER_CREDIT = 37500
const OUTPUT_TOKENS_PER_CREDIT = 7500

/**
 * Get the total usage of credits.
 *
 * @param usage Usage object.
 * @returns Total credits used.
 */
export default function getCreditsUsed(usage: {
	promptTokens: number
	completionTokens: number
}): number {
	const creditsUsedForInput = usage.promptTokens / INPUT_TOKENS_PER_CREDIT
	const creditsUsedForOutput = usage.completionTokens / OUTPUT_TOKENS_PER_CREDIT

	const creditsUsed =
		Math.ceil((creditsUsedForInput + creditsUsedForOutput) * 100) / 100

	return creditsUsed
}
