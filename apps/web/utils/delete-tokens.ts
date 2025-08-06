/**
 * Delete access and refresh tokens from cookies.
 *
 * @param cookieStore The cookie store object.
 */
export default function deleteTokens(cookieStore: {
	delete: (key: string) => void
}) {
	cookieStore.delete('access_token')
	cookieStore.delete('refresh_token')
}
