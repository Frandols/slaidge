'use client'

import { createContext, useContext, useState } from 'react'

interface LastEditionTimeContextValues {
	value: number
	update: () => void
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

export default function LastEditionTime(props: React.PropsWithChildren) {
	const [value, setValue] = useState<number>(0)

	const update = () => {
		setValue(Date.now())
	}

	return (
		<LastEditionTimeContext.Provider value={{ value, update }}>
			{props.children}
		</LastEditionTimeContext.Provider>
	)
}
