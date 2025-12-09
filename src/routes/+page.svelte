<script lang="ts">
	import { ChevronRight, Newspaper, Users, FolderKanban, Building2, FileText, Image, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-svelte';
	import { Header } from '$lib/components/public';

	interface Props {
		data: {
			pengaturan: Record<string, string>;
			beritaTerbaru: Array<{ id: number; judul: string; slug: string; ringkasan: string | null; gambarUtama: string | null; dibuatPada: string }>;
			divisiList: Array<{ id: number; nama: string; slug: string; deskripsi: string | null; ikon: string | null }>;
		};
	}

	let { data }: Props = $props();
	const { pengaturan, beritaTerbaru, divisiList } = data;
</script>

<svelte:head>
	<title>{pengaturan.nama_situs || 'HIMA Informatika'}</title>
	<meta name="description" content={pengaturan.tagline || 'Himpunan Mahasiswa Informatika'} />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<!-- Hero Section -->
<section class="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
	<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
	<div class="absolute top-20 -left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
	<div class="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
	
	<div class="relative container mx-auto px-6 pt-32 pb-20 flex flex-col items-center justify-center min-h-screen text-center">
		{#if pengaturan.logo_url}
			<img src={pengaturan.logo_url} alt="Logo" class="h-24 w-24 mb-8 animate-pulse" />
		{/if}
		<h1 class="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
			{pengaturan.nama_situs || 'HIMA Informatika'}
		</h1>
		<p class="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl">
			{pengaturan.tagline || 'Bersama Menuju Kesuksesan'}
		</p>
		<div class="flex flex-wrap gap-4 justify-center">
			<a href="/tentang" class="px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-blue-50 transition-all hover:scale-105 shadow-lg">
				Tentang Kami
			</a>
			<a href="/berita" class="px-8 py-4 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
				Berita Terbaru
			</a>
		</div>
	</div>
	<div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
		<ChevronRight class="w-8 h-8 rotate-90 text-white/50" />
	</div>
</section>

<!-- Stats Section -->
<section class="py-16 bg-white">
	<div class="container mx-auto px-6">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			<div class="text-center">
				<div class="text-4xl md:text-5xl font-bold text-blue-600">6+</div>
				<div class="text-slate-600 mt-2">Divisi Aktif</div>
			</div>
			<div class="text-center">
				<div class="text-4xl md:text-5xl font-bold text-purple-600">50+</div>
				<div class="text-slate-600 mt-2">Program Kerja</div>
			</div>
			<div class="text-center">
				<div class="text-4xl md:text-5xl font-bold text-green-600">100+</div>
				<div class="text-slate-600 mt-2">Anggota Aktif</div>
			</div>
			<div class="text-center">
				<div class="text-4xl md:text-5xl font-bold text-orange-600">20+</div>
				<div class="text-slate-600 mt-2">Prestasi</div>
			</div>
		</div>
	</div>
</section>

<!-- Divisi Section -->
<section class="py-20 bg-slate-50">
	<div class="container mx-auto px-6">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Divisi Kami</h2>
			<p class="text-slate-600 max-w-2xl mx-auto">Beragam divisi yang siap mewadahi minat dan bakat mahasiswa informatika</p>
		</div>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each divisiList.slice(0, 6) as div}
				<a href="/divisi/{div.slug}" class="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100">
					<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
						<Building2 class="w-7 h-7 text-white" />
					</div>
					<h3 class="text-xl font-semibold text-slate-900 mb-2">{div.nama}</h3>
					<p class="text-slate-600 text-sm line-clamp-2">{div.deskripsi || 'Divisi yang aktif dalam kegiatan organisasi'}</p>
					<div class="mt-4 flex items-center text-blue-600 text-sm font-medium">
						Selengkapnya <ArrowRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
					</div>
				</a>
			{/each}
		</div>
		<div class="text-center mt-10">
			<a href="/divisi" class="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors font-medium">
				Lihat Semua Divisi <ArrowRight class="w-4 h-4" />
			</a>
		</div>
	</div>
</section>

<!-- Berita Section -->
<section class="py-20 bg-white">
	<div class="container mx-auto px-6">
		<div class="text-center mb-12">
			<h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Berita Terbaru</h2>
			<p class="text-slate-600 max-w-2xl mx-auto">Update terkini dari kegiatan dan informasi HIMA Informatika</p>
		</div>
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each beritaTerbaru as item}
				<a href="/berita/{item.slug}" class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
					<div class="aspect-video bg-slate-100 overflow-hidden">
						{#if item.gambarUtama}
							<img src={item.gambarUtama} alt={item.judul} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
						{:else}
							<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
								<Newspaper class="w-12 h-12 text-blue-300" />
							</div>
						{/if}
					</div>
					<div class="p-6">
						<p class="text-sm text-blue-600 mb-2">{item.dibuatPada}</p>
						<h3 class="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.judul}</h3>
						<p class="text-slate-600 text-sm line-clamp-2">{item.ringkasan || 'Baca selengkapnya...'}</p>
					</div>
				</a>
			{/each}
		</div>
		<div class="text-center mt-10">
			<a href="/berita" class="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors font-medium">
				Lihat Semua Berita <ArrowRight class="w-4 h-4" />
			</a>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
	<div class="container mx-auto px-6 text-center">
		<h2 class="text-3xl md:text-4xl font-bold mb-6">Bergabunglah Bersama Kami</h2>
		<p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
			Jadilah bagian dari keluarga besar HIMA Informatika dan wujudkan potensimu bersama kami
		</p>
		<a href="/kontak" class="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all hover:scale-105 shadow-lg">
			Hubungi Kami <ArrowRight class="w-5 h-5" />
		</a>
	</div>
</section>

<!-- Footer -->
<footer class="bg-slate-900 text-slate-300 py-16">
	<div class="container mx-auto px-6">
		<div class="grid md:grid-cols-4 gap-10">
			<div class="md:col-span-2">
				<div class="flex items-center gap-3 mb-4">
					{#if pengaturan.logo_url}
						<img src={pengaturan.logo_url} alt="Logo" class="h-10 w-10" />
					{/if}
					<span class="text-xl font-bold text-white">{pengaturan.nama_situs || 'HIMA Informatika'}</span>
				</div>
				<p class="text-slate-400 mb-6 max-w-md">{pengaturan.tagline || 'Himpunan Mahasiswa Informatika - Bersama Menuju Kesuksesan'}</p>
				<div class="flex gap-4">
					{#if pengaturan.facebook}<a href={pengaturan.facebook} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"><Facebook class="w-5 h-5" /></a>{/if}
					{#if pengaturan.instagram}<a href={pengaturan.instagram} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors"><Instagram class="w-5 h-5" /></a>{/if}
					{#if pengaturan.twitter}<a href={pengaturan.twitter} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-600 transition-colors"><Twitter class="w-5 h-5" /></a>{/if}
					{#if pengaturan.youtube}<a href={pengaturan.youtube} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"><Youtube class="w-5 h-5" /></a>{/if}
				</div>
			</div>
			<div>
				<h4 class="text-white font-semibold mb-4">Menu</h4>
				<ul class="space-y-2">
					<li><a href="/tentang" class="hover:text-white transition-colors">Tentang</a></li>
					<li><a href="/berita" class="hover:text-white transition-colors">Berita</a></li>
					<li><a href="/divisi" class="hover:text-white transition-colors">Divisi</a></li>
					<li><a href="/program-kerja" class="hover:text-white transition-colors">Program Kerja</a></li>
					<li><a href="/galeri" class="hover:text-white transition-colors">Galeri</a></li>
				</ul>
			</div>
			<div>
				<h4 class="text-white font-semibold mb-4">Kontak</h4>
				<ul class="space-y-3">
					{#if pengaturan.email}<li class="flex items-center gap-2"><Mail class="w-4 h-4" />{pengaturan.email}</li>{/if}
					{#if pengaturan.telepon}<li class="flex items-center gap-2"><Phone class="w-4 h-4" />{pengaturan.telepon}</li>{/if}
					{#if pengaturan.alamat}<li class="flex items-start gap-2"><MapPin class="w-4 h-4 mt-1 flex-shrink-0" /><span class="text-sm">{pengaturan.alamat}</span></li>{/if}
				</ul>
			</div>
		</div>
		<div class="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
			<p>&copy; {new Date().getFullYear()} {pengaturan.nama_situs || 'HIMA Informatika'}. All rights reserved.</p>
		</div>
	</div>
</footer>
