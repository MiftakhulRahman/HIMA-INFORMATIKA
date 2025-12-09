import { db } from '$lib/server/database/koneksi';
import { galeri } from '$lib/server/database/schema';
import { fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const schema = z.object({
	judul: z.string().max(255).optional(),
	deskripsi: z.string().optional(),
	gambarUrl: z.string().url(),
	kategori: z.string().optional(),
	tags: z.string().optional(),
	status: z.enum(['aktif', 'nonaktif'])
});

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw error(404, 'Tidak ditemukan');
	const [result] = await db.select().from(galeri).where(eq(galeri.id, id)).limit(1);
	if (!result) throw error(404, 'Tidak ditemukan');
	return { galeri: result };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id);
		const formData = await request.formData();
		const data = {
			judul: formData.get('judul')?.toString() || '',
			deskripsi: formData.get('deskripsi')?.toString() || '',
			gambarUrl: formData.get('gambarUrl')?.toString() || '',
			kategori: formData.get('kategori')?.toString() || '',
			tags: formData.get('tags')?.toString() || '',
			status: (formData.get('status')?.toString() as 'aktif' | 'nonaktif') || 'aktif'
		};

		const result = schema.safeParse(data);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.errors.forEach((err) => { if (err.path[0]) errors[err.path[0].toString()] = err.message; });
			return fail(400, { success: false, message: 'Validasi gagal', errors });
		}

		const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter((t) => t) : [];

		try {
			await db.update(galeri).set({
				judul: data.judul || null,
				deskripsi: data.deskripsi || null,
				gambarUrl: data.gambarUrl,
				kategori: data.kategori || null,
				tags: tagsArray.length > 0 ? tagsArray : null,
				status: data.status
			}).where(eq(galeri.id, id));
			return { success: true, message: 'Gambar berhasil diperbarui' };
		} catch (err) { console.error(err); return fail(500, { success: false, message: 'Gagal memperbarui' }); }
	}
};
