'use client'

import PresentationsHeader from '@/components/presentations-header'
import { useCreditBalance } from '@/contexts/credit-balance'

export default function PresentationHeader(
	props: Omit<React.ComponentProps<typeof PresentationsHeader>, 'user'> & {
		user: Omit<
			React.ComponentProps<typeof PresentationsHeader>['user'],
			'creditBalance'
		>
	}
) {
	const creditBalance = useCreditBalance()

	return (
		<PresentationsHeader
			{...props}
			user={{
				...props.user,
				creditBalance: creditBalance.value,
			}}
		/>
	)
}
