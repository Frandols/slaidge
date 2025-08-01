/**
 * Get RGB object from RGB string.
 *
 * @param rgbString The RGB string.
 * @returns The RGB object.
 */
export default function parseRgbString(rgbString: string): {
	red: number
	green: number
	blue: number
} {
	const match = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
	if (!match) throw new Error('Invalid RGB string format ' + rgbString)
	const [, r, g, b] = match.map(Number)
	return {
		red: r! / 255,
		green: g! / 255,
		blue: b! / 255,
	}
}
