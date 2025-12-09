import { db } from '$lib/server/database/koneksi';
import { strukturOrganisasi, divisi, pengaturanSitus } from '$lib/server/database/schema';
import { eq, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const list = await db
		.select({
			id: strukturOrganisasi.id,
			nama: strukturOrganisasi.nama,
			jabatan: strukturOrganisasi.jabatan,
			foto: strukturOrganisasi.foto,
			divisiNama: divisi.nama,
			instagram: strukturOrganisasi.instagram,
			linkedin: strukturOrganisasi.linkedin
		})
		.from(strukturOrganisasi)
		.leftJoin(divisi, eq(strukturOrganisasi.divisiId, divisi.id))
		.where(eq(strukturOrganisasi.status, 'aktif'))
		.orderBy(asc(strukturOrganisasi.urutan));

	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => { pengaturan[s.kunci] = s.nilai || ''; });

	return { pengurus: list, pengaturan };
};
