import Anthropic from '@anthropic-ai/sdk'
import { MessageCountTokensTool } from '@anthropic-ai/sdk/resources/messages.mjs'

const INPUT_TOKENS_PER_CREDIT = Number(process.env.INPUT_TOKENS_PER_CREDIT)
const client = new Anthropic({
	apiKey: process.env.ANTHROPIC_API_KEY!,
})

/**
 * Get maximum amount of output tokens based on the agent arguments.
 *
 * @param messages The messages array.
 * @param model The model ID.
 * @param system The system prompt.
 * @param tools The tools object.
 * @returns Maximum amount of output tokens allowed.
 */
export default async function getMaxOutputTokens(
	messages: { role: 'user' | 'assistant'; content: string }[],
	model: string,
	system?: string,
	tools?: MessageCountTokensTool[]
): Promise<number> {
	try {
		const { input_tokens: inputTokens } = await client.messages.countTokens({
			model,
			messages: messages.map((message) => ({
				role: message.role,
				content: message.content,
			})),
			system,
			tools,
		})

		if (inputTokens > Number(process.env.INPUT_TOKENS_PER_CREDIT))
			throw new Error('INPUT_TOO_LARGE')

		const remainingInputTokens = INPUT_TOKENS_PER_CREDIT - inputTokens

		return Math.floor(remainingInputTokens * 0.2)
	} catch {
		throw new Error('FAILED_TO_GET_MAX_OUTPUT_TOKENS')
	}
}
