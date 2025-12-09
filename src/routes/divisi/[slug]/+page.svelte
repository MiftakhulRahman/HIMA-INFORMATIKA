<script lang="ts">
	import { ArrowLeft, Users, FolderKanban } from 'lucide-svelte';

	interface Props {
		data: {
			divisi: { id: number; nama: string; slug: string; deskripsi: string | null; gambarBanner: string | null };
			anggota: Array<{ id: number; nama: string; jabatan: string; foto: string | null }>;
			programKerja: Array<{ id: number; judul: string; status: string }>;
		};
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{data.divisi.nama} - HIMA Informatika</title>
	<meta name="description" content={data.divisi.deskripsi || data.divisi.nama} />
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Hero -->
	<div class="h-64 md:h-80 bg-gradient-to-r from-purple-600 to-blue-600 relative overflow-hidden">
		{#if data.divisi.gambarBanner}
			<img src={data.divisi.gambarBanner} alt={data.divisi.nama} class="w-full h-full object-cover opacity-50" />
			<div class="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80"></div>
		{/if}
		<div class="absolute inset-0 flex items-center">
			<div class="container mx-auto px-6">
				<a href="/divisi" class="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
					<ArrowLeft class="w-4 h-4" /> Semua Divisi
				</a>
				<h1 class="text-4xl md:text-5xl font-bold text-white">{data.divisi.nama}</h1>
			</div>
		</div>
	</div>

	<div class="container mx-auto px-6 py-12">
		<!-- Description -->
		{#if data.divisi.deskripsi}
			<div class="max-w-3xl mb-16">
				<h2 class="text-2xl font-bold text-slate-900 mb-4">Tentang Divisi</h2>
				<p class="text-lg text-slate-600 leading-relaxed">{data.divisi.deskripsi}</p>
			</div>
		{/if}

		<!-- Team -->
		{#if data.anggota.length > 0}
			<div class="mb-16">
				<h2 class="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
					<Users class="w-6 h-6 text-purple-600" /> Tim Kami
				</h2>
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{#each data.anggota as member}
						<div class="text-center group">
							<div class="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
								{#if member.foto}
									<img src={member.foto} alt={member.nama} class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
								{:else}
									<div class="w-full h-full flex items-center justify-center text-3xl font-bold text-purple-300">{member.nama.charAt(0)}</div>
								{/if}
							</div>
							<h3 class="font-semibold text-slate-900">{member.nama}</h3>
							<p class="text-sm text-slate-500">{member.jabatan}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Program Kerja -->
		{#if data.programKerja.length > 0}
			<div>
				<h2 class="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
					<FolderKanban class="w-6 h-6 text-green-600" /> Program Kerja
				</h2>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each data.programKerja as proker}
						<div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
							<h3 class="font-medium text-slate-900">{proker.judul}</h3>
							<span class="inline-block mt-2 px-2 py-1 text-xs rounded-full {proker.status === 'selesai' ? 'bg-green-100 text-green-600' : proker.status === 'berjalan' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}">
								{proker.status.charAt(0).toUpperCase() + proker.status.slice(1)}
							</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
