import {
	mysqlTable,
	serial,
	varchar,
	timestamp,
	datetime,
	text,
	int,
	bigint,
	mysqlEnum,
	json
} from 'drizzle-orm/mysql-core';

// 1. Tabel Admin Users
export const adminUsers = mysqlTable('admin_users', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 50 }).notNull().unique(),
	email: varchar('email', { length: 100 }),
	password: varchar('password', { length: 255 }).notNull(),
	namaLengkap: varchar('nama_lengkap', { length: 100 }),
	avatar: varchar('avatar', { length: 255 }),
	terakhirLogin: datetime('terakhir_login'),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 2. Tabel Sessions (Untuk login)
export const sessions = mysqlTable('sessions', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: bigint('user_id', { mode: 'number', unsigned: true }).references(() => adminUsers.id),
	expiresAt: datetime('expires_at').notNull()
});

// 3. Tabel Pengaturan Situs
export const pengaturanSitus = mysqlTable('pengaturan_situs', {
	id: serial('id').primaryKey(),
	kunci: varchar('kunci', { length: 100 }).notNull().unique(),
	nilai: text('nilai'),
	tipe: mysqlEnum('tipe', ['text', 'image', 'json', 'number']).default('text'),
	grup: varchar('grup', { length: 50 }),
	deskripsi: varchar('deskripsi', { length: 255 }),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 4. Tabel Berita
export const berita = mysqlTable('berita', {
	id: serial('id').primaryKey(),
	judul: varchar('judul', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	ringkasan: text('ringkasan'),
	konten: text('konten'),
	gambarUtama: varchar('gambar_utama', { length: 255 }),
	kategori: varchar('kategori', { length: 100 }),
	tags: json('tags').$type<string[]>(),
	penulisId: bigint('penulis_id', { mode: 'number', unsigned: true }).references(() => adminUsers.id),
	dilihatCount: int('dilihat_count').default(0),
	status: mysqlEnum('status', ['draft', 'published']).default('draft'),
	tanggalPublikasi: datetime('tanggal_publikasi'),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 5. Tabel Divisi
export const divisi = mysqlTable('divisi', {
	id: serial('id').primaryKey(),
	nama: varchar('nama', { length: 100 }).notNull(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	deskripsi: text('deskripsi'),
	ikon: varchar('ikon', { length: 100 }),
	gambarBanner: varchar('gambar_banner', { length: 255 }),
	urutan: int('urutan').default(0),
	status: mysqlEnum('status', ['aktif', 'nonaktif']).default('aktif'),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 6. Tabel Program Kerja
export const programKerja = mysqlTable('program_kerja', {
	id: serial('id').primaryKey(),
	judul: varchar('judul', { length: 255 }).notNull(),
	deskripsi: text('deskripsi'),
	divisiId: bigint('divisi_id', { mode: 'number', unsigned: true }).references(() => divisi.id),
	tahun: int('tahun'),
	periode: varchar('periode', { length: 20 }),
	target: text('target'),
	status: mysqlEnum('status', ['rencana', 'berjalan', 'selesai']).default('rencana'),
	urutan: int('urutan').default(0),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 7. Tabel Struktur Organisasi
export const strukturOrganisasi = mysqlTable('struktur_organisasi', {
	id: serial('id').primaryKey(),
	nama: varchar('nama', { length: 100 }).notNull(),
	jabatan: varchar('jabatan', { length: 100 }).notNull(),
	divisiId: bigint('divisi_id', { mode: 'number', unsigned: true }).references(() => divisi.id),
	foto: varchar('foto', { length: 255 }),
	email: varchar('email', { length: 100 }),
	instagram: varchar('instagram', { length: 100 }),
	linkedin: varchar('linkedin', { length: 100 }),
	urutan: int('urutan').default(0),
	periode: varchar('periode', { length: 20 }),
	status: mysqlEnum('status', ['aktif', 'nonaktif']).default('aktif'),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 8. Tabel Dokumen
export const dokumen = mysqlTable('dokumen', {
	id: serial('id').primaryKey(),
	judul: varchar('judul', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	deskripsi: text('deskripsi'),
	kategori: mysqlEnum('kategori', ['AD/ART', 'Surat Keputusan', 'Laporan', 'Lainnya']).default(
		'Lainnya'
	),
	fileUrl: varchar('file_url', { length: 255 }).notNull(),
	fileNama: varchar('file_nama', { length: 255 }),
	fileUkuran: int('file_ukuran'),
	jumlahUnduhan: int('jumlah_unduhan').default(0),
	status: mysqlEnum('status', ['aktif', 'nonaktif']).default('aktif'),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 9. Tabel Galeri
export const galeri = mysqlTable('galeri', {
	id: serial('id').primaryKey(),
	judul: varchar('judul', { length: 255 }),
	deskripsi: text('deskripsi'),
	gambarUrl: varchar('gambar_url', { length: 255 }).notNull(),
	thumbnailUrl: varchar('thumbnail_url', { length: 255 }),
	kategori: varchar('kategori', { length: 100 }),
	tags: json('tags').$type<string[]>(),
	urutan: int('urutan').default(0),
	status: mysqlEnum('status', ['aktif', 'nonaktif']).default('aktif'),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// 10. Tabel Menu
export const menu = mysqlTable('menu', {
	id: serial('id').primaryKey(),
	label: varchar('label', { length: 100 }).notNull(),
	url: varchar('url', { length: 255 }),
	parentId: int('parent_id'),
	urutan: int('urutan').default(0),
	ikon: varchar('ikon', { length: 100 }),
	tipe: mysqlEnum('tipe', ['internal', 'external']).default('internal'),
	target: mysqlEnum('target', ['_self', '_blank']).default('_self'),
	status: mysqlEnum('status', ['aktif', 'nonaktif']).default('aktif')
});

// 11. Tabel Media Library
export const mediaLibrary = mysqlTable('media_library', {
	id: serial('id').primaryKey(),
	namaFile: varchar('nama_file', { length: 255 }).notNull(),
	pathFile: varchar('path_file', { length: 500 }).notNull(),
	tipe: mysqlEnum('tipe', ['image', 'document', 'video']).default('image'),
	ukuran: int('ukuran'),
	mimeType: varchar('mime_type', { length: 100 }),
	altText: varchar('alt_text', { length: 255 }),
	diunggahOleh: bigint('diunggah_oleh', { mode: 'number', unsigned: true }).references(() => adminUsers.id),
	diunggahPada: timestamp('diunggah_pada').defaultNow()
});

// 12. Tabel Halaman (Static Pages)
export const halaman = mysqlTable('halaman', {
	id: serial('id').primaryKey(),
	slug: varchar('slug', { length: 100 }).notNull().unique(),
	judul: varchar('judul', { length: 255 }).notNull(),
	konten: text('konten'),
	metaDeskripsi: varchar('meta_deskripsi', { length: 255 }),
	metaKeywords: varchar('meta_keywords', { length: 255 }),
	gambarHeader: varchar('gambar_header', { length: 255 }),
	urutan: int('urutan').default(0),
	status: mysqlEnum('status', ['draft', 'published']).default('draft'),
	dibuatPada: timestamp('dibuat_pada').defaultNow(),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow(),
	dibuatOleh: bigint('dibuat_oleh', { mode: 'number', unsigned: true }).references(() => adminUsers.id)
});

// 13. Tabel SEO Meta
export const seoMeta = mysqlTable('seo_meta', {
	id: serial('id').primaryKey(),
	halamanTipe: mysqlEnum('halaman_tipe', ['home', 'page', 'news', 'division']).notNull(),
	referensiId: int('referensi_id'),
	metaTitle: varchar('meta_title', { length: 255 }),
	metaDescription: varchar('meta_description', { length: 255 }),
	metaKeywords: varchar('meta_keywords', { length: 255 }),
	ogImage: varchar('og_image', { length: 255 }),
	ogType: varchar('og_type', { length: 50 }),
	canonicalUrl: varchar('canonical_url', { length: 255 }),
	diperbaruiPada: timestamp('diperbarui_pada').defaultNow().onUpdateNow()
});

// Type exports untuk convenience
export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type Berita = typeof berita.$inferSelect;
export type NewBerita = typeof berita.$inferInsert;
export type Divisi = typeof divisi.$inferSelect;
export type NewDivisi = typeof divisi.$inferInsert;
export type ProgramKerja = typeof programKerja.$inferSelect;
export type NewProgramKerja = typeof programKerja.$inferInsert;
export type StrukturOrganisasi = typeof strukturOrganisasi.$inferSelect;
export type NewStrukturOrganisasi = typeof strukturOrganisasi.$inferInsert;
export type Dokumen = typeof dokumen.$inferSelect;
export type NewDokumen = typeof dokumen.$inferInsert;
export type Galeri = typeof galeri.$inferSelect;
export type NewGaleri = typeof galeri.$inferInsert;
export type Menu = typeof menu.$inferSelect;
export type NewMenu = typeof menu.$inferInsert;
export type MediaLibrary = typeof mediaLibrary.$inferSelect;
export type NewMediaLibrary = typeof mediaLibrary.$inferInsert;
export type Halaman = typeof halaman.$inferSelect;
export type NewHalaman = typeof halaman.$inferInsert;
export type PengaturanSitus = typeof pengaturanSitus.$inferSelect;
export type SeoMeta = typeof seoMeta.$inferSelect;