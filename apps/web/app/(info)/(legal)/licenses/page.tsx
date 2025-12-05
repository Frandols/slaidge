import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Licenses | Slaidge',
	description:
		'The app that allows you to make your presentations with artificial intelligence and simplified tools.',
}

export default function LicensesPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Licenses</h1>
			<p className='leading-relaxed'>
				1. License Grant
				<br /> Slaidge grants you a non-exclusive, non-transferable, and
				non-sublicensable license to:
				<br />
				- Use the App to create and edit personal or commercial presentations.
				<br />
				- Use AI features to assist in content generation or modification.
				<br />
				<br /> 2. Restrictions
				<br /> You may not:
				<br />- Redistribute the App as a standalone product.
				<br />- Remove copyright or trademark notices.
				<br />- Use the App in violation of laws or third-party rights.
				<br />- Sublicense, rent, or transfer your access.
				<br />
				<br /> 3. Intellectual Property All rights to the software, brand, and
				design belong to the creators of Slaidge. This license does not transfer
				ownership.
				<br />
				<br /> 4. Warranties and Liability
				<br /> Slaidge is provided "as is", without warranties of performance.
				We are not responsible for damages arising from the use of the software.
				<br />
				<br /> 5. Applicable Law This agreement is governed by the laws of the
				Argentine Republic.
				<br />
				<br /> Last updated: July 22, 2025.
			</p>
		</>
	)
}
