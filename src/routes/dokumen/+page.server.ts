import { db } from '$lib/server/database/koneksi';
import { dokumen, pengaturanSitus } from '$lib/server/database/schema';
import { eq, asc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const list = await db.select().from(dokumen).where(eq(dokumen.status, 'aktif')).orderBy(asc(dokumen.kategori));

	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => { pengaturan[s.kunci] = s.nilai || ''; });

	return { dokumen: list, pengaturan };
};
