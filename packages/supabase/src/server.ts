import { CookieMethodsServer, createServerClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

export const createSupabaseServerClient = (
	cookies: CookieMethodsServer
): SupabaseClient =>
	createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_KEY!,
		{
			cookies,
		}
	)
