import { Image } from 'lucide-react'

export default async function PresentationPage() {
	return (
		<div className='aspect-video max-w-[960px] md:min-w-[736px] w-full border rounded-2xl grid place-content-center text-center'>
			<p className='text-muted-foreground flex gap-2'>
				Select a slide <Image />
			</p>
		</div>
	)
}
