/**
 * Get the credit balance of the current user.
 *
 * @returns Credits amount.
 */
export default async function getCreditBalance(): Promise<number> {
	const response = await fetch('/api/credit-balance')

	if (!response.ok) throw new Error('FAILED_TO_FETCH_CREDIT_BALANCE')

	const json = (await response.json()) as { creditBalance: number }

	return json.creditBalance
}
