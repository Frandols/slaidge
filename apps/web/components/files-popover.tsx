'use client'

import { Files, Trash } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@workspace/ui/components/tooltip'

interface FilesPopoverProps extends React.ComponentProps<typeof Popover> {
	files: {
		name: string
		url: string
		isImage: boolean
	}[]
	onDeleteFile?: (fileIndex: number) => void
}

export default function FilesPopover({
	files,
	onDeleteFile,
	children,
	...props
}: FilesPopoverProps) {
	return (
		<Popover {...props}>
			{children}
			<PopoverTrigger asChild>
				<Button
					variant='secondary'
					className='h-full text-muted-foreground cursor-pointer'
				>
					{files.length} <Files />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='p-2 w-[226px] h-[250px] overflow-auto relative'>
				<div className='grid grid-cols-[repeat(auto-fit,64px)] gap-2 place-content-start'>
					{files.map((file, index) => {
						return (
							<Tooltip key={index}>
								<TooltipTrigger asChild>
									<div className='rounded-lg overflow-hidden'>
										{file.isImage ? (
											<img
												src={file.url}
												alt={file.name}
												className='w-full h-16 border object-cover'
											/>
										) : (
											<div
												key={index}
												className='flex items-center justify-center border p-2 w-full h-16 bg-gray-100'
											>
												<span className='text-gray-700 font-semibold'>
													{file.name.split('.').pop()?.toUpperCase()}
												</span>
											</div>
										)}
									</div>
								</TooltipTrigger>
								<TooltipContent className='flex items-center gap-2'>
									<p className='max-w-24 truncate'>{file.name}</p>
									{onDeleteFile !== undefined ? (
										<Button
											variant='ghost'
											className='hover:bg-white/15 hover:text-accent rounded-full w-6 h-6'
											onClick={() => {
												onDeleteFile(index)
											}}
										>
											<Trash size={10} />
										</Button>
									) : null}
								</TooltipContent>
							</Tooltip>
						)
					})}
				</div>
			</PopoverContent>
		</Popover>
	)
}
