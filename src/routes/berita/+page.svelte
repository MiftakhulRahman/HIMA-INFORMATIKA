<script lang="ts">
	import { Newspaper, ChevronLeft, ChevronRight, Search } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { Header, Footer } from '$lib/components/public';

	interface Props {
		data: {
			berita: Array<{ id: number; judul: string; slug: string; ringkasan: string | null; gambarUtama: string | null; kategori: string | null; dibuatPada: string }>;
			pagination: { currentPage: number; totalPages: number; totalItems: number };
			filters: { search: string; kategori: string };
			categories: string[];
			pengaturan: Record<string, string>;
		};
	}

	let { data }: Props = $props();
	let searchQuery = $state(data.filters.search);
	const pengaturan = $derived(data.pengaturan);

	function handleSearch(e: Event) {
		e.preventDefault();
		const params = new URLSearchParams();
		if (searchQuery) params.set('search', searchQuery);
		goto(`/berita?${params.toString()}`);
	}

	function handleCategoryFilter(cat: string) {
		const params = new URLSearchParams(window.location.search);
		if (cat) params.set('kategori', cat);
		else params.delete('kategori');
		params.set('page', '1');
		goto(`/berita?${params.toString()}`);
	}
</script>

<svelte:head>
	<title>Berita - HIMA Informatika</title>
	<meta name="description" content="Berita dan informasi terbaru dari HIMA Informatika" />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-slate-50">
	<!-- Page Header -->
	<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
		<div class="container mx-auto px-6 text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Berita & Informasi</h1>
			<p class="text-xl text-blue-100 max-w-2xl mx-auto">Update terkini dari kegiatan dan informasi HIMA Informatika</p>
		</div>
	</div>

	<div class="container mx-auto px-6 py-12">
		<!-- Search & Filter -->
		<div class="flex flex-col md:flex-row gap-4 mb-8">
			<form onsubmit={handleSearch} class="flex-1">
				<div class="relative">
					<Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
					<input type="text" bind:value={searchQuery} placeholder="Cari berita..." class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none" />
				</div>
			</form>
			<div class="flex gap-2 flex-wrap">
				<button onclick={() => handleCategoryFilter('')} class="px-4 py-2 rounded-full text-sm font-medium transition-colors {!data.filters.kategori ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}">Semua</button>
				{#each data.categories as cat}
					<button onclick={() => handleCategoryFilter(cat)} class="px-4 py-2 rounded-full text-sm font-medium transition-colors {data.filters.kategori === cat ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}">{cat}</button>
				{/each}
			</div>
		</div>

		<!-- Berita Grid -->
		{#if data.berita.length === 0}
			<div class="text-center py-20">
				<Newspaper class="w-16 h-16 text-slate-300 mx-auto mb-4" />
				<h3 class="text-xl font-medium text-slate-600">Belum ada berita</h3>
				<p class="text-slate-500">Tunggu update berita terbaru dari kami</p>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each data.berita as item}
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
							<div class="flex items-center gap-3 mb-3">
								<span class="text-sm text-blue-600">{item.dibuatPada}</span>
								{#if item.kategori}<span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">{item.kategori}</span>{/if}
							</div>
							<h3 class="text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{item.judul}</h3>
							<p class="text-slate-600 text-sm line-clamp-2">{item.ringkasan || 'Baca selengkapnya...'}</p>
						</div>
					</a>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.pagination.totalPages > 1}
				<div class="flex justify-center items-center gap-2 mt-12">
					<a href="/berita?page={Math.max(1, data.pagination.currentPage - 1)}" class="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50">
						<ChevronLeft class="w-5 h-5" />
					</a>
						{#each Array(data.pagination.totalPages) as _, i}
						<a href="/berita?page={i + 1}" class="px-4 py-2 rounded-lg font-medium {data.pagination.currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}">{i + 1}</a>
					{/each}
					<a href="/berita?page={Math.min(data.pagination.totalPages, data.pagination.currentPage + 1)}" class="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50">
						<ChevronRight class="w-5 h-5" />
					</a>
				</div>
			{/if}
		{/if}
	</div>
</div>

<Footer {pengaturan} />
