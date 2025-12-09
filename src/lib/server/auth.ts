import { db } from '$lib/server/database/koneksi';
import { adminUsers, sessions } from '$lib/server/database/schema';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import type { RequestEvent } from '@sveltejs/kit';

// 1. Fungsi Hash Password
export const hashPassword = async (password: string) => {
	return await hash(password, 12);
};

// 2. Fungsi Verifikasi Password
export const verifyPassword = async (password: string, hash: string) => {
	return await compare(password, hash);
};

// 3. Fungsi Membuat Session (Login)
export const createSession = async (userId: number) => {
	const sessionId = randomUUID();
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 Hari

	await db.insert(sessions).values({
		id: sessionId,
		userId: userId,
		expiresAt: expiresAt
	});

	return sessionId;
};

// 4. Fungsi Mengambil User dari Session (Cek Login)
export const getUserFromSession = async (sessionId: string) => {
	const result = await db
		.select({
			user: adminUsers,
			session: sessions
		})
		.from(sessions)
		.innerJoin(adminUsers, eq(sessions.userId, adminUsers.id))
		.where(eq(sessions.id, sessionId))
		.limit(1);

	if (result.length === 0) return null;

	const { user, session } = result[0];

	// Cek kadaluarsa
	if (Date.now() > session.expiresAt.getTime()) {
		await db.delete(sessions).where(eq(sessions.id, sessionId));
		return null;
	}

	return user;
};

// 5. Helper untuk set Cookie
export const setSessionCookie = (event: RequestEvent, sessionId: string) => {
	event.cookies.set('session_id', sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 60 * 60 * 24 * 7 // 7 Hari
	});
};
