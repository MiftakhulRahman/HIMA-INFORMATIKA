import { db } from '$lib/server/database/koneksi';
import { galeri, pengaturanSitus } from '$lib/server/database/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const list = await db.select().from(galeri).where(eq(galeri.status, 'aktif')).orderBy(desc(galeri.dibuatPada));
	
	const categoriesResult = await db.selectDistinct({ kategori: galeri.kategori }).from(galeri).where(sql`${galeri.kategori} IS NOT NULL AND ${galeri.status} = 'aktif'`);
	const categories = categoriesResult.map((c) => c.kategori).filter((c): c is string => c !== null);

	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => { pengaturan[s.kunci] = s.nilai || ''; });

	return { galeri: list, categories, pengaturan };
};
