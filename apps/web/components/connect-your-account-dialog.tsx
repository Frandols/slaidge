import {
	Dialog,
	DialogContent,
	DialogTitle,
} from '@workspace/ui/components/dialog'
import ContinueWithGoogleButton from './continue-with-google-button'

export default function ConnectYourAccountDialog(
	props: React.ComponentProps<typeof Dialog>
) {
	return (
		<Dialog {...props}>
			<DialogContent className='w-96'>
				<DialogTitle>Conectá tu cuenta</DialogTitle>
				<p className='text-muted-foreground text-sm'>{props.children}</p>
				<ContinueWithGoogleButton />
			</DialogContent>
		</Dialog>
	)
}
