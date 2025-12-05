'use client'

import { Loader2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { createPresentation } from '@/actions/create-presentation'
import { SANS_SERIF_FONTS, SERIF_FONTS } from '@/constants/fonts'
import { FIRST_THEME_SUGGESTION, THEME_SUGGESTIONS } from '@/constants/themes'

import { Button } from '@workspace/ui/components/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select'

import { cn } from '@workspace/ui/lib/utils'

export default function CreatePresentationItem() {
	const [open, setOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [subtitle, setSubtitle] = useState('')
	const [themeId, setThemeId] = useState(FIRST_THEME_SUGGESTION.id)
	const [customColors, setCustomColors] = useState(
		FIRST_THEME_SUGGESTION.theme.colors
	)
	const [customFonts, setCustomFonts] = useState(
		FIRST_THEME_SUGGESTION.theme.fonts
	)
	const [submitting, setSubmitting] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const theme = THEME_SUGGESTIONS.find((t) => t.id === themeId)
		if (theme) {
			setCustomColors(theme.theme.colors)
			setCustomFonts(theme.theme.fonts)
		}
	}, [themeId])

	const onSubmit = async () => {
		if (!title) return

		setSubmitting(true)
		const toastId = toast.loading('Creating presentation...')

		try {
			const selectedTheme = THEME_SUGGESTIONS.find(
				(t) => t.id === themeId
			)?.theme

			if (!selectedTheme) throw new Error('THEME_NOT_FOUND')

			const finalTheme = {
				...selectedTheme,
				colors: customColors,
				fonts: customFonts,
			}

			const result = await createPresentation(title, subtitle, finalTheme)

			if (result.type === 'success') {
				router.push(`/presentations/${result.presentation.presentationId}`)
				toast.success('Presentation created successfully!')
			} else {
				throw new Error('ERROR_CREATING_PRESENTATION')
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error('Error creating presentation')
			}
		} finally {
			setSubmitting(false)
			toast.dismiss(toastId)
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger asChild>
				<div className='aspect-video min-w-0 rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer group bg-muted/5 hover:bg-muted/10'>
					<div className='p-3 rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform'>
						<Plus className='w-6 h-6 text-muted-foreground' />
					</div>
					<p className='font-medium text-muted-foreground'>
						Create presentation
					</p>
				</div>
			</DialogTrigger>
			<DialogContent className='sm:max-w-3xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Create new presentation</DialogTitle>
					<DialogDescription>
						Enter the title and choose a theme for your new presentation.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-6 py-4'>
					<div className='grid gap-4 sm:grid-cols-2'>
						<div className='grid gap-2'>
							<Label htmlFor='title'>Title</Label>
							<Input
								id='title'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder='Ex: Q4 Strategy'
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='subtitle'>Subtitle (optional)</Label>
							<Input
								id='subtitle'
								value={subtitle}
								onChange={(e) => setSubtitle(e.target.value)}
								placeholder='Ex: Market Analysis'
							/>
						</div>
					</div>
					<div className='grid gap-2'>
						<Label>Theme</Label>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{THEME_SUGGESTIONS.map((item) => (
								<div
									key={item.id}
									className={cn(
										'cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-muted/50',
										themeId === item.id
											? 'border-primary bg-muted/50'
											: 'border-transparent bg-muted/20'
									)}
									onClick={() => setThemeId(item.id)}
								>
									<div className='flex items-center justify-between mb-3'>
										<span className='font-medium'>{item.name}</span>
										{themeId === item.id && (
											<div className='h-2 w-2 rounded-full bg-primary' />
										)}
									</div>
									<div className='space-y-3'>
										<div className='flex gap-1.5'>
											{[
												item.theme.colors.background,
												item.theme.colors.foreground,
												item.theme.colors.mutedForeground,
												...item.theme.colors.chart.slice(0, 2),
											].map((color, i) => (
												<div
													key={i}
													className='h-6 w-6 rounded-full border shadow-sm'
													style={{ backgroundColor: color }}
													title={color}
												/>
											))}
										</div>
										<div className='flex gap-4 text-xs text-muted-foreground'>
											<div className='flex flex-col'>
												<span className='text-[10px] uppercase tracking-wider opacity-70'>
													Serif
												</span>
												<span className='font-medium truncate max-w-[80px]'>
													{item.theme.fonts.serif}
												</span>
											</div>
											<div className='flex flex-col'>
												<span className='text-[10px] uppercase tracking-wider opacity-70'>
													Sans
												</span>
												<span className='font-medium truncate max-w-[80px]'>
													{item.theme.fonts.sansSerif}
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className='grid gap-4'>
						<Label>Customize colors</Label>
						<div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
							<div className='space-y-2'>
								<Label className='text-xs text-muted-foreground'>
									Background
								</Label>
								<div className='flex gap-2'>
									<div className='h-9 w-9 shrink-0 overflow-hidden rounded-md border shadow-sm'>
										<input
											type='color'
											className='h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0'
											value={customColors.background}
											onChange={(e) =>
												setCustomColors((prev) => ({
													...prev,
													background: e.target.value,
												}))
											}
										/>
									</div>
									<Input
										value={customColors.background}
										onChange={(e) =>
											setCustomColors((prev) => ({
												...prev,
												background: e.target.value,
											}))
										}
										className='font-mono uppercase'
										maxLength={7}
									/>
								</div>
							</div>
							<div className='space-y-2'>
								<Label className='text-xs text-muted-foreground'>Text</Label>
								<div className='flex gap-2'>
									<div className='h-9 w-9 shrink-0 overflow-hidden rounded-md border shadow-sm'>
										<input
											type='color'
											className='h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0'
											value={customColors.foreground}
											onChange={(e) =>
												setCustomColors((prev) => ({
													...prev,
													foreground: e.target.value,
												}))
											}
										/>
									</div>
									<Input
										value={customColors.foreground}
										onChange={(e) =>
											setCustomColors((prev) => ({
												...prev,
												foreground: e.target.value,
											}))
										}
										className='font-mono uppercase'
										maxLength={7}
									/>
								</div>
							</div>
							<div className='space-y-2'>
								<Label className='text-xs text-muted-foreground'>
									Secondary text
								</Label>
								<div className='flex gap-2'>
									<div className='h-9 w-9 shrink-0 overflow-hidden rounded-md border shadow-sm'>
										<input
											type='color'
											className='h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0'
											value={customColors.mutedForeground}
											onChange={(e) =>
												setCustomColors((prev) => ({
													...prev,
													mutedForeground: e.target.value,
												}))
											}
										/>
									</div>
									<Input
										value={customColors.mutedForeground}
										onChange={(e) =>
											setCustomColors((prev) => ({
												...prev,
												mutedForeground: e.target.value,
											}))
										}
										className='font-mono uppercase'
										maxLength={7}
									/>
								</div>
							</div>
						</div>
						<div className='space-y-2'>
							<Label className='text-xs text-muted-foreground'>
								Chart colors
							</Label>
							<div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
								{customColors.chart.map((color, index) => (
									<div
										key={index}
										className='flex gap-2'
									>
										<div className='h-9 w-9 shrink-0 overflow-hidden rounded-md border shadow-sm'>
											<input
												type='color'
												className='h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer border-0 p-0'
												value={color}
												onChange={(e) => {
													const newChart = [...customColors.chart]
													newChart[index] = e.target.value
													setCustomColors((prev) => ({
														...prev,
														chart: newChart,
													}))
												}}
											/>
										</div>
										<Input
											value={color}
											onChange={(e) => {
												const newChart = [...customColors.chart]
												newChart[index] = e.target.value
												setCustomColors((prev) => ({
													...prev,
													chart: newChart,
												}))
											}}
											className='font-mono uppercase'
											maxLength={7}
										/>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className='grid gap-4'>
						<Label>Customize fonts</Label>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label className='text-xs text-muted-foreground'>
									Serif font
								</Label>
								<Select
									value={customFonts.serif}
									onValueChange={(value) =>
										setCustomFonts((prev) => ({
											...prev,
											serif: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder='Select a serif font' />
									</SelectTrigger>
									<SelectContent>
										{SERIF_FONTS.map((font) => (
											<SelectItem
												key={font}
												value={font}
											>
												{font}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className='space-y-2'>
								<Label className='text-xs text-muted-foreground'>
									Sans-serif font
								</Label>
								<Select
									value={customFonts.sansSerif}
									onValueChange={(value) =>
										setCustomFonts((prev) => ({
											...prev,
											sansSerif: value,
										}))
									}
								>
									<SelectTrigger>
										<SelectValue placeholder='Select a sans-serif font' />
									</SelectTrigger>
									<SelectContent>
										{SANS_SERIF_FONTS.map((font) => (
											<SelectItem
												key={font}
												value={font}
											>
												{font}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button
						onClick={onSubmit}
						disabled={!title || submitting}
					>
						{submitting ? (
							<>
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
								Creating...
							</>
						) : (
							'Create presentation'
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
