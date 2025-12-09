import { getUserFromSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Ambil session_id dari cookie
	const sessionId = event.cookies.get('session_id');

	// 2. Jika ada session_id, cek validitasnya di database
	if (sessionId) {
		const user = await getUserFromSession(sessionId);
		if (user) {
			event.locals.user = user;
		}
	} else {
		event.locals.user = null;
	}

	// 3. Proteksi Rute Dashboard
	const pathname = event.url.pathname;

	// Jika mengakses halaman login dan sudah login, redirect ke dashboard
	if (pathname === '/masuk' && event.locals.user) {
		throw redirect(303, '/dashboard');
	}

	// Proteksi Rute Dashboard - Jika belum login dan akses dashboard
	if (pathname.startsWith('/dashboard') && !event.locals.user) {
		throw redirect(303, '/masuk');
	}

	return resolve(event);
};