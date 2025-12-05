import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Terms and Conditions | Slaidge',
	description:
		'The app that allows you to make your presentations with artificial intelligence and simplified tools.',
}

export default function TermsAndConditionsPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Terms and Conditions</h1>
			<p className='leading-relaxed'>
				1. Introduction
				<br /> By using this Slaidge application you confirm your acceptance and
				agree to comply with these terms and conditions.
				<br />
				<br /> 2. Acceptance of the Agreement
				<br /> This agreement is effective from the moment you first use
				Slaidge. If you do not agree with these terms, you should not use
				Slaidge.
				<br />
				<br /> 3. Software Use License
				<br /> Slaidge is granted under a personal and non-transferable use
				license. You can use it to create, edit, and improve Google Slides
				presentations through a simplified interface and artificial intelligence
				tools. We reserve the right to suspend or revoke access to Slaidge at
				any time, without prior notice, in case of misuse or violation of these
				terms.
				<br />
				<br /> 4. Use of the Google Slides API
				<br /> Slaidge acts as an intermediary between the user and the official
				Google Slides API. It does not permanently store your presentations nor
				does it act as an official Google provider. The use of Slaidge must
				comply with the Google Terms of Service and the Google Slides API Usage
				Policies.
				<br />
				<br /> 5. Refunds
				<br /> Since it is a digital product with immediate access to
				functionalities, refunds are not allowed once access is granted.
				<br />
				<br /> 6. Disclaimer of Warranties
				<br /> We do not guarantee that Slaidge will meet your expectations or
				that it will work without interruptions or errors. The use of Slaidge is
				at your own risk.
				<br />
				<br /> 7. Limitation of Liability
				<br /> Slaidge will not be responsible for indirect losses, incidental
				damages, or any harm derived from the use of the software, including
				loss of data or service interruptions.
				<br />
				<br /> 8. User Generated Content
				<br /> You are responsible for the content you generate, upload, or
				modify through Slaidge. We reserve the right to remove content that
				infringes third-party rights or legal regulations.
				<br />
				<br /> 9. Price Changes
				<br /> We reserve the right to modify prices at any time. Continued use
				after any price adjustment implies acceptance of the new value.
				<br />
				<br /> 10. Applicable Law
				<br /> This Agreement is governed by the laws of the Argentine Republic.
				In case of dispute, the parties will submit to the jurisdiction of the
				competent courts of the City of Buenos Aires.
				<br />
				<br /> Last updated: July 22, 2025.
			</p>
		</>
	)
}
