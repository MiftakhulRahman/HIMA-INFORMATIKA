import { db } from '$lib/server/database/koneksi';
import { berita } from '$lib/server/database/schema';
import { count, desc, like, eq, inArray, and, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// Get query params
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';
	const kategori = url.searchParams.get('kategori') || '';
	const itemsPerPage = 10;

	// Build where conditions
	const conditions = [];

	if (search) {
		conditions.push(like(berita.judul, `%${search}%`));
	}

	if (status && (status === 'draft' || status === 'published')) {
		conditions.push(eq(berita.status, status));
	}

	if (kategori) {
		conditions.push(eq(berita.kategori, kategori));
	}

	const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

	// Get total count
	const [countResult] = await db
		.select({ count: count() })
		.from(berita)
		.where(whereClause);

	const totalItems = countResult.count;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	// Get berita list
	const beritaList = await db
		.select({
			id: berita.id,
			judul: berita.judul,
			slug: berita.slug,
			kategori: berita.kategori,
			status: berita.status,
			dilihatCount: berita.dilihatCount,
			gambarUtama: berita.gambarUtama,
			dibuatPada: berita.dibuatPada
		})
		.from(berita)
		.where(whereClause)
		.orderBy(desc(berita.dibuatPada))
		.limit(itemsPerPage)
		.offset(offset);

	// Format dates
	const formattedBerita = beritaList.map((item) => ({
		...item,
		dibuatPada: item.dibuatPada
			? new Intl.DateTimeFormat('id-ID', {
					day: 'numeric',
					month: 'short',
					year: 'numeric'
				}).format(new Date(item.dibuatPada))
			: '-'
	}));

	// Get unique categories for filter
	const categoriesResult = await db
		.selectDistinct({ kategori: berita.kategori })
		.from(berita)
		.where(sql`${berita.kategori} IS NOT NULL AND ${berita.kategori} != ''`);

	const categories = categoriesResult
		.map((c) => c.kategori)
		.filter((c): c is string => c !== null);

	return {
		berita: formattedBerita,
		pagination: {
			currentPage: page,
			totalPages,
			totalItems,
			itemsPerPage
		},
		filters: {
			search,
			status,
			kategori
		},
		categories
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
			await db.delete(berita).where(eq(berita.id, parseInt(id.toString())));
			return { success: true, message: 'Berita berhasil dihapus' };
		} catch (error) {
			console.error('Delete error:', error);
			return fail(500, { success: false, message: 'Gagal menghapus berita' });
		}
	},

	bulkDelete: async ({ request }) => {
		const formData = await request.formData();
		const ids = formData.getAll('ids').map((id) => parseInt(id.toString()));

		if (ids.length === 0) {
			return fail(400, { success: false, message: 'Tidak ada berita yang dipilih' });
		}

		try {
			await db.delete(berita).where(inArray(berita.id, ids));
			return { success: true, message: `${ids.length} berita berhasil dihapus` };
		} catch (error) {
			console.error('Bulk delete error:', error);
			return fail(500, { success: false, message: 'Gagal menghapus berita' });
		}
	},

	toggleStatus: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const currentStatus = formData.get('status');

		if (!id) {
			return fail(400, { success: false, message: 'ID tidak valid' });
		}

		try {
			const newStatus = currentStatus === 'published' ? 'draft' : 'published';
			await db
				.update(berita)
				.set({ status: newStatus })
				.where(eq(berita.id, parseInt(id.toString())));
			return { success: true, message: `Status berubah menjadi ${newStatus}` };
		} catch (error) {
			console.error('Toggle status error:', error);
			return fail(500, { success: false, message: 'Gagal mengubah status' });
		}
	}
};

