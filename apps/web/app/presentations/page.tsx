import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import CreatePresentationItem from '@/components/create-presentation-item'
import PresentationItem from '@/components/presentation-item'
import PresentationsHeader from '@/components/presentations-header'
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
			title: `${userProfile.name.split(' ')[0]}'s presentations | Slaidge`,
		}
	} catch {
		return { title: 'Presentations | Slaidge' }
	}
}

export default async function PresentationsPage() {
	try {
		const cookieStore = await cookies()

		const accessToken = await requireAccessToken(cookieStore)

		const userProfile = await getUserProfile(accessToken)

		const [userPresentations, userCreditBalance] = await Promise.all([
			getUserPresentations(userProfile.id),
			getUserCreditBalance(userProfile.id),
		])

		return (
			<div className='grid grid-rows-[min-content_1fr] h-screen'>
				<PresentationsHeader
					user={{
						avatarUrl: userProfile.avatarUrl,
						name: userProfile.name,
						creditBalance: userCreditBalance,
					}}
				/>
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4'>
					<CreatePresentationItem />
					{userPresentations.map((presentation) => (
						<PresentationItem
							key={presentation.id}
							id={presentation.id}
							title={presentation.title}
							updatedAt={presentation.updatedAt}
						/>
					))}
				</div>
			</div>
		)
	} catch (error) {
		redirect('/log-in')
	}
}
