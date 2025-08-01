'use client'

import {
	QueryClientProvider as Provider,
	QueryClient,
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function QueryClientProvider(props: React.PropsWithChildren) {
	return <Provider client={queryClient}>{props.children}</Provider>
}
