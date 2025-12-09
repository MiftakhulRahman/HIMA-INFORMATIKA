import { db } from '$lib/server/database/koneksi';
import { berita, divisi, programKerja, dokumen } from '$lib/server/database/schema';
import { count, sum, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Get statistics
	const [beritaCount] = await db.select({ count: count() }).from(berita);
	const [divisiCount] = await db.select({ count: count() }).from(divisi);
	const [programKerjaCount] = await db.select({ count: count() }).from(programKerja);
	const [dokumenCount] = await db.select({ count: count() }).from(dokumen);

	// Get total views from berita
	const [viewStats] = await db.select({ total: sum(berita.dilihatCount) }).from(berita);

	// Get total downloads from dokumen
	const [downloadStats] = await db.select({ total: sum(dokumen.jumlahUnduhan) }).from(dokumen);

	// Get recent berita
	const recentBeritaData = await db
		.select({
			id: berita.id,
			judul: berita.judul,
			status: berita.status,
			dibuatPada: berita.dibuatPada
		})
		.from(berita)
		.orderBy(desc(berita.dibuatPada))
		.limit(5);

	const recentBerita = recentBeritaData.map((item) => ({
		...item,
		dibuatPada: item.dibuatPada
			? new Intl.DateTimeFormat('id-ID', {
					day: 'numeric',
					month: 'short',
					year: 'numeric'
				}).format(new Date(item.dibuatPada))
			: '-'
	}));

	return {
		user: locals.user,
		stats: {
			totalBerita: beritaCount.count,
			totalDivisi: divisiCount.count,
			totalProgramKerja: programKerjaCount.count,
			totalDokumen: dokumenCount.count,
			totalViews: Number(viewStats.total) || 0,
			totalDownloads: Number(downloadStats.total) || 0
		},
		recentBerita
	};
};

