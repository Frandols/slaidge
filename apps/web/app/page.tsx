import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

import CreatePresentationPrompt from '@/components/create-presentation-prompt'
import LinkBadge from '@/components/link-badge'
import Logo from '@/components/logo'
import PresentationsList from '@/components/presentations-list'
import PricingCard from '@/components/pricing-card'
import UserMenu from '@/components/user-menu'
import requireAccessToken from '@/guards/require-access-token'
import getUserProfile from '@/services/google/get-user-profile'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'
import getUserPresentations from '@/services/supabase/get-user-presentations'
import HeroVideoDialog from '@workspace/ui/components/magicui/hero-video-dialog'

import { Badge } from '@workspace/ui/components/badge'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip'

export const metadata: Metadata = {
	title: 'Construye tu presentación con IA, en minutos | Slaidge',
	description:
		'La app que te permite hacer tus presentaciones con inteligencia artificial y herramientas simplificadas.',
	openGraph: {
		title: 'Construye tu presentación con IA, en minutos | Slaidge',
		description:
			'La app que te permite hacer tus presentaciones con inteligencia artificial y herramientas simplificadas.',
		url: 'https://slaidge.com/',
		images: [{ url: '/share-main.webp' }],
	},
	twitter: {
		card: 'summary_large_image',
		creator: '@frandelosantos',
	},
}

async function checkUserLogged() {
	try {
		const cookieStore = await cookies()

		const accessToken = await requireAccessToken(cookieStore)

		const userProfile = await getUserProfile(accessToken)

		const presentationsList = await getUserPresentations(userProfile.id)
		const creditBalance = await getUserCreditBalance(userProfile.id)

		return { ...userProfile, presentationsList, creditBalance }
	} catch {
		return null
	}
}

export default async function HomePage() {
	const userProfile = await checkUserLogged()

	return (
		<div className='bg-background min-h-dvh'>
			<header className='max-w-7xl mx-auto py-5 px-4 md:px-8 flex gap-8 justify-between border-b border-dashed border-x'>
				<div className='flex gap-3 items-center'>
					<Logo />
					<h2 className='font-medium'>Slaidge</h2>
					<Tooltip>
						<TooltipContent side='bottom'>
							Pueden ocurrir errores durante el uso de la aplicación, comunicate
							con soporte de ser necesario
						</TooltipContent>
						<TooltipTrigger>
							<Badge>Beta</Badge>
						</TooltipTrigger>
					</Tooltip>
				</div>
				<ul className='flex gap-6 items-center'>
					<li className='hover:underline'>
						<Link href='#pricing'>Precios</Link>
					</li>
					{userProfile ? (
						<li className='grid place-content-center'>
							<UserMenu
								name={userProfile.name}
								avatar={userProfile.avatarUrl}
								creditBalance={userProfile.creditBalance}
							/>
						</li>
					) : (
						<li>
							<LinkBadge href={'/log-in'}>Ingresar</LinkBadge>
						</li>
					)}
				</ul>
			</header>
			<main className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col items-center border-x border-b pb-24 border-dashed'>
				<div className='max-w-3xl mx-auto flex flex-col gap-6 items-center mb-12'>
					<div
						className={
							'group rounded-full border border-accent-foreground/12.5 relative bg-accent w-min truncate py-1 px-4'
						}
					>
						<p className='text-xs md:text-[15px]'>
							Se guardarán en Google Slides ✨
						</p>
					</div>
					<h1 className='text-center font-extrabold text-4xl lg:text-6xl'>
						Construye tu presentación con IA,{' '}
						<span className='relative whitespace-nowrap'>
							<div className='absolute bg-primary h-[75%] -left-2 top-2 -bottom-1 -right-2 md:-left-3 md:top-2.125 lg:top-3 md:-bottom-0 md:-right-3 -rotate-1'></div>
							<span className='text-black relative'>en minutos</span>
						</span>
					</h1>
					<p className='text-center text-lg text-muted-foreground'>
						La app que te permite hacer tus presentaciones con{' '}
						<span className='text-accent-foreground'>
							inteligencia artificial
						</span>{' '}
						en tiempos récord
					</p>
				</div>
				<div className='max-w-3xl w-full h-[125px] md:h-[175px]'>
					<CreatePresentationPrompt
						creditBalance={userProfile?.creditBalance}
					/>
				</div>
			</main>
			{userProfile && userProfile.presentationsList.length > 0 ? (
				<div className='w-full'>
					<div className='max-w-7xl mx-auto px-4 md:px-8 border-x border-b border-dashed py-8'>
						<div className='w-full border border-dashed rounded-lg'>
							<div className='flex gap-2 items-center flex-wrap border-b border-dashed p-4'>
								<h2 className='text-xl md:text-2xl font-bold'>
									Presentaciones de {userProfile.name.split(' ')[0]}
								</h2>
								<LinkBadge href='/presentations'>
									Ir a mis presentaciones
								</LinkBadge>
							</div>
							<PresentationsList value={userProfile.presentationsList} />
						</div>
					</div>
				</div>
			) : null}
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col items-center border-x border-b border-dashed'>
				<h2 className='font-semibold text-xs md:text-sm text-black truncate px-2 mb-2 bg-primary rounded'>
					Demo
				</h2>
				<p className='text-2xl md:text-3xl text-accent-foreground font-bold mb-8 text-center'>
					Mirá lo que podés hacer
				</p>
				<div className='relative'>
					<HeroVideoDialog
						className='block dark:hidden'
						animationStyle='from-center'
						videoSrc='https://www.youtube.com/embed/kzEVcUv8vAA?si=liK-5qLq-CAiQ50I'
						thumbnailSrc='/panel.webp'
						thumbnailAlt='Demo Video'
					/>
					<HeroVideoDialog
						className='hidden dark:block'
						animationStyle='from-center'
						videoSrc='https://www.youtube.com/embed/kzEVcUv8vAA?si=liK-5qLq-CAiQ50I'
						thumbnailSrc='/panel-dark.webp'
						thumbnailAlt='Demo Video'
					/>
				</div>
			</section>
			<section className='max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col items-center border-x border-b border-dashed'>
				<h2 className='font-semibold text-xs md:text-sm text-black truncate px-2 mb-2 bg-primary rounded'>
					Precios
				</h2>
				<p className='text-2xl md:text-3xl text-accent-foreground font-bold mb-8 text-center'>
					Pagá solo por lo que usas
				</p>
				<div
					id='pricing'
					className='flex flex-wrap justify-center gap-8 w-full'
				>
					<PricingCard
						offerId='credits-25'
						title='Corto plazo'
						credits={25}
						price='$5.99'
						description='Ideal si necesitas terminar algo ya'
						suggestion='Prueba el producto con una inversion minima'
						features={[
							'Edita tu presentación con IA',
							'Tendrás tu presentación en tu Google Slides siempre',
							'Los créditos nunca expiran',
							'Soporte via Discord o email',
							'Perfecto para probar el producto',
						]}
						variant='ghost'
					/>
					<PricingCard
						offerId='credits-50'
						title='Mas popular 🔥'
						credits={50}
						price='$9.99'
						description='Si te queda buen trabajo por delante'
						suggestion='El mejor valor para la mayoria de usuarios'
						features={[
							'Edita tu presentación con IA',
							'Tendrás tu presentación en tu Google Slides siempre',
							'Los créditos nunca expiran',
							'Soporte via Discord o email',
							'Mejor valor para usuarios regulares',
						]}
						variant='primary'
					/>
					<PricingCard
						offerId='credits-150'
						title='Alto volumen'
						credits={150}
						price='$24.99'
						description='Para trabajos muy largos o equipos'
						suggestion='Para necesidades de alto volumen'
						features={[
							'Edita tu presentación con IA',
							'Tendrás tu presentación en tu Google Slides siempre',
							'Los créditos nunca expiran',
							'Soporte via Discord o email',
							'Ideal para necesidades de alto volumen',
							'Soporte prioritario',
						]}
						variant='ghost'
					/>
				</div>
			</section>
			<footer className='w-full'>
				<div className='max-w-7xl mx-auto py-8 flex flex-wrap justify-between border-x border-b border-dashed px-4 md:px-8 gap-8'>
					<div className='flex flex-col flex-grow'>
						<div className='flex gap-2 items-center'>
							<Logo size={30} />
							<h2 className='font-medium'>Slaidge</h2>
						</div>
						<p className='text-muted-foreground mt-2'>
							Construye tu presentación con IA, en minutos
						</p>
						<p className='text-muted-foreground'>
							Copyright @{new Date().getFullYear()} - Todos los derechos
							reservados
						</p>
					</div>
					<div className='flex flex-col flex-grow'>
						<p className='uppercase text-muted-foreground font-bold mb-2'>
							Links
						</p>
						<ul className='flex flex-col gap-1'>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/log-in'
								>
									Login
								</Link>
							</li>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='#pricing'
								>
									Precios
								</Link>
							</li>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/support'
								>
									Soporte
								</Link>
							</li>
						</ul>
					</div>
					<div className='flex flex-col flex-grow'>
						<p className='uppercase text-muted-foreground font-bold mb-2'>
							Legal
						</p>
						<ul className='flex flex-col gap-1'>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/terms-and-conditions'
								>
									Términos y condiciones
								</Link>
							</li>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/privacy-policy'
								>
									Política de privacidad
								</Link>
							</li>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/licenses'
								>
									Licencias
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</footer>
		</div>
	)
}
