const MAX_TOTAL_SIZE_BYTES = 10 * 1024 * 1024
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const MAX_PROMPT_BYTES = 5000

/**
 * Require the total prompt size to be minor than 5MB.
 *
 * @param prompt A text prompt.
 * @param files A files array.
 */
export default function requireAdmitedPromptSize(
	prompt: string,
	files: { size: number }[]
) {
	const promptBytes = new TextEncoder().encode(prompt).length
	if (promptBytes > MAX_PROMPT_BYTES)
		throw new Error('EXCEEDED_MAX_PROMPT_BYTES')

	let filesBytes = 0
	for (const file of files) {
		if (file.size > MAX_FILE_SIZE_BYTES)
			throw new Error('EXCEEDED_MAX_FILE_SIZE_BYTES')

		filesBytes += file.size
	}

	const totalSize = filesBytes + promptBytes
	if (totalSize > MAX_TOTAL_SIZE_BYTES)
		throw new Error('EXCEEDED_MAX_TOTAL_SIZE_BYTES')
}
