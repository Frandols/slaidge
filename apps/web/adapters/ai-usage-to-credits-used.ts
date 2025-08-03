const INPUT_TOKENS_PER_CREDIT = Number(process.env.INPUT_TOKENS_PER_CREDIT)
const OUTPUT_TOKENS_PER_CREDIT = Number(process.env.OUTPUT_TOKENS_PER_CREDIT)

/**
 * Get the total usage of credits.
 *
 * @param usage Usage object.
 * @returns Total credits used.
 */
export default function AIUsageToCreditsUsed(usage: {
	promptTokens: number
	completionTokens: number
}): number {
	const creditsUsedForInput = usage.promptTokens / INPUT_TOKENS_PER_CREDIT
	const creditsUsedForOutput = usage.completionTokens / OUTPUT_TOKENS_PER_CREDIT

	const creditsUsed =
		Math.ceil((creditsUsedForInput + creditsUsedForOutput) * 100) / 100

	return creditsUsed
}
