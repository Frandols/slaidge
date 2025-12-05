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
				<DialogTitle>Connect your accound</DialogTitle>
				<p className='text-muted-foreground text-sm'>
					We need to add the presentations you create to your Google Slides
					storage.
				</p>
				{props.children}
				<ContinueWithGoogleButton />
			</DialogContent>
		</Dialog>
	)
}
