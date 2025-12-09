<script lang="ts">
	import { Calendar, Eye, Tag, ArrowLeft, Share2, Facebook, Twitter } from 'lucide-svelte';

	interface Props {
		data: {
			berita: {
				id: number;
				judul: string;
				slug: string;
				ringkasan: string | null;
				konten: string | null;
				gambarUtama: string | null;
				kategori: string | null;
				tags: string[] | null;
				dilihatCount: number;
				dibuatPada: string;
			};
			related: Array<{ id: number; judul: string; slug: string; gambarUtama: string | null }>;
		};
	}

	let { data }: Props = $props();
	const { berita, related } = data;
</script>

<svelte:head>
	<title>{berita.judul} - HIMA Informatika</title>
	<meta name="description" content={berita.ringkasan || berita.judul} />
	<meta property="og:title" content={berita.judul} />
	<meta property="og:description" content={berita.ringkasan || ''} />
	{#if berita.gambarUtama}<meta property="og:image" content={berita.gambarUtama} />{/if}
</svelte:head>

<article class="min-h-screen bg-white">
	<!-- Hero -->
	{#if berita.gambarUtama}
		<div class="aspect-[21/9] max-h-[500px] overflow-hidden">
			<img src={berita.gambarUtama} alt={berita.judul} class="w-full h-full object-cover" />
		</div>
	{:else}
		<div class="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>
	{/if}

	<div class="container mx-auto px-6 -mt-16 relative z-10">
		<div class="max-w-4xl mx-auto">
			<div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
				<!-- Back -->
				<a href="/berita" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
					<ArrowLeft class="w-4 h-4" /> Kembali ke Berita
				</a>

				<!-- Category & Date -->
				<div class="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
					{#if berita.kategori}
						<span class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">{berita.kategori}</span>
					{/if}
					<span class="flex items-center gap-1"><Calendar class="w-4 h-4" />{berita.dibuatPada}</span>
					<span class="flex items-center gap-1"><Eye class="w-4 h-4" />{berita.dilihatCount} views</span>
				</div>

				<!-- Title -->
				<h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">{berita.judul}</h1>

				<!-- Ringkasan -->
				{#if berita.ringkasan}
					<p class="text-xl text-slate-600 mb-8 leading-relaxed border-l-4 border-blue-500 pl-4 italic">{berita.ringkasan}</p>
				{/if}

				<!-- Content -->
				<div class="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-blue-600">
					{@html berita.konten || ''}
				</div>

				<!-- Tags -->
				{#if berita.tags && berita.tags.length > 0}
					<div class="flex flex-wrap items-center gap-2 mt-8 pt-8 border-t border-slate-200">
						<Tag class="w-4 h-4 text-slate-400" />
						{#each berita.tags as tag}
							<span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">{tag}</span>
						{/each}
					</div>
				{/if}

				<!-- Share -->
				<div class="flex items-center gap-4 mt-8 pt-8 border-t border-slate-200">
					<span class="text-slate-500 flex items-center gap-2"><Share2 class="w-4 h-4" />Bagikan:</span>
					<a href="https://facebook.com/sharer/sharer.php?u={encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}" target="_blank" class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"><Facebook class="w-5 h-5" /></a>
					<a href="https://twitter.com/intent/tweet?text={encodeURIComponent(berita.judul)}" target="_blank" class="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-900"><Twitter class="w-5 h-5" /></a>
				</div>
			</div>

			<!-- Related -->
			{#if related.length > 0}
				<div class="mt-12 mb-20">
					<h2 class="text-2xl font-bold text-slate-900 mb-6">Berita Terkait</h2>
					<div class="grid md:grid-cols-3 gap-6">
						{#each related as item}
							<a href="/berita/{item.slug}" class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100">
								<div class="aspect-video bg-slate-100">
									{#if item.gambarUtama}
										<img src={item.gambarUtama} alt={item.judul} class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
									{/if}
								</div>
								<div class="p-4">
									<h3 class="font-medium text-slate-900 line-clamp-2 group-hover:text-blue-600">{item.judul}</h3>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</article>
