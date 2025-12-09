import { db } from '$lib/server/database/koneksi';
import { dokumen } from '$lib/server/database/schema';
import { fail, error } from '@sveltejs/kit';
import { eq, and, ne } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const schema = z.object({
	judul: z.string().min(1).max(255),
	slug: z.string().min(1).max(255),
	deskripsi: z.string().optional(),
	kategori: z.enum(['AD/ART', 'Surat Keputusan', 'Laporan', 'Lainnya']),
	fileUrl: z.string().url(),
	fileNama: z.string().optional(),
	status: z.enum(['aktif', 'nonaktif'])
});

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw error(404, 'Tidak ditemukan');
	const [result] = await db.select().from(dokumen).where(eq(dokumen.id, id)).limit(1);
	if (!result) throw error(404, 'Tidak ditemukan');
	return { dokumen: result };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id);
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
			result.error.errors.forEach((err) => { if (err.path[0]) errors[err.path[0].toString()] = err.message; });
			return fail(400, { success: false, message: 'Validasi gagal', errors });
		}

		const existingSlug = await db.select({ id: dokumen.id }).from(dokumen).where(and(eq(dokumen.slug, data.slug), ne(dokumen.id, id))).limit(1);
		if (existingSlug.length > 0) return fail(400, { success: false, message: 'Slug sudah digunakan', errors: { slug: 'Slug sudah digunakan' } });

		try {
			await db.update(dokumen).set({
				judul: data.judul,
				slug: data.slug,
				deskripsi: data.deskripsi || null,
				kategori: data.kategori,
				fileUrl: data.fileUrl,
				fileNama: data.fileNama || null,
				status: data.status
			}).where(eq(dokumen.id, id));
			return { success: true, message: 'Dokumen berhasil diperbarui' };
		} catch (err) { console.error(err); return fail(500, { success: false, message: 'Gagal memperbarui' }); }
	}
};
