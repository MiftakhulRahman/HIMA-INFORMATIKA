import { db } from '$lib/server/database/koneksi';
import { divisi } from '$lib/server/database/schema';
import { fail, error } from '@sveltejs/kit';
import { eq, and, ne } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const divisiSchema = z.object({
	nama: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama terlalu panjang'),
	slug: z.string().min(1, 'Slug wajib diisi').max(100, 'Slug terlalu panjang'),
	deskripsi: z.string().optional(),
	ikon: z.string().optional(),
	gambarBanner: z.string().url('URL tidak valid').optional().or(z.literal('')),
	urutan: z.coerce.number().min(0).default(0),
	status: z.enum(['aktif', 'nonaktif'])
});

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);

	if (isNaN(id)) {
		throw error(404, 'Divisi tidak ditemukan');
	}

	const result = await db.select().from(divisi).where(eq(divisi.id, id)).limit(1);

	if (result.length === 0) {
		throw error(404, 'Divisi tidak ditemukan');
	}

	return {
		divisi: result[0]
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id);
		const formData = await request.formData();

		const data = {
			nama: formData.get('nama')?.toString() || '',
			slug: formData.get('slug')?.toString() || '',
			deskripsi: formData.get('deskripsi')?.toString() || '',
			ikon: formData.get('ikon')?.toString() || '',
			gambarBanner: formData.get('gambarBanner')?.toString() || '',
			urutan: formData.get('urutan')?.toString() || '0',
			status: (formData.get('status')?.toString() as 'aktif' | 'nonaktif') || 'aktif'
		};

		const result = divisiSchema.safeParse(data);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.errors.forEach((err) => {
				if (err.path[0]) errors[err.path[0].toString()] = err.message;
			});
			return fail(400, { success: false, message: 'Validasi gagal', errors });
		}

		const existingSlug = await db
			.select({ id: divisi.id })
			.from(divisi)
			.where(and(eq(divisi.slug, data.slug), ne(divisi.id, id)))
			.limit(1);

		if (existingSlug.length > 0) {
			return fail(400, {
				success: false,
				message: 'Slug sudah digunakan',
				errors: { slug: 'Slug sudah digunakan' }
			});
		}

		try {
			await db
				.update(divisi)
				.set({
					nama: data.nama,
					slug: data.slug,
					deskripsi: data.deskripsi || null,
					ikon: data.ikon || null,
					gambarBanner: data.gambarBanner || null,
					urutan: parseInt(data.urutan),
					status: data.status
				})
				.where(eq(divisi.id, id));

			return { success: true, message: 'Divisi berhasil diperbarui' };
		} catch (err) {
			console.error('Update divisi error:', err);
			return fail(500, { success: false, message: 'Gagal memperbarui divisi' });
		}
	}
};
