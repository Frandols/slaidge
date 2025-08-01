'use client'

import { createContext, useContext, useState } from 'react'

interface TogglingContextValues {
	value: boolean
	toggle: () => void
}

const TogglingContext = createContext<TogglingContextValues | null>(null)

export const useToggling = () => {
	const context = useContext(TogglingContext)

	if (context === null)
		throw new Error('useToggling can just be used under a TogglingContext')

	return context
}

export default function Toggling(props: React.PropsWithChildren) {
	const [value, setValue] = useState<boolean>(false)

	const toggle = () => {
		setValue(!value)
	}

	return (
		<TogglingContext.Provider value={{ value, toggle }}>
			{props.children}
		</TogglingContext.Provider>
	)
}
