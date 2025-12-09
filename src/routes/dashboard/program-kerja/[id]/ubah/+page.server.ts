import { db } from '$lib/server/database/koneksi';
import { programKerja, divisi } from '$lib/server/database/schema';
import { fail, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const prokerSchema = z.object({
	judul: z.string().min(1, 'Judul wajib diisi').max(255),
	deskripsi: z.string().optional(),
	divisiId: z.string().optional(),
	tahun: z.coerce.number().min(2020).max(2030).optional(),
	periode: z.string().optional(),
	target: z.string().optional(),
	status: z.enum(['rencana', 'berjalan', 'selesai']),
	urutan: z.coerce.number().min(0).default(0)
});

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw error(404, 'Program kerja tidak ditemukan');

	const [result] = await db.select().from(programKerja).where(eq(programKerja.id, id)).limit(1);
	if (!result) throw error(404, 'Program kerja tidak ditemukan');

	const divisiList = await db.select({ id: divisi.id, nama: divisi.nama }).from(divisi);

	return { programKerja: result, divisiList };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const id = parseInt(params.id);
		const formData = await request.formData();

		const data = {
			judul: formData.get('judul')?.toString() || '',
			deskripsi: formData.get('deskripsi')?.toString() || '',
			divisiId: formData.get('divisiId')?.toString() || '',
			tahun: formData.get('tahun')?.toString() || '',
			periode: formData.get('periode')?.toString() || '',
			target: formData.get('target')?.toString() || '',
			status: (formData.get('status')?.toString() as 'rencana' | 'berjalan' | 'selesai') || 'rencana',
			urutan: formData.get('urutan')?.toString() || '0'
		};

		const result = prokerSchema.safeParse(data);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.errors.forEach((err) => {
				if (err.path[0]) errors[err.path[0].toString()] = err.message;
			});
			return fail(400, { success: false, message: 'Validasi gagal', errors });
		}

		try {
			await db
				.update(programKerja)
				.set({
					judul: data.judul,
					deskripsi: data.deskripsi || null,
					divisiId: data.divisiId ? parseInt(data.divisiId) : null,
					tahun: data.tahun ? parseInt(data.tahun) : null,
					periode: data.periode || null,
					target: data.target || null,
					status: data.status,
					urutan: parseInt(data.urutan)
				})
				.where(eq(programKerja.id, id));

			return { success: true, message: 'Program kerja berhasil diperbarui' };
		} catch (err) {
			console.error('Update proker error:', err);
			return fail(500, { success: false, message: 'Gagal memperbarui program kerja' });
		}
	}
};
