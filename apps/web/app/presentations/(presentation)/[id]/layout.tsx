import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPresentationById } from '@/app/api/presentations/[id]/route'
import Chat from '@/components/chat'
import PresentationHeaderWithUpdatedCreditBalance from '@/components/presentation-header-with-updatable-credit-balance'
import PresentationNav from '@/components/presentation-nav'
import TogglablePresentationLayout, {
	ToggablePresentationLayoutAside,
	ToggablePresentationLayoutToggler,
} from '@/components/togglable-presentation-layout'
import CreditBalance from '@/contexts/credit-balance'
import LastEditionTime from '@/contexts/last-edition-time'
import Slides from '@/contexts/slides'
import Toggling from '@/contexts/toggling'
import requireAccessToken from '@/guards/require-access-token'
import getUserProfile from '@/services/google/get-user-profile'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'

export async function generateMetadata({
	params,
}: {
	params: { id: string }
}): Promise<Metadata> {
	try {
		const { id } = await params

		const cookieStore = await cookies()
		const accessToken = await requireAccessToken(cookieStore)

		const presentation = await getPresentationById(id, accessToken)

		return { title: `${presentation.title} | Slaidge` }
	} catch {
		return { title: 'Presentacion | Slaidge' }
	}
}

export default async function PresentationLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: { id: string }
}) {
	const { id } = await params

	try {
		const cookieStore = await cookies()
		const accessToken = await requireAccessToken(cookieStore)

		const presentation = await getPresentationById(id, accessToken)

		const userProfile = await getUserProfile(accessToken)
		const creditBalance = await getUserCreditBalance(userProfile.id)

		return (
			<Toggling>
				<div className='grid grid-rows-[min-content_1fr] h-screen'>
					<CreditBalance initialValue={creditBalance}>
						<PresentationHeaderWithUpdatedCreditBalance
							presentation={{
								id: presentation.id,
								title: presentation.title,
							}}
							user={{
								avatarUrl: userProfile.avatarUrl,
								name: userProfile.name,
							}}
						/>
						<TogglablePresentationLayout>
							<LastEditionTime>
								<Slides initialValue={presentation.slides}>
									<div className='grid grid-rows-[1fr_133px] overflow-auto'>
										<main className='p-4 overflow-hidden flex flex-col justify-center items-center relative'>
											<div className='absolute top-0 right-0 w-20 h-20 grid place-content-center z-20'>
												<div className='p-1'>
													<ToggablePresentationLayoutToggler />
												</div>
											</div>
											{children}
										</main>
										<PresentationNav presentationId={presentation.id} />
									</div>
									<ToggablePresentationLayoutAside>
										<Chat presentationId={id} />
									</ToggablePresentationLayoutAside>
								</Slides>
							</LastEditionTime>
						</TogglablePresentationLayout>
					</CreditBalance>
				</div>
			</Toggling>
		)
	} catch {
		redirect(`/api/access-tokens?redirect_path=/presentations/${id}`)
	}
}
