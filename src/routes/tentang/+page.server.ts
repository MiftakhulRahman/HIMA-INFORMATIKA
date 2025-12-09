import { db } from '$lib/server/database/koneksi';
import { pengaturanSitus, divisi, strukturOrganisasi, programKerja } from '$lib/server/database/schema';
import { count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => { pengaturan[s.kunci] = s.nilai || ''; });

	const [divisiCount] = await db.select({ count: count() }).from(divisi).where(eq(divisi.status, 'aktif'));
	const [anggotaCount] = await db.select({ count: count() }).from(strukturOrganisasi).where(eq(strukturOrganisasi.status, 'aktif'));
	const [prokerCount] = await db.select({ count: count() }).from(programKerja);

	return {
		pengaturan,
		stats: {
			divisi: divisiCount.count,
			anggota: anggotaCount.count,
			proker: prokerCount.count
		}
	};
};
