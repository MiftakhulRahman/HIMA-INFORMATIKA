import { db } from '$lib/server/database/koneksi';
import { strukturOrganisasi, divisi } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const schema = z.object({
	nama: z.string().min(1, 'Nama wajib diisi').max(100),
	jabatan: z.string().min(1, 'Jabatan wajib diisi').max(100),
	divisiId: z.string().optional(),
	foto: z.string().url().optional().or(z.literal('')),
	email: z.string().email().optional().or(z.literal('')),
	instagram: z.string().optional(),
	linkedin: z.string().optional(),
	periode: z.string().optional(),
	urutan: z.coerce.number().min(0).default(0),
	status: z.enum(['aktif', 'nonaktif'])
});

export const load: PageServerLoad = async () => {
	const divisiList = await db.select({ id: divisi.id, nama: divisi.nama }).from(divisi);
	return { divisiList };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const data = {
			nama: formData.get('nama')?.toString() || '',
			jabatan: formData.get('jabatan')?.toString() || '',
			divisiId: formData.get('divisiId')?.toString() || '',
			foto: formData.get('foto')?.toString() || '',
			email: formData.get('email')?.toString() || '',
			instagram: formData.get('instagram')?.toString() || '',
			linkedin: formData.get('linkedin')?.toString() || '',
			periode: formData.get('periode')?.toString() || '',
			urutan: formData.get('urutan')?.toString() || '0',
			status: (formData.get('status')?.toString() as 'aktif' | 'nonaktif') || 'aktif'
		};

		const result = schema.safeParse(data);
		if (!result.success) {
			const errors: Record<string, string> = {};
			result.error.issues.forEach((err: { path: (string | number)[]; message: string }) => { if (err.path[0]) errors[err.path[0].toString()] = err.message; });
			return fail(400, { success: false, message: 'Validasi gagal', errors, data });
		}

		try {
			await db.insert(strukturOrganisasi).values({
				nama: data.nama,
				jabatan: data.jabatan,
				divisiId: data.divisiId ? parseInt(data.divisiId) : null,
				foto: data.foto || null,
				email: data.email || null,
				instagram: data.instagram || null,
				linkedin: data.linkedin || null,
				periode: data.periode || null,
				urutan: parseInt(data.urutan),
				status: data.status
			});
			return { success: true, message: 'Anggota berhasil ditambahkan' };
		} catch (error) {
			console.error(error);
			return fail(500, { success: false, message: 'Gagal menambahkan anggota', data });
		}
	}
};

