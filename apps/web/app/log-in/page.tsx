import ContinueWithGoogleButton from '@/components/continue-with-google-button'
import { Separator } from '@workspace/ui/components/separator'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function LogInPage() {
	return (
		<main className='min-h-screen flex items-center justify-center'>
			<div className='rounded-2xl border p-4 flex flex-col gap-2 max-w-96'>
				<h1 className='text-2xl font-semibold'>Conectá tu cuenta</h1>
				<p className='text-muted-foreground text-sm mb-2'>
					Accede con tu cuenta de Google para poder crear y modificar
					presentaciones
				</p>
				<ContinueWithGoogleButton />
				<Separator className='my-2' />
				<p className='text-muted-foreground text-sm'>
					Slaidge podra crear presentaciones por ti y modificar unica y
					exclusivamente aquellas presentaciones que fueron creadas a traves de
					la aplicación.
				</p>
				<Link
					href={'/terms-and-conditions'}
					className='underline text-muted-foreground text-sm w-min text-nowrap'
				>
					Términos y condiciones
					<ArrowRight
						className='inline ml-2'
						size={16}
					/>
				</Link>
			</div>
		</main>
	)
}
