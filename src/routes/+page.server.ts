import { db } from '$lib/server/database/koneksi';
import { pengaturanSitus, berita, divisi } from '$lib/server/database/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get site settings
	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => {
		pengaturan[s.kunci] = s.nilai || '';
	});

	// Get latest news
	const beritaTerbaru = await db
		.select({
			id: berita.id,
			judul: berita.judul,
			slug: berita.slug,
			ringkasan: berita.ringkasan,
			gambarUtama: berita.gambarUtama,
			dibuatPada: berita.dibuatPada
		})
		.from(berita)
		.where(eq(berita.status, 'published'))
		.orderBy(desc(berita.dibuatPada))
		.limit(3);

	const formattedBerita = beritaTerbaru.map((b) => ({
		...b,
		dibuatPada: b.dibuatPada
			? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(b.dibuatPada))
			: ''
	}));

	// Get active divisi
	const divisiList = await db
		.select({
			id: divisi.id,
			nama: divisi.nama,
			slug: divisi.slug,
			deskripsi: divisi.deskripsi,
			ikon: divisi.ikon
		})
		.from(divisi)
		.where(eq(divisi.status, 'aktif'))
		.orderBy(divisi.urutan)
		.limit(6);

	return {
		pengaturan,
		beritaTerbaru: formattedBerita,
		divisiList
	};
};
