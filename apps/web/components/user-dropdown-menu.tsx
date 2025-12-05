import {
	Coins,
	ExternalLink,
	Folder,
	HandCoins,
	LogOut,
	Moon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import logOut from '@/actions/log-out'
import BuyCreditsDialog from '@/components/buy-credits-dialog'
import ThemeSwitch from '@/components/theme-switch'

import { Button } from '@workspace/ui/components/button'
import { DialogTrigger } from '@workspace/ui/components/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'

interface UserDropdownMenuProps
	extends React.ComponentProps<typeof DropdownMenu> {
	user: {
		name: string
		avatarUrl: string
		creditBalance: number
	}
}

export default function UserDropdownMenu({
	user,
	...props
}: UserDropdownMenuProps) {
	return (
		<DropdownMenu {...props}>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='rounded-full p-0 w-8 h-8 relative'
				>
					<Image
						src={user.avatarUrl}
						alt={`${user.name}'s avatar`}
						className='rounded-full'
						layout='fill'
						objectFit='contain'
						unoptimized
					/>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='w-3xs'
				align='end'
			>
				<DropdownMenuLabel className='text-muted-foreground'>
					{user.name.split(' ')[0]}'s Account
				</DropdownMenuLabel>
				<Link href={'/presentations'}>
					<DropdownMenuItem className='flex justify-between'>
						<div className='flex gap-2 items-center'>
							<Folder />
							My presentations
						</div>
					</DropdownMenuItem>
				</Link>
				<DropdownMenuSeparator />
				<DropdownMenuLabel className='text-muted-foreground'>
					Credits
				</DropdownMenuLabel>
				<div className='flex flex-col gap-1'>
					<DropdownMenuItem className='flex justify-between'>
						<div className='flex gap-2 items-center'>
							<Coins />
							Balance
						</div>
						<p className='text-muted-foreground'>{user.creditBalance}</p>
					</DropdownMenuItem>
					<BuyCreditsDialog currentCreditBalance={user.creditBalance}>
						<DialogTrigger asChild>
							<Button
								size={'sm'}
								className='w-full font-semibold'
							>
								Buy credits
								<HandCoins />
							</Button>
						</DialogTrigger>
					</BuyCreditsDialog>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuLabel className='text-muted-foreground'>
					Preferences
				</DropdownMenuLabel>
				<div className='flex justify-between p-2'>
					<p className='text-sm flex items-center gap-2'>
						<Moon
							size={16}
							className='text-muted-foreground'
						/>
						Theme
					</p>
					<ThemeSwitch />
				</div>
				<DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						variant='destructive'
						onClick={logOut}
					>
						<LogOut />
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
