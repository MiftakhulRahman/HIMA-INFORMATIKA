import { db } from '$lib/server/database/koneksi';
import { pengaturanSitus } from '$lib/server/database/schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const settings = await db.select().from(pengaturanSitus);
	const pengaturan: Record<string, string> = {};
	settings.forEach((s) => {
		pengaturan[s.kunci] = s.nilai || '';
	});

	return { pengaturan };
};
