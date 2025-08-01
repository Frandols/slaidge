'use client'

import { createContext, useContext, useState } from 'react'

interface CreditBalanceContextValues {
	value: number
	update: (newValue: number) => void
}

const CreditBalanceContext = createContext<CreditBalanceContextValues | null>(
	null
)

export const useCreditBalance = () => {
	const context = useContext(CreditBalanceContext)

	if (context === null)
		throw new Error(
			'useCreditBalance can just be used under a CreditBalanceContext'
		)

	return context
}

interface CreditBalanceProps extends React.PropsWithChildren {
	initialValue: number
}

export default function CreditBalance({
	initialValue: initialCreditBalance,
	...props
}: CreditBalanceProps) {
	const [value, setValue] = useState<number>(initialCreditBalance)

	const update = (newValue: number) => {
		setValue(newValue)
	}

	return (
		<CreditBalanceContext.Provider value={{ value, update }}>
			{props.children}
		</CreditBalanceContext.Provider>
	)
}
