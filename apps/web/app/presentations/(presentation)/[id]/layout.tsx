import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import BadgeLink from '@/components/badge-link'
import Chat from '@/components/chat'
import PresentationAside from '@/components/presentation-aside'
import PresentationHeader from '@/components/presentation-header'
import PresentationNav from '@/components/presentation-nav'
import CreditBalance from '@/contexts/credit-balance'
import LastEditionTime from '@/contexts/last-edition-time'
import Slides from '@/contexts/slides'
import requireAccessToken from '@/guards/require-access-token'
import getPresentation from '@/services/google/get-presentation'
import getUserProfile from '@/services/google/get-user-profile'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>
}): Promise<Metadata> {
	try {
		const { id } = await params

		const cookieStore = await cookies()
		const accessToken = await requireAccessToken(cookieStore)

		const presentation = await getPresentation(id, accessToken)

		return { title: presentation.title }
	} catch {
		return { title: 'Presentación' }
	}
}

export default async function PresentationLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	try {
		const cookieStore = await cookies()

		const accessToken = await requireAccessToken(cookieStore)

		const [presentation, userProfile] = await Promise.all([
			getPresentation(id, accessToken),
			getUserProfile(accessToken),
		])

		const userCreditBalance = await getUserCreditBalance(userProfile.id)

		return (
			<div className='grid grid-rows-[min-content_1fr] h-screen'>
				<CreditBalance initialValue={userCreditBalance}>
					<PresentationHeader
						presentation={{
							id: presentation.id,
							title: presentation.title,
						}}
						user={{
							avatarUrl: userProfile.avatarUrl,
							name: userProfile.name,
						}}
					/>
					<div className='grid grid-rows-[min-content_1fr] grid-cols-1 md:grid-rows-1 h-full overflow-auto relative md:grid-cols-[auto_min-content]'>
						<LastEditionTime initialValue={presentation.lastEditionTime}>
							<Slides initialValue={presentation.slides}>
								<div className='grid grid-rows-[1fr_133px] overflow-auto'>
									<main className='p-4 overflow-hidden flex flex-col justify-center items-center relative'>
										{children}
									</main>
									<PresentationNav
										presentation={{
											id: presentation.id,
										}}
									/>
								</div>
								<PresentationAside>
									<Chat
										presentation={{
											id: presentation.id,
										}}
									/>
								</PresentationAside>
							</Slides>
						</LastEditionTime>
					</div>
				</CreditBalance>
			</div>
		)
	} catch (error) {
		if (!(error instanceof Error)) return

		switch (error.message) {
			case 'UNAUTHENTICATED':
				redirect('/log-in')
			default:
				return (
					<section className='h-screen grid place-content-center'>
						<div className='flex flex-col gap-2 text-start px-4'>
							<p className='text-primary text-sm'>
								Hubo un fallo al obtener los datos
							</p>
							<p className='text-2xl font-bold'>
								Asegurate de que la presentación existe y que tienes acceso a
								ella
							</p>
							<BadgeLink
								className='w-min'
								href='/presentations'
							>
								Go to my presentations
							</BadgeLink>
						</div>
					</section>
				)
		}
	}
}
