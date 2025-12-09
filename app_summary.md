Rancangan Lengkap Website Himpunan Mahasiswa Informatika

## 🎯 Ringkasan Proyek

Website HIMA Informatika yang fully dynamic, SEO-friendly, dengan CMS capabilities untuk mengelola semua konten tanpa menyentuh kode. Menggunakan arsitektur modern dengan SvelteKit, TiDB MySQL, dan Redis Upstash yang di-deploy di Vercel.

---

## 🏗️ Arsitektur Sistem

### Tech Stack
- **Frontend Framework**: SvelteKit (TypeScript)
- **Database**: TiDB Cloud (MySQL-compatible)
- **Cache & Session**: Redis (Upstash)
- **Deployment**: Vercel (Edge Functions)
- **File Storage**: TiDB (base64) atau Vercel Blob Storage
- **CSS Framework**: TailwindCSS
- **ORM**: Drizzle ORM atau Prisma

### Deployment Architecture
```
User Request
    ↓
Vercel Edge Network
    ↓
SvelteKit SSR/SSG
    ↓
┌─────────────┬──────────────┐
│   Redis     │    TiDB      │
│  (Upstash)  │   (MySQL)    │
│   - Cache   │  - Content   │
│   - Session │  - Users     │
│   - Rate    │  - Media     │
└─────────────┴──────────────┘
```

---

## 📂 Struktur Database (TiDB MySQL)

### Tabel-tabel Utama:

#### 1. **admin_users**
- id (PRIMARY KEY)
- username
- email
- password_hash
- nama_lengkap
- foto_profil
- terakhir_login
- dibuat_pada
- diperbarui_pada

#### 2. **pengaturan_situs**
- id (PRIMARY KEY)
- kunci (UNIQUE) - misal: "nama_hima", "logo_url", "tagline"
- nilai (TEXT)
- tipe - enum: 'text', 'image', 'json', 'number'
- grup - misal: "landing_page", "tentang", "kontak"
- deskripsi
- diperbarui_pada

#### 3. **halaman**
- id (PRIMARY KEY)
- slug (UNIQUE) - misal: "tentang", "visi-misi"
- judul
- konten (LONGTEXT)
- meta_deskripsi
- meta_keywords
- gambar_header
- urutan
- status - enum: 'draft', 'published'
- dibuat_pada
- diperbarui_pada
- dibuat_oleh (FK ke admin_users)

#### 4. **berita**
- id (PRIMARY KEY)
- judul
- slug (UNIQUE)
- ringkasan
- konten (LONGTEXT)
- gambar_utama
- kategori
- tags (JSON)
- penulis_id (FK ke admin_users)
- dilihat_count
- status - enum: 'draft', 'published'
- tanggal_publikasi
- dibuat_pada
- diperbarui_pada

#### 5. **divisi**
- id (PRIMARY KEY)
- nama - misal: "Pemrograman", "Multimedia"
- slug
- deskripsi
- ikon
- gambar_banner
- urutan
- status
- dibuat_pada
- diperbarui_pada

#### 6. **program_kerja**
- id (PRIMARY KEY)
- judul
- deskripsi
- divisi_id (FK ke divisi, nullable)
- tahun
- periode - misal: "2024/2025"
- target
- status - enum: 'rencana', 'berjalan', 'selesai'
- urutan
- dibuat_pada
- diperbarui_pada

#### 7. **struktur_organisasi**
- id (PRIMARY KEY)
- nama
- jabatan
- divisi_id (FK ke divisi, nullable)
- foto
- email
- instagram
- linkedin
- urutan
- periode
- status
- dibuat_pada
- diperbarui_pada

#### 8. **dokumen**
- id (PRIMARY KEY)
- judul
- slug
- deskripsi
- kategori - enum: 'AD/ART', 'Surat Keputusan', 'Laporan', 'Lainnya'
- file_url
- file_nama
- file_ukuran
- jumlah_unduhan
- status
- dibuat_pada
- diperbarui_pada

#### 9. **galeri**
- id (PRIMARY KEY)
- judul
- deskripsi
- gambar_url
- thumbnail_url
- kategori
- tags (JSON)
- urutan
- status
- dibuat_pada
- diperbarui_pada

#### 10. **media_library**
- id (PRIMARY KEY)
- nama_file
- path_file
- tipe - enum: 'image', 'document', 'video'
- ukuran
- mime_type
- alt_text
- diunggah_oleh (FK ke admin_users)
- diunggah_pada

#### 11. **menu**
- id (PRIMARY KEY)
- label
- url
- parent_id (self-referencing FK)
- urutan
- ikon
- tipe - enum: 'internal', 'external'
- target - enum: '_self', '_blank'
- status

#### 12. **seo_meta**
- id (PRIMARY KEY)
- halaman_tipe - enum: 'home', 'page', 'news', 'division'
- referensi_id (ID dari tabel terkait)
- meta_title
- meta_description
- meta_keywords
- og_image
- og_type
- canonical_url
- diperbarui_pada

---

## 🗺️ Struktur URL & Routing

### Halaman Public
```
/ → Landing Page
/tentang → Halaman Tentang
/visi-misi → Visi & Misi
/program-kerja → Daftar Program Kerja
/struktur-organisasi → Struktur Organisasi
/divisi → Daftar Divisi
/divisi/[slug] → Detail Divisi (pemrograman, multimedia, dll)
/berita → Daftar Berita
/berita/[slug] → Detail Berita
/dokumen → Halaman Unduhan
/galeri → Galeri Foto
/kontak → Halaman Kontak
```

### Halaman Dashboard Admin
```
/dashboard → Dashboard Utama
/masuk → Login
/pengaturan-situs → Pengaturan Global
/halaman → Kelola Halaman
/halaman/buat → Buat Halaman Baru
/halaman/[id]/ubah → Edit Halaman
/berita → Kelola Berita
/berita/buat → Buat Berita Baru
/berita/[id]/ubah → Edit Berita
/divisi → Kelola Divisi
/program-kerja → Kelola Program Kerja
/struktur-organisasi → Kelola Struktur Organisasi
/dokumen → Kelola Dokumen
/galeri → Kelola Galeri
/media → Media Library
/menu → Kelola Menu Navigasi
/seo → SEO Settings
/profil → Profil Admin
```

---

## 🎨 Desain & UI/UX

### Landing Page Sections
1. **Hero Section**
   - Gambar/video background dinamis
   - Nama HIMA + tagline
   - CTA button (Gabung, Lihat Program, dll)
   - Animasi modern (parallax, fade-in)

2. **Tentang Singkat**
   - Overview HIMA
   - Angka statistik (jumlah anggota, program, dll)
   - Counter animation

3. **Divisi**
   - Grid/card divisi dengan ikon
   - Hover effect modern
   - Link ke detail

4. **Program Kerja Unggulan**
   - Carousel/slider program
   - Timeline interaktif

5. **Berita Terbaru**
   - Card berita dengan gambar
   - Filter kategori
   - Load more/pagination

6. **Struktur Organisasi Preview**
   - Organizational chart interaktif
   - Foto + nama + jabatan

7. **Call to Action**
   - Join form/social media
   - Kontak info

### Design System
- **Color Palette**: Bisa diatur dari dashboard (primary, secondary, accent)
- **Typography**: Modern fonts (Inter, Poppins, atau custom)
- **Components**: 
  - Cards dengan shadow & hover effects
  - Buttons dengan ripple effect
  - Loading skeletons
  - Toast notifications
  - Modal dialogs
  - Image lightbox
  - Breadcrumbs
  - Pagination
  - Search bars
  
### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- Touch-friendly navigation untuk mobile
- Hamburger menu untuk mobile

---

## 🔐 Authentication & Authorization

### Sistem Login Admin
- **Session-based auth** dengan Redis (Upstash)
- Password hashing dengan bcrypt
- Rate limiting login (5 percobaan per 15 menit)
- Remember me functionality
- Session timeout (30 menit idle)
- CSRF protection

### Security Features
- XSS protection
- SQL injection prevention (prepared statements)
- CORS configuration
- Secure headers
- Input sanitization & validation

---

## 💾 Caching Strategy (Redis Upstash)

### Cache Keys Structure
```
cache:home → Landing page data
cache:berita:list:[page] → Daftar berita per page
cache:berita:[slug] → Detail berita
cache:divisi:list → Daftar divisi
cache:menu:main → Menu navigasi
cache:pengaturan:situs → Pengaturan global
cache:program-kerja → Program kerja
cache:struktur → Struktur organisasi
```

### Cache TTL (Time To Live)
- Landing page: 1 jam
- Berita list: 30 menit
- Berita detail: 1 jam
- Halaman statis: 2 jam
- Menu: 24 jam
- Pengaturan: 6 jam

### Cache Invalidation
- Auto-invalidate saat admin update konten
- Manual clear cache button di dashboard
- Tag-based invalidation

### Rate Limiting Keys
```
ratelimit:api:[ip] → 100 request per 15 menit
ratelimit:login:[ip] → 5 percobaan per 15 menit
ratelimit:download:[ip] → 10 unduhan per jam
```

### Session Management
```
session:[sessionId] → User session data
TTL: 30 menit (sliding expiration)
```

### View Counter
```
counter:berita:[id]:views → View count berita
counter:dokumen:[id]:downloads → Download count dokumen
```

---

## 🎛️ Dashboard Admin Features

### 1. Dashboard Utama
- Statistik overview (total berita, views, downloads)
- Chart kunjungan (harian, mingguan, bulanan)
- Berita terbaru
- Quick actions
- Activity log

### 2. Page Builder (Pengaturan Halaman Public)

#### Landing Page Builder
- **Hero Section Editor**:
  - Upload gambar/video background
  - Edit judul, subjudul, tagline
  - Edit CTA button (text, link, warna)
  
- **Section Manager**:
  - Drag & drop untuk mengatur urutan section
  - Toggle show/hide section
  - Edit konten tiap section
  
- **Widget System**:
  - Counter widget (angka statistik)
  - Logo slider (partner/sponsor)
  - Testimonial carousel
  - Instagram feed
  - Contact form

#### Halaman Konten Editor
- **WYSIWYG Editor** (TinyMCE atau Tiptap):
  - Rich text formatting
  - Image upload & embedding
  - Table support
  - Code snippet
  - Video embedding (YouTube, dll)
  - Link insertion
  
- **SEO Panel** per halaman:
  - Meta title
  - Meta description
  - Meta keywords
  - OG image
  - Canonical URL
  - Focus keyword analysis

#### Media Manager
- Upload multiple files (drag & drop)
- Image optimization otomatis
- Image cropping/resizing tool
- File browser dengan preview
- Search & filter media
- Bulk delete
- Alt text management

### 3. Content Management

#### Berita Management
- List view dengan filter & search
- Bulk actions (delete, publish, draft)
- Kategori management
- Tag management
- Featured post
- Schedule publish
- Duplicate post
- Preview before publish

#### Program Kerja Management
- CRUD operations
- Assign ke divisi
- Progress tracking
- Status update
- Timeline view

#### Struktur Organisasi Management
- Drag & drop untuk mengatur urutan
- Periode management
- Batch upload (CSV import)
- Organization chart preview

#### Dokumen Management
- Upload file (PDF, DOC, XLS, dll)
- Kategori filter
- Download statistics
- File version control
- Expiry date setting

### 4. Pengaturan Global

#### Informasi Situs
- Nama HIMA
- Logo (upload)
- Favicon
- Tagline
- Deskripsi
- Alamat, email, telepon
- Social media links

#### Appearance Settings
- Color scheme (primary, secondary, accent)
- Font selection
- Layout options
- Header/footer style

#### Menu Builder
- Drag & drop menu items
- Multi-level menu support
- Icon picker
- External/internal links
- Mega menu support

#### SEO Global Settings
- Default meta title template
- Default meta description
- Google Analytics ID
- Google Search Console verification
- Sitemap auto-generation
- Robots.txt editor

#### Performance Settings
- Cache duration settings
- Image optimization level
- Lazy loading toggle
- CDN settings

---

## 🚀 SEO Implementation

### On-Page SEO
1. **Meta Tags**:
   - Dynamic title (per halaman)
   - Meta description
   - Meta keywords
   - Canonical URL
   - OG tags (Facebook, Twitter)
   
2. **Structured Data (Schema.org)**:
   - Organization schema
   - Article schema (untuk berita)
   - BreadcrumbList schema
   - Person schema (struktur organisasi)
   - Event schema (program kerja)

3. **Technical SEO**:
   - XML sitemap auto-generate
   - Robots.txt
   - Clean URL structure (slug-based)
   - 301 redirects management
   - 404 page custom
   - Page speed optimization
   - Mobile-friendly (responsive)
   - HTTPS only

4. **Content SEO**:
   - Heading hierarchy (H1-H6)
   - Image alt text
   - Internal linking suggestions
   - Word count indicator
   - Readability score
   - Focus keyword density

5. **Performance**:
   - Image lazy loading
   - Critical CSS inline
   - Font optimization
   - Minification (CSS, JS)
   - Compression (Gzip/Brotli)
   - Server-side rendering (SSR)
   - Static generation (SSG) untuk halaman statis

---

## 📱 Progressive Web App (PWA) Features

- Manifest.json
- Service worker untuk offline capability
- Install prompt
- Push notifications (opsional)
- App-like experience

---

## 🔔 Additional Features

### 1. Newsletter System
- Subscribe form di footer
- Email collection (simpan di database)
- Bulk email blast dari dashboard
- Template email editor

### 2. Contact Form
- Spam protection (reCAPTCHA atau Turnstile)
- Email notification ke admin
- Form submission log di database

### 3. Search Functionality
- Global search (berita, halaman, dokumen)
- Search suggestions
- Search history
- Search analytics

### 4. Analytics Dashboard
- Page views tracking
- Popular content
- Traffic sources
- User behavior
- Download statistics
- Export reports (CSV, PDF)

### 5. Backup & Restore
- Manual backup database
- Scheduled backup (weekly)
- One-click restore
- Export content (JSON)

---

## 🗂️ Struktur Folder Proyek

```
sveltekit-hima/
├── src/
│   ├── lib/
│   │   ├── server/
│   │   │   ├── database/
│   │   │   │   ├── schema.ts (Drizzle schema)
│   │   │   │   ├── migrations/
│   │   │   │   └── koneksi.ts
│   │   │   ├── redis/
│   │   │   │   ├── client.ts
│   │   │   │   └── cache.ts
│   │   │   ├── auth/
│   │   │   │   ├── session.ts
│   │   │   │   └── middleware.ts
│   │   │   └── utils/
│   │   │       ├── validasi.ts
│   │   │       ├── sanitasi.ts
│   │   │       └── seo.ts
│   │   ├── components/
│   │   │   ├── public/
│   │   │   │   ├── Header.svelte
│   │   │   │   ├── Footer.svelte
│   │   │   │   ├── Navbar.svelte
│   │   │   │   ├── BeritaCard.svelte
│   │   │   │   ├── DivisiCard.svelte
│   │   │   │   └── ...
│   │   │   └── dashboard/
│   │   │       ├── Sidebar.svelte
│   │   │       ├── Navbar.svelte
│   │   │       ├── Editor.svelte
│   │   │       ├── MediaPicker.svelte
│   │   │       └── ...
│   │   ├── stores/
│   │   │   ├── pengaturan.ts
│   │   │   ├── auth.ts
│   │   │   └── toast.ts
│   │   └── types/
│   │       └── index.ts
│   ├── routes/
│   │   ├── +layout.svelte (Public layout)
│   │   ├── +layout.server.ts
│   │   ├── +page.svelte (Landing page)
│   │   ├── +page.server.ts
│   │   ├── tentang/
│   │   ├── visi-misi/
│   │   ├── program-kerja/
│   │   ├── struktur-organisasi/
│   │   ├── divisi/
│   │   │   ├── +page.svelte
│   │   │   └── [slug]/
│   │   │       └── +page.svelte
│   │   ├── berita/
│   │   │   ├── +page.svelte
│   │   │   ├── +page.server.ts
│   │   │   └── [slug]/
│   │   │       ├── +page.svelte
│   │   │       └── +page.server.ts
│   │   ├── dokumen/
│   │   ├── galeri/
│   │   ├── kontak/
│   │   ├── api/
│   │   │   ├── berita/
│   │   │   ├── divisi/
│   │   │   └── ...
│   │   └── dashboard/
│   │       ├── +layout.svelte (Dashboard layout)
│   │       ├── +layout.server.ts (Auth check)
│   │       ├── +page.svelte (Dashboard home)
│   │       ├── masuk/
│   │       ├── pengaturan-situs/
│   │       ├── halaman/
│   │       ├── berita/
│   │       ├── divisi/
│   │       ├── program-kerja/
│   │       ├── struktur-organisasi/
│   │       ├── dokumen/
│   │       ├── galeri/
│   │       ├── media/
│   │       ├── menu/
│   │       ├── seo/
│   │       └── profil/
│   ├── app.html
│   └── app.css
├── static/
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
├── drizzle/
│   └── migrations/
├── .env
├── .env.example
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## 🔧 Environment Variables (.env)

```
# Database (TiDB)
DATABASE_URL=mysql://user:password@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/hima_db

# Redis (Upstash)
REDIS_URL=redis://default:password@apn1-modern-firefly-12345.upstash.io:6379

# Session
SESSION_SECRET=random-secret-key-here

# File Upload
MAX_FILE_SIZE=10485760 (10MB)

# Email (opsional, untuk notifikasi)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Analytics (opsional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Environment
PUBLIC_BASE_URL=https://himainf.my.id
```

---

## 📋 Fitur-fitur Spesifik Dashboard

### Content Editor (WYSIWYG)
- Toolbar lengkap (bold, italic, heading, list, dll)
- Image upload dengan drag & drop
- Table builder
- Code syntax highlighting
- Undo/redo
- Full-screen mode
- Character/word count
- Save draft auto (setiap 30 detik)

### Media Library
- Grid view / List view toggle
- Filter by type (image, document, video)
- Search by filename
- Date filter
- Uploader filter
- Bulk select & delete
- Image preview modal
- Copy URL to clipboard
- Usage tracking (di halaman mana media digunakan)

### SEO Analyzer (per konten)
- Readability score (Flesch reading ease)
- Keyword density checker
- Internal/external links count
- Image alt text checker
- Meta description length indicator
- Title length indicator
- Green/yellow/red indicator untuk SEO health

---

## 🎯 Performance Targets

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### PageSpeed Insights
- Target score: 90+ (mobile & desktop)

### Optimization Strategies
1. Image optimization (WebP, responsive images)
2. Code splitting
3. Lazy loading
4. Critical CSS inline
5. Font optimization (font-display: swap)
6. Minification & compression
7. CDN usage (Vercel Edge Network)
8. Database query optimization
9. Redis caching aggressive
10. SSR untuk SEO, SSG untuk halaman statis

---

## 📊 Analytics & Monitoring

### Built-in Analytics
- Page views (per halaman, per hari)
- Unique visitors
- Popular pages
- Top referrers
- Device breakdown (mobile/desktop)
- Browser statistics
- Download statistics

### External Integration
- Google Analytics 4
- Google Search Console
- Microsoft Clarity (heatmaps & session recording)

### Error Tracking
- Sentry integration (opsional)
- Error log di database
- Email notification untuk critical errors

---

## 🚦 Development Workflow

### Phase 1: Setup & Infrastructure (Week 1)
- Setup SvelteKit project
- Configure TiDB connection
- Setup Redis Upstash
- Database schema design & migration
- Authentication system
- Basic layouts (public & dashboard)

### Phase 2: Dashboard Core (Week 2-3)
- Dashboard UI/UX
- CRUD operations untuk semua entitas
- Media library
- WYSIWYG editor integration
- Pengaturan situs

### Phase 3: Public Pages (Week 3-4)
- Landing page
- Content pages (tentang, visi-misi, dll)
- Berita system (list & detail)
- Divisi pages
- Program kerja pages
- Struktur organisasi
- Dokumen & unduhan
- Galeri

### Phase 4: Advanced Features (Week 5)
- SEO implementation
- Caching strategy
- Search functionality
- Contact form
- Newsletter
- Analytics dashboard

### Phase 5: Testing & Optimization (Week 6)
- Performance optimization
- Security audit
- SEO audit
- Cross-browser testing
- Mobile responsive testing
- Load testing

### Phase 6: Deployment & Launch (Week 7)
- Vercel deployment setup
- Domain configuration
- SSL certificate
- Final testing di production
- Documentation
- Training admin

---

## 📚 Documentation yang Perlu Dibuat

1. **User Guide (Admin)**:
   - Cara login
   - Cara membuat/edit berita
   - Cara mengatur landing page
   - Cara upload media
   - Cara mengatur menu
   - Cara backup/restore

2. **Technical Documentation**:
   - Database schema
   - API endpoints
   - Environment setup
   - Deployment guide
   - Troubleshooting

3. **SEO Guide**:
   - Best practices menulis konten
   - Cara optimasi gambar
   - Cara menggunakan SEO analyzer

---

## 🔐 Security Checklist

- [ ] Password hashing (bcrypt)
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Input validation & sanitization
- [ ] Secure headers (CSP, HSTS, dll)
- [ ] File upload restrictions (type, size)
- [ ] Session security (httpOnly, secure, sameSite)
- [ ] Environment variables tidak di-commit
- [ ] Database credentials encrypted
- [ ] Regular security updates
- [ ] Backup strategy

---

## ✅ Pre-Launch Checklist

- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] All forms working & validated
- [ ] All images optimized
- [ ] SEO meta tags semua halaman
- [ ] Sitemap generated & submitted
- [ ] Google Analytics tracking
- [ ] Contact form tested
- [ ] Error pages (404, 500) designed
- [ ] Loading states implemented
- [ ] Toast notifications working
- [ ] Cache invalidation tested
- [ ] Performance score 90+
- [ ] Security audit passed
- [ ] Browser compatibility tested
- [ ] Admin training completed
- [ ] Documentation completed
- [ ] Backup system setup
- [ ] Monitoring tools configured

---

## 🎉 Kesimpulan

Rancangan ini memberikan blueprint lengkap untuk website HIMA Informatika yang **modern, professional, SEO-friendly, dan fully manageable** melalui dashboard admin tanpa perlu menyentuh kode setelah deployment. 

**Key Highlights**:
✅ Fully dynamic content management (seperti WordPress)
✅ Modern tech stack (SvelteKit + TypeScript)
✅ Scalable architecture (TiDB + Redis + Vercel)
✅ SEO optimized (100% best practices)
✅ Performance optimized (caching, lazy loading)
✅ Secure (authentication, rate limiting, input validation)
✅ Mobile-first responsive design
✅ Admin-friendly dashboard
✅ Bahasa Indonesia + best practice English naming

Apakah ada bagian spesifik yang ingin saya perjelas atau tambahkan detail lebih lanjut?