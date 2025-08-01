'use client'

import PresentationsHeader from '@/components/presentations-header'
import { useCreditBalance } from '@/contexts/credit-balance'

export default function PresentationHeaderWithUpdatedCreditBalance(
	props: Omit<React.ComponentProps<typeof PresentationsHeader>, 'user'> & {
		user: Omit<
			React.ComponentProps<typeof PresentationsHeader>['user'],
			'creditBalance'
		>
	}
) {
	const updatableCreditBalance = useCreditBalance()

	return (
		<PresentationsHeader
			{...props}
			user={{
				...props.user,
				creditBalance: {
					value: updatableCreditBalance.value,
				},
			}}
		/>
	)
}
