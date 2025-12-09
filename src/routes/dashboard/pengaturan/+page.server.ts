import { db } from '$lib/server/database/koneksi';
import { pengaturanSitus } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await db.select().from(pengaturanSitus);
	
	// Convert to key-value object
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => {
		pengaturan[s.kunci] = s.nilai || '';
	});

	return { pengaturan };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		
		const settingsToUpdate = [
			'nama_situs', 'tagline', 'logo_url', 'favicon_url',
			'email', 'telepon', 'alamat',
			'facebook', 'instagram', 'twitter', 'youtube', 'linkedin'
		];

		try {
			for (const key of settingsToUpdate) {
				const value = formData.get(key)?.toString() || '';
				
				// Check if exists
				const [existing] = await db
					.select()
					.from(pengaturanSitus)
					.where(eq(pengaturanSitus.kunci, key))
					.limit(1);

				if (existing) {
					await db
						.update(pengaturanSitus)
						.set({ nilai: value })
						.where(eq(pengaturanSitus.kunci, key));
				} else {
					await db.insert(pengaturanSitus).values({
						kunci: key,
						nilai: value,
						tipe: key.includes('url') ? 'image' : 'text',
						grup: key.includes('facebook') || key.includes('instagram') || key.includes('twitter') || key.includes('youtube') || key.includes('linkedin') ? 'social' : key.includes('email') || key.includes('telepon') || key.includes('alamat') ? 'contact' : 'general'
					});
				}
			}

			return { success: true, message: 'Pengaturan berhasil disimpan' };
		} catch (error) {
			console.error('Save settings error:', error);
			return fail(500, { success: false, message: 'Gagal menyimpan pengaturan' });
		}
	}
};

