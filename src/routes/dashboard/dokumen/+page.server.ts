import { db } from '$lib/server/database/koneksi';
import { dokumen } from '$lib/server/database/schema';
import { count, desc, like, eq, inArray, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';
	const kategori = url.searchParams.get('kategori') || '';
	const itemsPerPage = 10;

	const conditions = [];
	if (search) conditions.push(like(dokumen.judul, `%${search}%`));
	if (status && ['aktif', 'nonaktif'].includes(status)) conditions.push(eq(dokumen.status, status as 'aktif' | 'nonaktif'));
	if (kategori) conditions.push(eq(dokumen.kategori, kategori as 'AD/ART' | 'Surat Keputusan' | 'Laporan' | 'Lainnya'));

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
	const [countResult] = await db.select({ count: count() }).from(dokumen).where(whereClause);
	const totalItems = countResult.count;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	const list = await db.select().from(dokumen).where(whereClause).orderBy(desc(dokumen.dibuatPada)).limit(itemsPerPage).offset(offset);

	return {
		dokumen: list,
		pagination: { currentPage: page, totalPages, totalItems, itemsPerPage },
		filters: { search, status, kategori }
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		if (!id) return fail(400, { success: false, message: 'ID tidak valid' });
		try {
			await db.delete(dokumen).where(eq(dokumen.id, parseInt(id.toString())));
			return { success: true, message: 'Dokumen berhasil dihapus' };
		} catch (error) { return fail(500, { success: false, message: 'Gagal menghapus' }); }
	},
	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = formData.getAll('ids').map((id) => parseInt(id.toString()));
		if (ids.length === 0) return fail(400, { success: false, message: 'Tidak ada yang dipilih' });
		try {
			await db.delete(dokumen).where(inArray(dokumen.id, ids));
			return { success: true, message: `${ids.length} dokumen berhasil dihapus` };
		} catch (error) { return fail(500, { success: false, message: 'Gagal menghapus' }); }
	}
};

