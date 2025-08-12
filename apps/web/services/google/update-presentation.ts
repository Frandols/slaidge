import createSupabaseClient from '@/clients/factories/supabase'

export default async function updatePresentation(
	requests: unknown[],
	presentationId: string,
	accessToken: string
) {
	const response = await fetch(
		`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`,
		{
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ requests }),
		}
	)

	if (response.ok) {
		const supabase = await createSupabaseClient()

		await supabase
			.from('presentations')
			.update({ updated_at: new Date().toISOString() })
			.eq('id', presentationId)
	}

	return await response.text()
}
