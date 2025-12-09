import { db } from '$lib/server/database/koneksi';
import { berita, pengaturanSitus } from '$lib/server/database/schema';
import { count, desc, like, eq, and, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const search = url.searchParams.get('search') || '';
	const kategori = url.searchParams.get('kategori') || '';
	const itemsPerPage = 9;

	const conditions = [eq(berita.status, 'published')];
	if (search) conditions.push(like(berita.judul, `%${search}%`));
	if (kategori) conditions.push(eq(berita.kategori, kategori));

	const whereClause = and(...conditions);

	const [countResult] = await db.select({ count: count() }).from(berita).where(whereClause);
	const totalItems = countResult.count;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const offset = (page - 1) * itemsPerPage;

	const list = await db
		.select({
			id: berita.id,
			judul: berita.judul,
			slug: berita.slug,
			ringkasan: berita.ringkasan,
			gambarUtama: berita.gambarUtama,
			kategori: berita.kategori,
			dibuatPada: berita.dibuatPada
		})
		.from(berita)
		.where(whereClause)
		.orderBy(desc(berita.dibuatPada))
		.limit(itemsPerPage)
		.offset(offset);

	const formatted = list.map((b) => ({
		...b,
		dibuatPada: b.dibuatPada ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(b.dibuatPada)) : ''
	}));

	// Get categories
	const categoriesResult = await db.selectDistinct({ kategori: berita.kategori }).from(berita).where(sql`${berita.kategori} IS NOT NULL AND ${berita.kategori} != '' AND ${berita.status} = 'published'`);
	const categories = categoriesResult.map((c) => c.kategori).filter((c): c is string => c !== null);

	// Get site settings
	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => { pengaturan[s.kunci] = s.nilai || ''; });

	return {
		berita: formatted,
		pagination: { currentPage: page, totalPages, totalItems },
		filters: { search, kategori },
		categories,
		pengaturan
	};
};

