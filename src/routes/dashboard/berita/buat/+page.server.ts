import { db } from '$lib/server/database/koneksi';
import { berita } from '$lib/server/database/schema';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
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

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
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
			result.error.issues.forEach((err: { path: (string | number)[]; message: string }) => {
				if (err.path[0]) {
					errors[err.path[0].toString()] = err.message;
				}
			});
			return fail(400, { success: false, message: 'Validasi gagal', errors, data });
		}

		// Check slug uniqueness
		const existingSlug = await db
			.select({ id: berita.id })
			.from(berita)
			.where(eq(berita.slug, data.slug))
			.limit(1);

		if (existingSlug.length > 0) {
			return fail(400, {
				success: false,
				message: 'Slug sudah digunakan',
				errors: { slug: 'Slug sudah digunakan, pilih yang lain' },
				data
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
			await db.insert(berita).values({
				judul: data.judul,
				slug: data.slug,
				ringkasan: data.ringkasan || null,
				konten: data.konten,
				kategori: data.kategori || null,
				tags: tagsArray.length > 0 ? tagsArray : null,
				gambarUtama: data.gambarUtama || null,
				status: data.status,
				penulisId: locals.user?.id || null,
				tanggalPublikasi: data.status === 'published' ? new Date() : null
			});

			return { success: true, message: 'Berita berhasil dibuat' };
		} catch (error) {
			console.error('Create berita error:', error);
			return fail(500, { success: false, message: 'Gagal membuat berita', data });
		}
	}
};

