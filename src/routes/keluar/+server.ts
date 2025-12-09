import { redirect, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database/koneksi';
import { sessions } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	const sessionId = cookies.get('session_id');

	if (sessionId) {
		// Hapus session dari database
		await db.delete(sessions).where(eq(sessions.id, sessionId));
	}

	// Hapus cookie
	cookies.delete('session_id', { path: '/' });

	// Reset locals
	locals.user = null;

	throw redirect(302, '/masuk');
};
