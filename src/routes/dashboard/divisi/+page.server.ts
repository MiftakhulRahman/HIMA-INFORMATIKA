import { db } from '$lib/server/database/koneksi';
import { divisi } from '$lib/server/database/schema';
import { count, asc, like, eq, inArray, and } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';
	const itemsPerPage = 10;

	const conditions = [];

	if (search) {
		conditions.push(like(divisi.nama, `%${search}%`));
	}

	if (status && (status === 'aktif' || status === 'nonaktif')) {
		conditions.push(eq(divisi.status, status));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult] = await db.select({ count: count() }).from(divisi).where(whereClause);

	const totalItems = countResult.count;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	const divisiList = await db
		.select()
		.from(divisi)
		.where(whereClause)
		.orderBy(asc(divisi.urutan), asc(divisi.nama))
		.limit(itemsPerPage)
		.offset(offset);

	return {
		divisi: divisiList,
		pagination: {
			currentPage: page,
			totalPages,
			totalItems,
			itemsPerPage
		},
		filters: {
			search,
			status
		}
	};
};

export const actions: Actions = {
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		if (!id) {
			return fail(400, { success: false, message: 'ID tidak valid' });
		}

		try {
			await db.delete(divisi).where(eq(divisi.id, parseInt(id.toString())));
			return { success: true, message: 'Divisi berhasil dihapus' };
		} catch (error) {
			console.error('Delete error:', error);
			return fail(500, { success: false, message: 'Gagal menghapus divisi' });
		}
	},

	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = formData.getAll('ids').map((id) => parseInt(id.toString()));

		if (ids.length === 0) {
			return fail(400, { success: false, message: 'Tidak ada divisi yang dipilih' });
		}

		try {
			await db.delete(divisi).where(inArray(divisi.id, ids));
			return { success: true, message: `${ids.length} divisi berhasil dihapus` };
		} catch (error) {
			console.error('Bulk delete error:', error);
			return fail(500, { success: false, message: 'Gagal menghapus divisi' });
		}
	}
};

