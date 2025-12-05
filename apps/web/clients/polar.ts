import { Polar } from '@polar-sh/sdk'

const polar = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	server: 'sandbox',
})

export default polar
