import { db } from '$lib/server/database/koneksi';
import { divisi, strukturOrganisasi, programKerja } from '$lib/server/database/schema';
import { eq, and, asc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [result] = await db
		.select()
		.from(divisi)
		.where(and(eq(divisi.slug, params.slug), eq(divisi.status, 'aktif')))
		.limit(1);

	if (!result) {
		throw error(404, 'Divisi tidak ditemukan');
	}

	const anggota = await db
		.select({ id: strukturOrganisasi.id, nama: strukturOrganisasi.nama, jabatan: strukturOrganisasi.jabatan, foto: strukturOrganisasi.foto })
		.from(strukturOrganisasi)
		.where(and(eq(strukturOrganisasi.divisiId, result.id), eq(strukturOrganisasi.status, 'aktif')))
		.orderBy(asc(strukturOrganisasi.urutan));

	const proker = await db
		.select({ id: programKerja.id, judul: programKerja.judul, status: programKerja.status })
		.from(programKerja)
		.where(eq(programKerja.divisiId, result.id))
		.orderBy(asc(programKerja.urutan));

	return { divisi: result, anggota, programKerja: proker };
};
