import { db } from '$lib/server/database/koneksi';
import { strukturOrganisasi, divisi } from '$lib/server/database/schema';
import { count, asc, like, eq, inArray, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';
	const itemsPerPage = 10;

	const conditions = [];
	if (search) conditions.push(like(strukturOrganisasi.nama, `%${search}%`));
	if (status && ['aktif', 'nonaktif'].includes(status)) {
		conditions.push(eq(strukturOrganisasi.status, status as 'aktif' | 'nonaktif'));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const [countResult] = await db.select({ count: count() }).from(strukturOrganisasi).where(whereClause);
	const totalItems = countResult.count;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	const list = await db
		.select({
			id: strukturOrganisasi.id,
			nama: strukturOrganisasi.nama,
			jabatan: strukturOrganisasi.jabatan,
			foto: strukturOrganisasi.foto,
			periode: strukturOrganisasi.periode,
			status: strukturOrganisasi.status,
			divisiNama: divisi.nama
		})
		.from(strukturOrganisasi)
		.leftJoin(divisi, eq(strukturOrganisasi.divisiId, divisi.id))
		.where(whereClause)
		.orderBy(asc(strukturOrganisasi.urutan))
		.limit(itemsPerPage)
		.offset(offset);

	return {
		struktur: list,
		pagination: { currentPage: page, totalPages, totalItems, itemsPerPage },
		filters: { search, status }
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		if (!id) return fail(400, { success: false, message: 'ID tidak valid' });
		try {
			await db.delete(strukturOrganisasi).where(eq(strukturOrganisasi.id, parseInt(id.toString())));
			return { success: true, message: 'Anggota berhasil dihapus' };
		} catch (error) {
			return fail(500, { success: false, message: 'Gagal menghapus' });
		}
	},
	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = formData.getAll('ids').map((id) => parseInt(id.toString()));
		if (ids.length === 0) return fail(400, { success: false, message: 'Tidak ada yang dipilih' });
		try {
			await db.delete(strukturOrganisasi).where(inArray(strukturOrganisasi.id, ids));
			return { success: true, message: `${ids.length} anggota berhasil dihapus` };
		} catch (error) {
			return fail(500, { success: false, message: 'Gagal menghapus' });
		}
	}
};

