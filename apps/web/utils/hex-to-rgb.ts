/**
 * Get RGB object from hex string.
 *
 * @param hex The hex string.
 * @returns The RGB object.
 */
export default function hexToRgb(hex: string) {
	const val = hex.replace('#', '')

	const bigint = parseInt(val, 16)

	return {
		red: ((bigint >> 16) & 255) / 255,
		green: ((bigint >> 8) & 255) / 255,
		blue: (bigint & 255) / 255,
	}
}
