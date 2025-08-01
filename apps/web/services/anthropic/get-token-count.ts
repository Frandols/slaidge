import Anthropic from '@anthropic-ai/sdk'
import { MessageCountTokensTool } from '@anthropic-ai/sdk/resources/messages.mjs'

const client = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY!,
})

/**
 * Get the token count for a text.
 *
 * @param text The text.
 * @returns The count number.
 */
export default async function getTokenCount(
	messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
	model: 'claude-3-5-haiku-latest' | 'claude-4-sonnet-20250514',
	tools?: MessageCountTokensTool[]
): Promise<number> {
	try {
		const tokenCount = await client.messages.countTokens({
			model,
			messages: messages.map((message) => ({
				role: message.role === 'user' ? 'user' : 'assistant',
				content: message.content,
			})),
			tools,
		})

		return tokenCount.input_tokens
	} catch {
		throw new Error('FAILED_TO_FETCH_TOKEN_COUNT')
	}
}
