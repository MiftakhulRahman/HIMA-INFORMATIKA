<script lang="ts">
	import { Image as ImageIcon, X } from 'lucide-svelte';
	import { Header, Footer } from '$lib/components/public';

	interface Props {
		data: {
			galeri: Array<{ id: number; judul: string | null; gambarUrl: string; kategori: string | null }>;
			categories: string[];
			pengaturan: Record<string, string>;
		};
	}

	let { data }: Props = $props();
	const pengaturan = $derived(data.pengaturan);
	let lightboxOpen = $state(false);
	let lightboxImage = $state('');
	let lightboxTitle = $state('');

	function openLightbox(url: string, title: string | null) {
		lightboxImage = url;
		lightboxTitle = title || '';
		lightboxOpen = true;
	}
</script>

<svelte:head>
	<title>Galeri - HIMA Informatika</title>
	<meta name="description" content="Galeri foto kegiatan HIMA Informatika" />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-slate-50">
	<div class="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20">
		<div class="container mx-auto px-6 text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Galeri</h1>
			<p class="text-xl text-pink-100 max-w-2xl mx-auto">Dokumentasi kegiatan HIMA Informatika</p>
		</div>
	</div>

	<div class="container mx-auto px-6 py-12">
		{#if data.galeri.length === 0}
			<div class="text-center py-20">
				<ImageIcon class="w-16 h-16 text-slate-300 mx-auto mb-4" />
				<h3 class="text-xl font-medium text-slate-600">Belum ada foto</h3>
			</div>
		{:else}
			<div class="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
				{#each data.galeri as item}
					<button onclick={() => openLightbox(item.gambarUrl, item.judul)} class="break-inside-avoid block w-full rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all">
						<img src={item.gambarUrl} alt={item.judul || 'Foto'} class="w-full" loading="lazy" />
						{#if item.judul}
							<div class="p-3 text-left">
								<p class="text-sm font-medium text-slate-700 line-clamp-1">{item.judul}</p>
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Footer {pengaturan} />

{#if lightboxOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4" onclick={() => lightboxOpen = false}>
		<button onclick={() => lightboxOpen = false} class="absolute right-4 top-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"><X class="w-6 h-6" /></button>
		<img src={lightboxImage} alt={lightboxTitle} class="max-h-[85vh] max-w-full object-contain" />
		{#if lightboxTitle}<p class="mt-4 text-white text-center">{lightboxTitle}</p>{/if}
	</div>
{/if}
