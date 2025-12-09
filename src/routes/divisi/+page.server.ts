import { db } from '$lib/server/database/koneksi';
import { divisi, pengaturanSitus } from '$lib/server/database/schema';
import { eq, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const list = await db.select().from(divisi).where(eq(divisi.status, 'aktif')).orderBy(asc(divisi.urutan));

	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => { pengaturan[s.kunci] = s.nilai || ''; });

	return { divisi: list, pengaturan };
};
