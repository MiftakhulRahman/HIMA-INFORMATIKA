import { db } from '$lib/server/database/koneksi';
import { dokumen } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const schema = z.object({
	judul: z.string().min(1, 'Judul wajib diisi').max(255),
	slug: z.string().min(1, 'Slug wajib diisi').max(255),
	deskripsi: z.string().optional(),
	kategori: z.enum(['AD/ART', 'Surat Keputusan', 'Laporan', 'Lainnya']),
	fileUrl: z.string().url('URL file wajib diisi'),
	fileNama: z.string().optional(),
	status: z.enum(['aktif', 'nonaktif'])
});

export const load: PageServerLoad = async () => ({});

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			judul: formData.get('judul')?.toString() || '',
			slug: formData.get('slug')?.toString() || '',
			deskripsi: formData.get('deskripsi')?.toString() || '',
			kategori: (formData.get('kategori')?.toString() as 'AD/ART' | 'Surat Keputusan' | 'Laporan' | 'Lainnya') || 'Lainnya',
			fileUrl: formData.get('fileUrl')?.toString() || '',
			fileNama: formData.get('fileNama')?.toString() || '',
			status: (formData.get('status')?.toString() as 'aktif' | 'nonaktif') || 'aktif'
		};

		const result = schema.safeParse(data);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.issues.forEach((err: { path: (string | number)[]; message: string }) => { if (err.path[0]) errors[err.path[0].toString()] = err.message; });
			return fail(400, { success: false, message: 'Validasi gagal', errors, data });
		}

		const existingSlug = await db.select({ id: dokumen.id }).from(dokumen).where(eq(dokumen.slug, data.slug)).limit(1);
		if (existingSlug.length > 0) return fail(400, { success: false, message: 'Slug sudah digunakan', errors: { slug: 'Slug sudah digunakan' }, data });

		try {
			await db.insert(dokumen).values({
				judul: data.judul,
				slug: data.slug,
				deskripsi: data.deskripsi || null,
				kategori: data.kategori,
				fileUrl: data.fileUrl,
				fileNama: data.fileNama || null,
				status: data.status
			});
			return { success: true, message: 'Dokumen berhasil ditambahkan' };
		} catch (error) {
			console.error(error);
			return fail(500, { success: false, message: 'Gagal menambahkan dokumen', data });
		}
	}
};

