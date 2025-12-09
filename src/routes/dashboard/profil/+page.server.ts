import { db } from '$lib/server/database/koneksi';
import { adminUsers } from '$lib/server/database/schema';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { user: locals.user };
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { success: false, message: 'Unauthorized' });

		const formData = await request.formData();
		const namaLengkap = formData.get('namaLengkap')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const avatar = formData.get('avatar')?.toString() || '';

		try {
			await db.update(adminUsers).set({
				namaLengkap: namaLengkap || null,
				email: email || null,
				avatar: avatar || null
			}).where(eq(adminUsers.id, locals.user.id));

			return { success: true, message: 'Profil berhasil diperbarui' };
		} catch (error) {
			console.error(error);
			return fail(500, { success: false, message: 'Gagal memperbarui profil' });
		}
	},

	updatePassword: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { success: false, message: 'Unauthorized' });

		const formData = await request.formData();
		const passwordLama = formData.get('passwordLama')?.toString() || '';
		const passwordBaru = formData.get('passwordBaru')?.toString() || '';
		const konfirmasiPassword = formData.get('konfirmasiPassword')?.toString() || '';

		if (!passwordLama || !passwordBaru || !konfirmasiPassword) {
			return fail(400, { success: false, message: 'Semua field wajib diisi', errors: { password: 'Semua field wajib diisi' } });
		}

		if (passwordBaru !== konfirmasiPassword) {
			return fail(400, { success: false, message: 'Konfirmasi password tidak cocok', errors: { password: 'Konfirmasi password tidak cocok' } });
		}

		if (passwordBaru.length < 6) {
			return fail(400, { success: false, message: 'Password minimal 6 karakter', errors: { password: 'Password minimal 6 karakter' } });
		}

		// Verify old password
		const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, locals.user.id)).limit(1);
		if (!user) return fail(404, { success: false, message: 'User tidak ditemukan' });

		const isValid = await verifyPassword(passwordLama, user.password);
		if (!isValid) {
			return fail(400, { success: false, message: 'Password lama salah', errors: { password: 'Password lama salah' } });
		}

		try {
			const hashedPassword = await hashPassword(passwordBaru);
			await db.update(adminUsers).set({ password: hashedPassword }).where(eq(adminUsers.id, locals.user.id));
			return { success: true, message: 'Password berhasil diubah' };
		} catch (error) {
			console.error(error);
			return fail(500, { success: false, message: 'Gagal mengubah password' });
		}
	}
};

