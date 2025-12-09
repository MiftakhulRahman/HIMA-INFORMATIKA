import { db } from '$lib/server/database/koneksi';
import { programKerja, divisi } from '$lib/server/database/schema';
import { count, desc, like, eq, inArray, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';
	const itemsPerPage = 10;

	const conditions = [];
	if (search) conditions.push(like(programKerja.judul, `%${search}%`));
	if (status && ['rencana', 'berjalan', 'selesai'].includes(status)) {
		conditions.push(eq(programKerja.status, status as 'rencana' | 'berjalan' | 'selesai'));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult] = await db.select({ count: count() }).from(programKerja).where(whereClause);
	const totalItems = countResult.count;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	const prokerList = await db
		.select({
			id: programKerja.id,
			judul: programKerja.judul,
			periode: programKerja.periode,
			tahun: programKerja.tahun,
			status: programKerja.status,
			divisiNama: divisi.nama
		})
		.from(programKerja)
		.leftJoin(divisi, eq(programKerja.divisiId, divisi.id))
		.where(whereClause)
		.orderBy(desc(programKerja.dibuatPada))
		.limit(itemsPerPage)
		.offset(offset);

	return {
		programKerja: prokerList,
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
			await db.delete(programKerja).where(eq(programKerja.id, parseInt(id.toString())));
			return { success: true, message: 'Program kerja berhasil dihapus' };
		} catch (error) {
			console.error('Delete error:', error);
			return fail(500, { success: false, message: 'Gagal menghapus program kerja' });
		}
	},

	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = formData.getAll('ids').map((id) => parseInt(id.toString()));
		if (ids.length === 0) return fail(400, { success: false, message: 'Tidak ada yang dipilih' });

		try {
			await db.delete(programKerja).where(inArray(programKerja.id, ids));
			return { success: true, message: `${ids.length} program kerja berhasil dihapus` };
		} catch (error) {
			console.error('Bulk delete error:', error);
			return fail(500, { success: false, message: 'Gagal menghapus' });
		}
	}
};

