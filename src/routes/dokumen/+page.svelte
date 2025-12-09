<script lang="ts">
	import { FileText, Download } from 'lucide-svelte';
	import { Header, Footer } from '$lib/components/public';

	interface Props {
		data: {
			dokumen: Array<{ id: number; judul: string; slug: string; deskripsi: string | null; kategori: string; fileUrl: string; fileNama: string | null; jumlahUnduhan: number | null }>;
			pengaturan: Record<string, string>;
		};
	}

	let { data }: Props = $props();
	const pengaturan = $derived(data.pengaturan);

	const groupedByKategori = $derived.by(() => {
		const grouped: Record<string, typeof data.dokumen> = {};
		data.dokumen.forEach(d => {
			if (!grouped[d.kategori]) grouped[d.kategori] = [];
			grouped[d.kategori].push(d);
		});
		return grouped;
	});
</script>

<svelte:head>
	<title>Dokumen - HIMA Informatika</title>
	<meta name="description" content="Dokumen resmi HIMA Informatika" />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-slate-50">
	<div class="bg-gradient-to-r from-orange-600 to-red-500 text-white py-20">
		<div class="container mx-auto px-6 text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Dokumen</h1>
			<p class="text-xl text-orange-100 max-w-2xl mx-auto">Dokumen resmi dan unduhan HIMA Informatika</p>
		</div>
	</div>

	<div class="container mx-auto px-6 py-12">
		{#if data.dokumen.length === 0}
			<div class="text-center py-20">
				<FileText class="w-16 h-16 text-slate-300 mx-auto mb-4" />
				<h3 class="text-xl font-medium text-slate-600">Belum ada dokumen</h3>
			</div>
		{:else}
			{#each Object.entries(groupedByKategori) as [kategori, docs]}
				<div class="mb-10">
					<h2 class="text-2xl font-bold text-slate-900 mb-6">{kategori}</h2>
					<div class="grid md:grid-cols-2 gap-4">
						{#each docs as doc}
							<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
								<div class="flex items-start gap-4">
									<div class="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
										<FileText class="w-6 h-6 text-orange-600" />
									</div>
									<div class="flex-1 min-w-0">
										<h3 class="font-semibold text-slate-900 mb-1">{doc.judul}</h3>
										{#if doc.deskripsi}
											<p class="text-slate-600 text-sm mb-3 line-clamp-2">{doc.deskripsi}</p>
										{/if}
										<div class="flex items-center gap-4">
											<a href={doc.fileUrl} download class="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-sm font-medium">
												<Download class="w-4 h-4" /> Unduh
											</a>
											{#if doc.jumlahUnduhan}
												<span class="text-xs text-slate-400">{doc.jumlahUnduhan} unduhan</span>
											{/if}
										</div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<Footer {pengaturan} />
