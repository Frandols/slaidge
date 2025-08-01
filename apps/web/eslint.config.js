import { nextJsConfig } from '@workspace/eslint-config/next-js'

/** @type {import("eslint").Linter.Config} */
export default {
	...nextJsConfig,
	rules: {
		...nextJsConfig.rules,
		'@next/next/no-img-element': 'off',
	},
}
