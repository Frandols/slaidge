import PresentationItem from './presentation-item'

type PresentationsList = {
	id: string
	title: string
	updatedAt: string
}[]

interface PresentationsListProps {
	value: PresentationsList
}

export default function PresentationsList(props: PresentationsListProps) {
	return (
		<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4'>
			{props.value.map((presentation) => (
				<PresentationItem
					key={presentation.id}
					id={presentation.id}
					title={presentation.title}
					updatedAt={presentation.updatedAt}
				/>
			))}
		</div>
	)
}
