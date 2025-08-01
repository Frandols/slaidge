'use client'

import { useTheme } from 'next-themes'

import { Switch } from '@workspace/ui/components/switch'

export default function ThemeSwitch() {
	const { theme, setTheme } = useTheme()

	const checked = theme === 'dark'
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
