import { db } from '$lib/server/database/koneksi';
import { programKerja, divisi, pengaturanSitus } from '$lib/server/database/schema';
import { asc, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const list = await db
		.select({
			id: programKerja.id,
			judul: programKerja.judul,
			deskripsi: programKerja.deskripsi,
			divisiNama: divisi.nama,
			tahun: programKerja.tahun,
			periode: programKerja.periode,
			status: programKerja.status
		})
		.from(programKerja)
		.leftJoin(divisi, eq(programKerja.divisiId, divisi.id))
		.orderBy(asc(programKerja.urutan));

	const divisiList = await db
		.select({ id: divisi.id, nama: divisi.nama })
		.from(divisi)
		.where(eq(divisi.status, 'aktif'));

	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => { pengaturan[s.kunci] = s.nilai || ''; });

	return { programKerja: list, divisiList, pengaturan };
};
