import { db } from '$lib/server/database/koneksi';
import { pengaturanSitus } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => {
		pengaturan[s.kunci] = s.nilai || '';
	});
	return { pengaturan };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const nama = formData.get('nama')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const subjek = formData.get('subjek')?.toString() || '';
		const pesan = formData.get('pesan')?.toString() || '';

		if (!nama || !email || !subjek || !pesan) {
			return fail(400, { success: false, message: 'Semua field wajib diisi' });
		}

		// Here you would typically send an email or save to database
		// For now we just return success
		console.log('Contact form submission:', { nama, email, subjek, pesan });

		return { success: true, message: 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.' };
	}
};
