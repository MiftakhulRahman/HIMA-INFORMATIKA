import { db } from '$lib/server/database/koneksi';
import { galeri } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const schema = z.object({
	judul: z.string().max(255).optional(),
	deskripsi: z.string().optional(),
	gambarUrl: z.string().url('URL gambar wajib diisi'),
	kategori: z.string().optional(),
	tags: z.string().optional(),
	status: z.enum(['aktif', 'nonaktif'])
});

export const load: PageServerLoad = async () => ({});

export const actions: Actions = {
	default: async ({ request }) => {
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
			result.error.issues.forEach((err: { path: (string | number)[]; message: string }) => { if (err.path[0]) errors[err.path[0].toString()] = err.message; });
			return fail(400, { success: false, message: 'Validasi gagal', errors, data });
		}

		const tagsArray = data.tags ? data.tags.split(',').map((t) => t.trim()).filter((t) => t) : [];

		try {
			await db.insert(galeri).values({
				judul: data.judul || null,
				deskripsi: data.deskripsi || null,
				gambarUrl: data.gambarUrl,
				kategori: data.kategori || null,
				tags: tagsArray.length > 0 ? tagsArray : null,
				status: data.status
			});
			return { success: true, message: 'Gambar berhasil ditambahkan' };
		} catch (error) {
			console.error(error);
			return fail(500, { success: false, message: 'Gagal menambahkan gambar', data });
		}
	}
};

