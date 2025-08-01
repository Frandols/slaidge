import { createSupabaseServerClient } from '@workspace/supabase/server'
import { cookies } from 'next/headers'

export default async function createSupabaseClient(): Promise<
	ReturnType<typeof createSupabaseServerClient>
> {
	const cookieStore = await cookies()

	return createSupabaseServerClient({
		getAll() {
			return cookieStore.getAll()
		},
		setAll(cookiesToSet) {
			try {
				cookiesToSet.forEach(({ name, value, options }) =>
					cookieStore.set(name, value, options)
				)
			} catch {
				// The `setAll` method was called from a Server Component.
				// This can be ignored if you have middleware refreshing
				// user sessions.
			}
		},
	})
}
