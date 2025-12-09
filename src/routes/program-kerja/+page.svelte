<script lang="ts">
	import { FolderKanban, CheckCircle2, Clock, Calendar } from 'lucide-svelte';
	import { Header, Footer } from '$lib/components/public';

	interface Props {
		data: {
			programKerja: Array<{
				id: number;
				judul: string;
				deskripsi: string | null;
				divisiNama: string | null;
				tahun: number | null;
				periode: string | null;
				status: 'rencana' | 'berjalan' | 'selesai';
			}>;
			divisiList: Array<{ id: number; nama: string }>;
			pengaturan: Record<string, string>;
		};
	}

	let { data }: Props = $props();
	const pengaturan = $derived(data.pengaturan);
	let filterDivisi = $state('');
	let filterStatus = $state('');

	const filteredProker = $derived(
		data.programKerja.filter((p) => {
			if (filterDivisi && p.divisiNama !== filterDivisi) return false;
			if (filterStatus && p.status !== filterStatus) return false;
			return true;
		})
	);

	const statusConfig = {
		rencana: { label: 'Rencana', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
		berjalan: { label: 'Berjalan', color: 'bg-blue-100 text-blue-700', icon: Calendar },
		selesai: { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle2 }
	};
</script>

<svelte:head>
	<title>Program Kerja - HIMA Informatika</title>
	<meta name="description" content="Program kerja HIMA Informatika" />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-slate-50">
	<div class="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
		<div class="container mx-auto px-6 text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Program Kerja</h1>
			<p class="text-xl text-green-100 max-w-2xl mx-auto">Berbagai program dan kegiatan HIMA Informatika</p>
		</div>
	</div>

	<div class="container mx-auto px-6 py-12">
		<div class="flex flex-wrap gap-4 mb-8">
			<select bind:value={filterDivisi} class="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none">
				<option value="">Semua Divisi</option>
				{#each data.divisiList as d}
					<option value={d.nama}>{d.nama}</option>
				{/each}
			</select>
			<select bind:value={filterStatus} class="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:outline-none">
				<option value="">Semua Status</option>
				<option value="rencana">Rencana</option>
				<option value="berjalan">Berjalan</option>
				<option value="selesai">Selesai</option>
			</select>
		</div>

		{#if filteredProker.length === 0}
			<div class="text-center py-20">
				<FolderKanban class="w-16 h-16 text-slate-300 mx-auto mb-4" />
				<h3 class="text-xl font-medium text-slate-600">Belum ada program kerja</h3>
			</div>
		{:else}
			<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredProker as proker}
					{@const config = statusConfig[proker.status]}
					<div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100">
						<div class="flex items-start justify-between mb-4">
							<div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
								<FolderKanban class="w-6 h-6 text-white" />
							</div>
							<span class="px-3 py-1 rounded-full text-xs font-medium {config.color}">{config.label}</span>
						</div>
						<h3 class="text-lg font-semibold text-slate-900 mb-2">{proker.judul}</h3>
						{#if proker.deskripsi}
							<p class="text-slate-600 text-sm mb-4 line-clamp-2">{proker.deskripsi}</p>
						{/if}
						<div class="flex flex-wrap gap-2 text-xs text-slate-500">
							{#if proker.divisiNama}<span class="px-2 py-1 bg-slate-100 rounded">{proker.divisiNama}</span>{/if}
							{#if proker.tahun}<span class="px-2 py-1 bg-slate-100 rounded">{proker.tahun}</span>{/if}
							{#if proker.periode}<span class="px-2 py-1 bg-slate-100 rounded">{proker.periode}</span>{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Footer {pengaturan} />
