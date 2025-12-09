import { db } from '$lib/server/database/koneksi';
import { berita } from '$lib/server/database/schema';
import { fail, redirect, error } from '@sveltejs/kit';
import { eq, and, ne } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

// Validation schema
const beritaSchema = z.object({
	judul: z.string().min(1, 'Judul wajib diisi').max(255, 'Judul terlalu panjang'),
	slug: z.string().min(1, 'Slug wajib diisi').max(255, 'Slug terlalu panjang'),
	ringkasan: z.string().max(500, 'Ringkasan terlalu panjang').optional(),
	konten: z.string().min(1, 'Konten wajib diisi'),
	kategori: z.string().optional(),
	tags: z.string().optional(),
	gambarUtama: z.string().url('URL gambar tidak valid').optional().or(z.literal('')),
	status: z.enum(['draft', 'published'])
});

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);

	if (isNaN(id)) {
		throw error(404, 'Berita tidak ditemukan');
	}

	const result = await db
		.select()
		.from(berita)
		.where(eq(berita.id, id))
		.limit(1);

	if (result.length === 0) {
		throw error(404, 'Berita tidak ditemukan');
	}

	return {
		berita: result[0]
	};
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id);
		const formData = await request.formData();

		const data = {
			judul: formData.get('judul')?.toString() || '',
			slug: formData.get('slug')?.toString() || '',
			ringkasan: formData.get('ringkasan')?.toString() || '',
			konten: formData.get('konten')?.toString() || '',
			kategori: formData.get('kategori')?.toString() || '',
			tags: formData.get('tags')?.toString() || '',
			gambarUtama: formData.get('gambarUtama')?.toString() || '',
			status: (formData.get('status')?.toString() as 'draft' | 'published') || 'draft'
		};

		// Validate
		const result = beritaSchema.safeParse(data);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.errors.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0].toString()] = err.message;
				}
			});
			return fail(400, { success: false, message: 'Validasi gagal', errors });
		}

		// Check slug uniqueness (excluding current item)
		const existingSlug = await db
			.select({ id: berita.id })
			.from(berita)
			.where(and(eq(berita.slug, data.slug), ne(berita.id, id)))
			.limit(1);

		if (existingSlug.length > 0) {
			return fail(400, {
				success: false,
				message: 'Slug sudah digunakan',
				errors: { slug: 'Slug sudah digunakan, pilih yang lain' }
			});
		}

		// Parse tags
		const tagsArray = data.tags
			? data.tags
					.split(',')
					.map((t) => t.trim())
					.filter((t) => t)
			: [];

		try {
			// Get current status for publication date logic
			const [current] = await db
				.select({ status: berita.status })
				.from(berita)
				.where(eq(berita.id, id));

			const updateData: Record<string, unknown> = {
				judul: data.judul,
				slug: data.slug,
				ringkasan: data.ringkasan || null,
				konten: data.konten,
				kategori: data.kategori || null,
				tags: tagsArray.length > 0 ? tagsArray : null,
				gambarUtama: data.gambarUtama || null,
				status: data.status
			};

			// Set publication date if publishing for first time
			if (data.status === 'published' && current?.status === 'draft') {
				updateData.tanggalPublikasi = new Date();
			}

			await db.update(berita).set(updateData).where(eq(berita.id, id));

			return { success: true, message: 'Berita berhasil diperbarui' };
		} catch (err) {
			console.error('Update berita error:', err);
			return fail(500, { success: false, message: 'Gagal memperbarui berita' });
		}
	}
};
