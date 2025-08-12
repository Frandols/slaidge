'use client'

import { createContext, useContext, useState } from 'react'

interface LastEditionTimeContextValues {
	value: number
	update: (newValue: number) => void
}

const LastEditionTimeContext =
	createContext<LastEditionTimeContextValues | null>(null)

export const useLastEditionTime = () => {
	const context = useContext(LastEditionTimeContext)

	if (context === null)
		throw new Error(
			'useLastEditionTime can just be used under a LastEditionTimeContext'
		)

	return context
}

interface LastEditionTimeProps extends React.PropsWithChildren {
	initialValue: number
}

export default function LastEditionTime(props: LastEditionTimeProps) {
	const [value, setValue] = useState<number>(props.initialValue)

	const update = (newValue: number) => {
		setValue(newValue)
	}

	return (
		<LastEditionTimeContext.Provider value={{ value, update }}>
			{props.children}
		</LastEditionTimeContext.Provider>
	)
}
