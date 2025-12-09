import { db } from '$lib/server/database/koneksi';
import { berita } from '$lib/server/database/schema';
import { eq, and, ne, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [result] = await db
		.select()
		.from(berita)
		.where(and(eq(berita.slug, params.slug), eq(berita.status, 'published')))
		.limit(1);

	if (!result) {
		throw error(404, 'Berita tidak ditemukan');
	}

	// Increment view count
	await db.update(berita).set({ dilihatCount: result.dilihatCount + 1 }).where(eq(berita.id, result.id));

	// Get related news
	const related = await db
		.select({
			id: berita.id,
			judul: berita.judul,
			slug: berita.slug,
			gambarUtama: berita.gambarUtama
		})
		.from(berita)
		.where(and(eq(berita.status, 'published'), ne(berita.id, result.id)))
		.orderBy(desc(berita.dibuatPada))
		.limit(3);

	return {
		berita: {
			...result,
			dibuatPada: result.dibuatPada
				? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(result.dibuatPada))
				: ''
		},
		related
	};
};
