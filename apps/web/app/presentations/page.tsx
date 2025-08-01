import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import PresentationsHeader from '@/components/presentations-header'
import PresentationsList from '@/components/presentations-list'
import requireAccessToken from '@/guards/require-access-token'
import getUserProfile from '@/services/google/get-user-profile'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'
import getUserPresentations from '@/services/supabase/get-user-presentations'

export async function generateMetadata(): Promise<Metadata> {
	try {
		const cookieStore = await cookies()
		const accessToken = await requireAccessToken(cookieStore)

		const userProfile = await getUserProfile(accessToken)

		return {
			title: `Presentaciones de ${userProfile.name.split(' ')[0]} | Slaidge`,
		}
	} catch {
		return { title: 'Presentaciones | Slaidge' }
	}
}

export default async function PresentationsPage() {
	try {
		const cookieStore = await cookies()
		const accessToken = await requireAccessToken(cookieStore)
		const userProfile = await getUserProfile(accessToken)
		const presentationsList = await getUserPresentations(userProfile.id)

		const creditBalance = await getUserCreditBalance(userProfile.id)

		return (
			<div className='grid grid-rows-[min-content_1fr] h-screen'>
				<PresentationsHeader
					user={{
						avatarUrl: userProfile.avatarUrl,
						name: userProfile.name,
						creditBalance: {
							value: creditBalance,
						},
					}}
				/>
				<PresentationsList value={presentationsList} />
			</div>
		)
	} catch (error) {
		redirect('/api/access-tokens?redirect_path=/presentations')
	}
}
