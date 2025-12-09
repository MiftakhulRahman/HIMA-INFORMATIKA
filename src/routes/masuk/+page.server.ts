import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database/koneksi';
import { adminUsers } from '$lib/server/database/schema';
import { verifyPassword, createSession, setSessionCookie } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const actions = {
    default: async (event: RequestEvent) => {
        const formData = await event.request.formData();
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        if (!username || !password) {
            return fail(400, { error: 'Username dan password wajib diisi' });
        }

        // 1. Cari user by username
        const user = await db.query.adminUsers.findFirst({
            where: eq(adminUsers.username, username)
        });

        if (!user) {
            return fail(400, { error: 'Username atau password salah' });
        }

        // 2. Cek Password
        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return fail(400, { error: 'Username atau password salah' });
        }

        // 3. Login Berhasil: Buat Session
        const sessionId = await createSession(user.id);
        setSessionCookie(event, sessionId);

        // 4. Update terakhir login
        await db.update(adminUsers)
            .set({ terakhirLogin: new Date() })
            .where(eq(adminUsers.id, user.id));

        // 5. Redirect ke Dashboard
        throw redirect(302, '/dashboard');
    }
};