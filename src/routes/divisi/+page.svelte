<script lang="ts">
	import { Building2 } from 'lucide-svelte';
	import { Header, Footer } from '$lib/components/public';

	interface Props {
		data: {
			divisi: Array<{ id: number; nama: string; slug: string; deskripsi: string | null; ikon: string | null; gambarBanner: string | null }>;
			pengaturan: Record<string, string>;
		};
	}

	let { data }: Props = $props();
	const pengaturan = $derived(data.pengaturan);
</script>

<svelte:head>
	<title>Divisi - HIMA Informatika</title>
	<meta name="description" content="Divisi-divisi yang ada di HIMA Informatika" />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-slate-50">
	<div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
		<div class="container mx-auto px-6 text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Divisi Kami</h1>
			<p class="text-xl text-purple-100 max-w-2xl mx-auto">Berbagai divisi yang siap mewadahi minat dan bakat mahasiswa</p>
		</div>
	</div>

	<div class="container mx-auto px-6 py-16">
		{#if data.divisi.length === 0}
			<div class="text-center py-20">
				<Building2 class="w-16 h-16 text-slate-300 mx-auto mb-4" />
				<h3 class="text-xl font-medium text-slate-600">Belum ada divisi</h3>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each data.divisi as item}
					<a href="/divisi/{item.slug}" class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100">
						<div class="h-48 bg-gradient-to-br from-purple-500 to-blue-600 overflow-hidden">
							{#if item.gambarBanner}
								<img src={item.gambarBanner} alt={item.nama} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
							{:else}
								<div class="w-full h-full flex items-center justify-center">
									<Building2 class="w-16 h-16 text-white/50" />
								</div>
							{/if}
						</div>
						<div class="p-6">
							<h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">{item.nama}</h3>
							<p class="text-slate-600 line-clamp-3">{item.deskripsi || 'Divisi yang aktif dalam kegiatan organisasi'}</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Footer {pengaturan} />
