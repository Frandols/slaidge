import { Image } from 'lucide-react'

export default async function PresentationPage() {
	return (
		<div className='aspect-video max-w-[960px] md:min-w-[736px] w-full border rounded-2xl border-dashed grid place-content-center text-center'>
			<p className='text-muted-foreground'>
				Seleccioná una diapositiva <Image className='inline ml-2' />
			</p>
		</div>
	)
}
