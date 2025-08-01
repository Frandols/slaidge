'use client'

import { createContext, useContext, useState } from 'react'

type Slide = { id: string }

interface SlidesContextValues {
	value: Slide[]
	update: (newSlides: Slide[]) => void
}

const SlidesContext = createContext<SlidesContextValues | null>(null)

export const useSlides = () => {
	const context = useContext(SlidesContext)

	if (context === null)
		throw new Error('useSlides can just be used under a SlidesContext')

	return context
}

interface SlidesProps extends React.PropsWithChildren {
	initialValue: Slide[]
}

export default function Slides(props: SlidesProps) {
	const [value, setValue] = useState<Slide[]>(props.initialValue)

	const update = (newValue: Slide[]) => {
		setValue(newValue)
	}

	return (
		<SlidesContext.Provider value={{ value, update }}>
			{props.children}
		</SlidesContext.Provider>
	)
}
