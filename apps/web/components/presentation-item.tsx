'use client'

import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'
import Link from 'next/link'

import useSlideImageSrc from '@/hooks/use-slide-image-src'
import { Skeleton } from '@workspace/ui/components/skeleton'

interface PresentationItemProps {
	id: string
	title: string
	updatedAt: string
}

export default function PresentationItem(props: PresentationItemProps) {
	return (
		<Link
			href={`/presentations/${props.id}`}
			className='group min-w-0'
			onNavigate={(e) => {
				e.preventDefault()

				window.location.href = `/presentations/${props.id}`
			}}
		>
			<div className='h-full flex flex-col gap-2'>
				<div className='aspect-video bg-muted-foreground rounded-lg w-full relative'>
					<PresentationItemThumbnail
						id={props.id}
						updatedAt={props.updatedAt}
					/>
				</div>
				<div className='flex flex-col gap-2 p-2'>
					<p className='font-medium truncate'>{props.title}</p>
					<p className='text-sm text-muted-foreground'>
						Editado{' '}
						{formatDistanceToNow(new Date(props.updatedAt), {
							addSuffix: true,
							locale: es,
						})}
					</p>
				</div>
			</div>
		</Link>
	)
}

export function PresentationItemSkeleton() {
	return (
		<div className='group'>
			<div className='h-full flex flex-col gap-2'>
				<Skeleton className='aspect-video rounded-lg w-full' />
				<div className='flex flex-col gap-2 p-2'>
					<Skeleton className='w-full h-6' />
					<Skeleton className='w-full h-5' />
				</div>
			</div>
		</div>
	)
}

interface PresentationItemThumbnailProps {
	id: string
	updatedAt: string
}

function PresentationItemThumbnail(props: PresentationItemThumbnailProps) {
	const slideImageSrc = useSlideImageSrc(
		props.id,
		new Date(props.updatedAt).getTime()
	)

	if (slideImageSrc === null) return null

	return (
		<Image
			src={slideImageSrc}
			alt={`${props.id} thumbnail`}
			layout='fill'
			className='aspect-video bg-background rounded-lg'
			objectFit='contain'
			unoptimized
		/>
	)
}
