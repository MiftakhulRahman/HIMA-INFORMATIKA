import { db } from '$lib/server/database/koneksi';
import { programKerja, divisi } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
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

export const load: PageServerLoad = async () => {
	const divisiList = await db.select({ id: divisi.id, nama: divisi.nama }).from(divisi);
	return { divisiList };
};

export const actions: Actions = {
	default: async ({ request }) => {
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
			for (const issue of result.error.issues) {
				const key = issue.path[0];
				if (key !== undefined) errors[String(key)] = issue.message;
			}
			return fail(400, { success: false, message: 'Validasi gagal', errors, data });
		}

		try {
			await db.insert(programKerja).values({
				judul: data.judul,
				deskripsi: data.deskripsi || null,
				divisiId: data.divisiId ? parseInt(data.divisiId) : null,
				tahun: data.tahun ? parseInt(data.tahun) : null,
				periode: data.periode || null,
				target: data.target || null,
				status: data.status,
				urutan: parseInt(data.urutan)
			});

			return { success: true, message: 'Program kerja berhasil dibuat' };
		} catch (error) {
			console.error('Create proker error:', error);
			return fail(500, { success: false, message: 'Gagal membuat program kerja', data });
		}
	}
};
