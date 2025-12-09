import { mysqlTable, serial, varchar, timestamp, datetime } from 'drizzle-orm/mysql-core';

// 1. Tabel Admin Users
export const adminUsers = mysqlTable('admin_users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    namaLengkap: varchar('nama_lengkap', { length: 100 }).notNull(),
    fotoProfil: varchar('foto_profil', { length: 255 }),
    terakhirLogin: datetime('terakhir_login'),
    dibuatPada: timestamp('dibuat_pada').defaultNow(),
    diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow(),
});

// 2. Tabel Sessions (Untuk login)
export const sessions = mysqlTable('sessions', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: serial('user_id').references(() => adminUsers.id),
    expiresAt: datetime('expires_at').notNull()
});