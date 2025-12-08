import { Quote, Rocket, X } from 'lucide-react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Link from 'next/link'

import HomePageHeader from '@/components/home-page-header'
import LogoLink from '@/components/logo-link'
import PricingCard from '@/components/pricing-card'
import Spotlight from '@/components/ui/spotlight'
import requireAccessToken from '@/guards/require-access-token'
import getUserProfile from '@/services/google/get-user-profile'
import getUserCreditBalance from '@/services/supabase/get-user-credit-balance'
import getUserPresentations from '@/services/supabase/get-user-presentations'

import BadgeLink from '@/components/badge-link'
import PresentationExampleDialogGallery from '@/components/presentation-example-dialog-gallery'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@workspace/ui/components/accordion'
import { Button } from '@workspace/ui/components/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog'
import BlurFade from '@workspace/ui/components/magicui/blur-fade'
import HeroVideoDialog from '@workspace/ui/components/magicui/hero-video-dialog'
import Highlighter from '@workspace/ui/components/magicui/highlighter'
import Marquee from '@workspace/ui/components/magicui/marquee'
import { TextAnimate } from '@workspace/ui/components/magicui/text-animate'

export const metadata: Metadata = {
	title: "Don't start from scratch, just refine it | Slaidge",
	description:
		'Start every presentation with a smart data framework, not an empty slide.',
	openGraph: {
		title: "Don't start from scratch, just refine it | Slaidge",
		description:
			'Start every presentation with a smart data framework, not an empty slide.',
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

		const [presentationsList, creditBalance] = await Promise.all([
			getUserPresentations(userProfile.id),
			getUserCreditBalance(userProfile.id),
		])

		return { ...userProfile, presentationsList, creditBalance }
	} catch {
		return null
	}
}

export default async function HomePage() {
	const userProfile = await checkUserLogged()

	return (
		<div className='bg-background min-h-dvh overflow-x-hidden pt-20'>
			<HomePageHeader userProfile={userProfile} />
			<main
				id='main'
				className='max-w-7xl relative mx-auto py-8 px-4 md:px-8 flex flex-col items-center pb-18'
			>
				<Spotlight className='top-25 -left-25 rotate-25 sm:top-5 sm:-left-15 md:-top-15 md:left-5 md:rotate-15 lg:top-15 lg:left-50 lg:rotate-15' />
				<div className='max-w-3xl mx-auto flex flex-col gap-6 items-center mb-12'>
					<div
						className={
							'group rounded-full border border-accent-foreground/12.5 relative bg-accent w-min truncate py-1 px-4'
						}
					>
						<p className='text-xs md:text-[15px]'>Saved in Google Slides ✨</p>
					</div>
					<span className='text-center font-extrabold text-4xl lg:text-6xl'>
						<TextAnimate
							animation='blurInUp'
							by='word'
							once
						>
							Don&apos;t start from scratch,
						</TextAnimate>
						<BlurFade
							delay={1}
							duration={1}
						>
							<span className='relative whitespace-nowrap'>
								<div className='absolute bg-primary h-[75%] -left-2 top-2 -bottom-1 -right-2 md:-left-3 md:top-2.125 lg:top-3 md:-bottom-0 md:-right-3 -rotate-1'></div>
								<span className='text-black relative'>just refine it</span>
							</span>
						</BlurFade>
					</span>
					<p className='text-center text-lg text-muted-foreground'>
						Start every presentation with a{' '}
						<span className='text-accent-foreground'>
							smart data framework,
						</span>{' '}
						not an empty slide.
					</p>
				</div>
				<Link href={'/log-in'}>
					<Button>Try It Now</Button>
				</Link>
			</main>
			<div className='relative flex w-full flex-col items-center justify-center overflow-hidden'>
				<Marquee
					pauseOnHover
					className='[--duration:20s]'
				>
					{[
						{ id: '1', slideCount: 5 },
						{ id: '2', slideCount: 3 },
						{ id: '3', slideCount: 4 },
						{ id: '4', slideCount: 5 },
					].map((presentationExample) => (
						<Dialog key={presentationExample.id}>
							<DialogTrigger asChild>
								<img
									className='h-32 aspect-video rounded-xl'
									src={`/presentation_examples/${presentationExample.id}/1.webp`}
								/>
							</DialogTrigger>
							<DialogContent className='grid place-content-center bg-transparent p-0 border-0'>
								<DialogTitle className='hidden'>Hello!</DialogTitle>
								<div className='relative w-full md:w-3xl aspect-video z-10'>
									<DialogClose asChild>
										<button className='absolute -top-16 right-0 rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black'>
											<X />
										</button>
									</DialogClose>
									<PresentationExampleDialogGallery {...presentationExample} />
								</div>
							</DialogContent>
						</Dialog>
					))}
				</Marquee>
				<div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background'></div>
				<div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background'></div>
			</div>
			<div
				id='product'
				className='max-w-5xl mx-auto px-4 md:px-8 py-8 mt-24 flex flex-col items-center'
			>
				<h2 className='font-semibold text-xs md:text-sm text-black truncate px-2 mb-2 bg-primary rounded'>
					How it works
				</h2>
				<p className='text-2xl md:text-3xl text-accent-foreground font-bold mb-8 text-center'>
					Count on an assistant that does the heavy lifting for you
				</p>
				<p className='text-muted-foreground text-center mb-16'>
					Slaidge works as a bridge between you and Google Slides. Communicate
					with an AI agent that does the laborious edits without stopping you
					from making manual changes.
				</p>
				<div className='w-full max-w-5xl aspect-video'>
					<HeroVideoDialog
						className='block dark:hidden'
						animationStyle='from-center'
						videoSrc='https://www.youtube.com/embed/Z0h0FOU2y1I?si=QFcICoUlB22sTq12'
						thumbnailSrc='/panel.webp'
						thumbnailAlt='Demo Video'
					/>
					<HeroVideoDialog
						className='hidden dark:block'
						animationStyle='from-center'
						videoSrc='https://www.youtube.com/embed/Z0h0FOU2y1I?si=QFcICoUlB22sTq12'
						thumbnailSrc='/panel-dark.webp'
						thumbnailAlt='Demo Video'
					/>
				</div>

				<div className='mt-12 md:mt-16 w-full max-w-5xl px-4'>
					<div className='flex flex-col md:flex-row items-center gap-8 rounded-xl border bg-card p-6 md:p-8 shadow-sm'>
						<div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left'>
							<h3 className='text-xl md:text-2xl font-bold text-accent-foreground mb-4'>
								Transform content into presentations instantly
							</h3>
							<p className='text-muted-foreground text-base md:text-lg'>
								Think of it as a pipeline: you input your documents or text, and
								Slaidge outputs a formatted, professional presentation. You can
								always use the chat to refine details or add more information
								seamlessly.
							</p>
						</div>
						<div className='flex-1 w-full'>
							<img
								src='/diagram-light.webp'
								alt='How Slaidge works diagram'
								className='w-full h-auto block dark:hidden rounded-lg'
							/>
							<img
								src='/diagram-dark.webp'
								alt='How Slaidge works diagram'
								className='w-full h-auto hidden dark:block rounded-lg'
							/>
						</div>
					</div>
				</div>
			</div>

			<div className='max-w-5xl mx-auto px-4 md:px-8 py-12'>
				<div className='flex flex-col md:flex-row gap-8 items-center md:items-start'>
					<img
						src='/francisco.webp'
						alt='Francisco'
						className='w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-background shadow-lg'
					/>
					<div className='flex-1 space-y-4'>
						<h3 className='text-2xl font-bold'>Hey, I’m Francisco 👋</h3>
						<p className='text-muted-foreground'>
							I’m a final-year computer science student who’s spent years
							building software — APIs, AI tools, full SaaS apps. And throughout
							my degree, I constantly had to create presentations packed with
							technical details, data, and research.
						</p>
						<p className='text-muted-foreground'>
							Every time, it felt the same: gather info from documents, rewrite
							it into slides, fix the layout, repeat. Slow, repetitive, and not
							exactly the best use of time.
						</p>
						<p className='text-muted-foreground'>So I built Slaidge.</p>
						<p className='text-muted-foreground'>
							Slaidge works like a pipeline: you drop in your text or documents,
							and a structured, presentation-ready deck comes out the other
							side. And with the built-in AI chat, you can keep feeding
							information and Slaidge updates the slides instantly.
						</p>
						<div className='bg-accent/50 p-4 rounded-lg'>
							<p className='font-semibold mb-2'>I built it to:</p>
							<ul className='list-disc list-inside space-y-1 text-muted-foreground'>
								<li>Save hours of formatting</li>
								<li>Turn raw, dense information into clean slides</li>
								<li>Let people focus on ideas, not slide mechanics</li>
							</ul>
						</div>
						<p className='text-muted-foreground italic'>
							Early users say it cuts their prep time drastically.
						</p>
					</div>
				</div>
			</div>

			<div className='max-w-xl mx-auto px-4 md:px-8 py-8 flex flex-col items-center'>
				<div className='flex flex-col items-center md:items-start w-full relative'>
					<Quote className='text-primary w-8 h-8 mb-4' />
					<p className='text-lg md:text-xl font-medium text-center md:text-left mb-6 text-balance'>
						“Huge time saver when I need to take information from my documents
						to create slides.”
					</p>
					<div className='flex items-center gap-2.5 self-center md:self-start'>
						<img
							src='/feedback-avatar.webp'
							alt='Gary'
							className='w-10 h-10 rounded-full object-cover bg-muted'
						/>
						<div className='flex items-center gap-2.5'>
							<span className='font-bold text-base'>Gary</span>
							<span className='text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wide'>
								Professor
							</span>
						</div>
					</div>
				</div>
			</div>
			<BlurFade
				inView
				direction='up'
				offset={20}
				className='max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col items-center'
			>
				<h2 className='font-semibold text-xs md:text-sm text-black truncate px-2 mb-2 bg-primary rounded'>
					Pricing
				</h2>
				<p className='text-2xl md:text-3xl text-accent-foreground font-bold mb-8 text-center'>
					Not another subscription, pay only for what you use
				</p>
				<div
					id='pricing'
					className='flex flex-wrap justify-center gap-8 w-full'
				>
					<PricingCard
						offerId='credits-25'
						title='Short term'
						credits={25}
						price='$2.99'
						originalPrice='$5.99'
						description='Ideal if you need to finish something now'
						suggestion='Try the product with a minimum investment'
						features={[
							'Edit your presentation with AI',
							'You will always have your presentation in Google Slides',
							'Credits never expire',
							'Support via Discord or email',
							'Perfect for testing the product',
						]}
						variant='ghost'
					/>
					<PricingCard
						offerId='credits-50'
						title='Most popular 🔥'
						credits={50}
						price='$4.99'
						originalPrice='$9.99'
						description='If you have good work ahead'
						suggestion='The best value for most users'
						features={[
							'Edit your presentation with AI',
							'You will always have your presentation in Google Slides',
							'Credits never expire',
							'Support via Discord or email',
							'Best value for regular users',
						]}
						variant='primary'
					/>
					<PricingCard
						offerId='credits-150'
						title='High volume'
						credits={150}
						price='$14.99'
						originalPrice='$24.99'
						description='For very long jobs or teams'
						suggestion='For high volume needs'
						features={[
							'Edit your presentation with AI',
							'You will always have your presentation in Google Slides',
							'Credits never expire',
							'Support via Discord or email',
							'Ideal for high volume needs',
							'Priority support',
						]}
						variant='ghost'
					/>
				</div>
			</BlurFade>
			<BlurFade
				id='faq'
				inView
				direction='up'
				offset={20}
				className='max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col items-center'
				layoutId='faq'
			>
				<h2 className='font-semibold text-xs md:text-sm text-black truncate px-2 mb-2 bg-primary rounded'>
					FAQ
				</h2>
				<p className='text-2xl md:text-3xl text-accent-foreground font-bold mb-8 text-center'>
					Frequently Asked Questions
				</p>
				<p className='text-muted-foreground text-center mb-8'>
					Find answers to common questions about our service
				</p>
				<Accordion
					type='single'
					collapsible
					className='w-full mb-8'
				>
					<AccordionItem value='item-0'>
						<AccordionTrigger>Who is Slaidge for?</AccordionTrigger>
						<AccordionContent className='flex flex-col gap-4 text-balance'>
							<p>
								Slaidge is for people that needs a starter template for their
								presentations fast and easy. We address this by using AI to
								generate a presentation based on the information you provide.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-1'>
						<AccordionTrigger>Is the application free?</AccordionTrigger>
						<AccordionContent className='flex flex-col gap-4 text-balance'>
							<p>
								Slaidge is not free, is a pay-per-use service. You can buy
								credits to use the service.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-2'>
						<AccordionTrigger>
							What will happen to my presentations?
						</AccordionTrigger>
						<AccordionContent className='flex flex-col gap-4 text-balance'>
							<p>
								Your presentations will always be available to you in Google
								Slides.
							</p>
							<p>
								Our goal is simply to help you speed up the heavy lifting of
								loading and formatting information.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-3'>
						<AccordionTrigger>
							How long do the credits I buy last?
						</AccordionTrigger>
						<AccordionContent className='flex flex-col gap-4 text-balance'>
							<p>Forever.</p>
							<p>
								The credits you purchase will always be available in your
								account for you to use.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value='item-4'>
						<AccordionTrigger>
							Can I have my presentations in PowerPoint?
						</AccordionTrigger>
						<AccordionContent className='flex flex-col gap-4 text-balance'>
							<p>Of course!</p>
							<p>
								From Google Slides you can export your presentation and then
								import it into PowerPoint if you wish.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<p className='text-muted-foreground mb-2'>Still have questions?</p>
				<BadgeLink href={'/support'}>Contact support</BadgeLink>
			</BlurFade>
			<BlurFade
				inView
				direction='up'
				offset={20}
				className='max-w-3xl mx-auto flex flex-col gap-6 items-center mb-12 px-4 md:px-8 py-24'
			>
				<div className='text-center text-2xl'>
					<p className='leading-relaxed relative'>
						Avoid the{' '}
						<Highlighter
							action='underline'
							color='var(--primary)'
						>
							heavy lifting
						</Highlighter>{' '}
						and focus on{' '}
						<Highlighter
							action='highlight'
							color='var(--primary)'
						>
							customization
						</Highlighter>{' '}
						.
					</p>
				</div>
				<Link href={'/log-in'}>
					<Button>
						Start now <Rocket />
					</Button>
				</Link>
			</BlurFade>
			<footer className='w-full'>
				<div className='max-w-7xl mx-auto py-8 flex flex-wrap justify-between px-4 md:px-8 gap-8'>
					<div className='flex flex-col flex-grow'>
						<div className='flex gap-2 items-center'>
							<LogoLink size={30} />
							<h2 className='font-medium'>Slaidge</h2>
						</div>
						<p className='text-muted-foreground mt-2'>
							Don't start from scratch, just refine it
						</p>
						<p className='text-muted-foreground'>
							Copyright @{new Date().getFullYear()} - All rights reserved
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
									Pricing
								</Link>
							</li>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/support'
								>
									Support
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
									Terms and Conditions
								</Link>
							</li>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/privacy-policy'
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									className='hover:underline text-muted-foreground'
									href='/licenses'
								>
									Licenses
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</footer>
		</div>
	)
}
