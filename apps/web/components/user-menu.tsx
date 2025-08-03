import logOut from '@/actions/log-out'
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
import { Coins, HandCoins, LogOut } from 'lucide-react'
import Image from 'next/image'
import BuyCreditsDialog from './buy-credits-dialog'
import ThemeSwitch from './theme-switch'

interface UserMenuProps {
	name: string
	avatar: string
	creditBalance: number
}

export default function UserMenu(props: UserMenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='rounded-full p-0 w-8 h-8 relative'
				>
					<Image
						src={props.avatar}
						alt={`${props.name}'s avatar`}
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
				<DropdownMenuLabel>
					Cuenta de {props.name.split(' ')[0]}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<div className='border border-dashed rounded p-1 flex flex-col gap-1'>
					<p className='font-semibold flex items-center p-1'>
						<span className='bg-primary rounded p-1 mr-2'>
							<Coins className='text-black' />
						</span>
						{props.creditBalance} créditos
					</p>
					<BuyCreditsDialog currentCreditBalance={props.creditBalance}>
						<DialogTrigger asChild>
							<Button
								variant='outline'
								className='w-full'
							>
								Comprar créditos
								<HandCoins />
							</Button>
						</DialogTrigger>
					</BuyCreditsDialog>
				</div>
				<DropdownMenuSeparator />
				<div className='flex justify-between p-2'>
					<p className='text-sm'>Tema</p>
					<ThemeSwitch />
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={logOut}>
						<LogOut />
						Salir
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
