'use client'

import { useTheme } from 'next-themes'

import { Switch } from '@workspace/ui/components/switch'

export default function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme()

	const checked = resolvedTheme === 'dark'

	const onCheckedChange = (newChecked: boolean) => {
		setTheme(newChecked ? 'dark' : 'light')
	}

	return (
		<Switch
			checked={checked}
			onCheckedChange={onCheckedChange}
		/>
	)
}
