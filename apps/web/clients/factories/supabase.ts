import { CookieMethodsServer, createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const createSupabaseServerClient = (
	cookies: CookieMethodsServer
): SupabaseClient =>
	createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_KEY!,
		{
			cookies,
		}
	)

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
