import { db } from '$lib/server/database/koneksi';
import { galeri } from '$lib/server/database/schema';
import { count, desc, like, eq, inArray } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const itemsPerPage = 20;

	const whereClause = search ? like(galeri.judul, `%${search}%`) : undefined;
	const [countResult] = await db.select({ count: count() }).from(galeri).where(whereClause);
	const totalItems = countResult.count;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	const list = await db.select().from(galeri).where(whereClause).orderBy(desc(galeri.dibuatPada)).limit(itemsPerPage).offset(offset);

	return {
		galeri: list,
		pagination: { currentPage: page, totalPages, totalItems, itemsPerPage },
		filters: { search }
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		if (!id) return fail(400, { success: false, message: 'ID tidak valid' });
		try {
			await db.delete(galeri).where(eq(galeri.id, parseInt(id.toString())));
			return { success: true, message: 'Gambar berhasil dihapus' };
		} catch (error) { return fail(500, { success: false, message: 'Gagal menghapus' }); }
	},
	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = formData.getAll('ids').map((id) => parseInt(id.toString()));
		if (ids.length === 0) return fail(400, { success: false, message: 'Tidak ada yang dipilih' });
		try {
			await db.delete(galeri).where(inArray(galeri.id, ids));
			return { success: true, message: `${ids.length} gambar berhasil dihapus` };
		} catch (error) { return fail(500, { success: false, message: 'Gagal menghapus' }); }
	}
};

