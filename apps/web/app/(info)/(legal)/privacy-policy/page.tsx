import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Privacy Policy | Slaidge',
	description:
		'The app that allows you to make your presentations with artificial intelligence and simplified tools.',
}

export default function PrivacyPolicyPage() {
	return (
		<>
			<h1 className='text-3xl font-medium pb-6'>Privacy Policy</h1>
			<p className='leading-relaxed'>
				Your privacy is important to us. This Policy explains how we collect,
				use, and protect your personal information when using Slaidge.
				<br />
				<br /> 1. Information we collect
				<br /> We request personal information only when it is necessary to
				provide our services. For example, if you log in with your Google
				account, we may access your name, email address, and profile picture.
				<br />
				<br /> 2. Use of information
				<br /> We use the collected information only to:
				<br /> - Display your data within Slaidge
				<br /> - Personalize the user experience
				<br /> - Provide you access to Slaidge functionalities
				<br />
				<br /> 3. Data retention and protection
				<br /> We keep the information only as long as necessary to provide the
				service. We protect your data with reasonable technical and
				organizational measures against unauthorized access, disclosure, or
				modification.
				<br />
				<br /> 4. Disclosure to third parties
				<br /> We do not share your personal information with third parties,
				except as required by law.
				<br />
				<br /> 5. External services
				<br /> Slaidge may contain links to external sites (such as Google). We
				are not responsible for the content or privacy policies of these
				services.
				<br />
				<br /> 6. User rights
				<br /> You can request the deletion of your account and data at any time
				by writing to us at the email indicated below.
				<br />
				<br /> 7. Legal basis We act as a data controller and processor in
				accordance with the General Data Protection Regulation (GDPR) and other
				applicable laws. Your continued use of Slaidge implies your acceptance
				of this policy.
				<br />
				<br /> Last updated: July 22, 2025.
			</p>
		</>
	)
}
