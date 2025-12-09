<script lang="ts">
	import { Users, Instagram, Linkedin } from 'lucide-svelte';
	import { Header, Footer } from '$lib/components/public';

	interface Props {
		data: {
			pengurus: Array<{ id: number; nama: string; jabatan: string; foto: string | null; divisiNama: string | null; instagram: string | null; linkedin: string | null }>;
			pengaturan: Record<string, string>;
		};
	}

	let { data }: Props = $props();
	const pengaturan = $derived(data.pengaturan);

	const pengurusInti = $derived(data.pengurus.filter(p => !p.divisiNama));
	const perDivisi = $derived.by(() => {
		const grouped: Record<string, typeof data.pengurus> = {};
		data.pengurus.filter(p => p.divisiNama).forEach(p => {
			if (!grouped[p.divisiNama!]) grouped[p.divisiNama!] = [];
			grouped[p.divisiNama!].push(p);
		});
		return grouped;
	});
</script>

<svelte:head>
	<title>Struktur Organisasi - HIMA Informatika</title>
	<meta name="description" content="Struktur Organisasi HIMA Informatika" />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-slate-50">
	<div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
		<div class="container mx-auto px-6 text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Struktur Organisasi</h1>
			<p class="text-xl text-blue-100 max-w-2xl mx-auto">Pengurus dan Anggota HIMA Informatika</p>
		</div>
	</div>

	<div class="container mx-auto px-6 py-16">
		{#if pengurusInti.length > 0}
			<div class="mb-16">
				<h2 class="text-2xl font-bold text-slate-900 mb-8 text-center">Pengurus Inti</h2>
				<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
					{#each pengurusInti as p}
						<div class="bg-white rounded-2xl p-6 shadow-sm text-center">
							{#if p.foto}
								<img src={p.foto} alt={p.nama} class="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
							{:else}
								<div class="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
									<Users class="w-10 h-10 text-white" />
								</div>
							{/if}
							<h3 class="font-semibold text-slate-900">{p.nama}</h3>
							<p class="text-blue-600 text-sm mb-2">{p.jabatan}</p>
							<div class="flex justify-center gap-2">
								{#if p.instagram}<a href="https://instagram.com/{p.instagram}" target="_blank" class="p-1 rounded-full bg-slate-100 hover:bg-pink-100 text-slate-500 hover:text-pink-600"><Instagram class="w-4 h-4" /></a>{/if}
								{#if p.linkedin}<a href={p.linkedin} target="_blank" class="p-1 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600"><Linkedin class="w-4 h-4" /></a>{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#each Object.entries(perDivisi) as [divisiNama, members]}
			<div class="mb-12">
				<h2 class="text-xl font-bold text-slate-900 mb-6">{divisiNama}</h2>
				<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{#each members as p}
						<div class="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
							{#if p.foto}
								<img src={p.foto} alt={p.nama} class="w-12 h-12 rounded-full object-cover" />
							{:else}
								<div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
									<Users class="w-5 h-5 text-slate-400" />
								</div>
							{/if}
							<div>
								<h4 class="font-medium text-slate-900 text-sm">{p.nama}</h4>
								<p class="text-slate-500 text-xs">{p.jabatan}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<Footer {pengaturan} />
