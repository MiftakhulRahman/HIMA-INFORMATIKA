import { db } from '$lib/server/database/koneksi';
import { adminUsers } from '$lib/server/database/schema';
import { hashPassword } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    // Cek apakah sudah ada admin?
    const existingAdmin = await db.query.adminUsers.findFirst();
    if (existingAdmin) {
        return { message: "Admin sudah ada. Setup dilarang demi keamanan." };
    }
    return { message: "Silakan refresh halaman ini untuk membuat Admin Default." };
};

export const actions = {
    default: async () => {
        // Cek lagi demi keamanan
        const existingAdmin = await db.query.adminUsers.findFirst();
        if (existingAdmin) return fail(400, { message: "Admin sudah ada!" });

        const password = await hashPassword('admin123'); // Password Default

        await db.insert(adminUsers).values({
            username: 'admin',
            email: 'admin@hima.id',
            namaLengkap: 'Super Admin',
            passwordHash: password,
            terakhirLogin: new Date()
        });

        return { success: true, message: "Admin berhasil dibuat: User: admin, Pass: admin123" };
    }
};