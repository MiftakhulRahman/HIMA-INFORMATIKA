<script lang="ts">
	import { Breadcrumb, StatCard, Button } from '$lib/components/dashboard';
	import { Newspaper, Users, FolderKanban, FileText, Eye, Download, TrendingUp, Plus } from 'lucide-svelte';

	interface Props {
		data: {
			user: {
				namaLengkap: string;
			};
			stats: {
				totalBerita: number;
				totalDivisi: number;
				totalProgramKerja: number;
				totalDokumen: number;
				totalViews: number;
				totalDownloads: number;
			};
			recentBerita: Array<{
				id: number;
				judul: string;
				status: string;
				dibuatPada: string;
			}>;
		};
	}

	let { data }: Props = $props();

	// Get greeting based on time
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Selamat Pagi';
		if (hour < 15) return 'Selamat Siang';
		if (hour < 18) return 'Selamat Sore';
		return 'Selamat Malam';
	};
</script>

<svelte:head>
	<title>Dashboard - HIMA Informatika</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold text-slate-900">
				{getGreeting()}, {data.user.namaLengkap.split(' ')[0]}! 👋
			</h1>
			<p class="mt-1 text-slate-500">Berikut ringkasan aktivitas website HIMA Informatika</p>
		</div>
		<Button href="/dashboard/berita/buat">
			{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}
			Buat Berita
		</Button>
	</div>

	<!-- Stats Grid -->
	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
		<StatCard
			title="Total Berita"
			value={data.stats.totalBerita}
			trend="up"
			trendValue="12%"
			color="blue"
		>
			{#snippet icon()}<Newspaper class="h-6 w-6" />{/snippet}
		</StatCard>

		<StatCard
			title="Total Divisi"
			value={data.stats.totalDivisi}
			color="purple"
		>
			{#snippet icon()}<Users class="h-6 w-6" />{/snippet}
		</StatCard>

		<StatCard
			title="Program Kerja"
			value={data.stats.totalProgramKerja}
			color="green"
		>
			{#snippet icon()}<FolderKanban class="h-6 w-6" />{/snippet}
		</StatCard>

		<StatCard
			title="Total Dokumen"
			value={data.stats.totalDokumen}
			color="orange"
		>
			{#snippet icon()}<FileText class="h-6 w-6" />{/snippet}
		</StatCard>

		<StatCard
			title="Total Views"
			value={data.stats.totalViews.toLocaleString()}
			trend="up"
			trendValue="8%"
			color="blue"
		>
			{#snippet icon()}<Eye class="h-6 w-6" />{/snippet}
		</StatCard>

		<StatCard
			title="Downloads"
			value={data.stats.totalDownloads.toLocaleString()}
			color="green"
		>
			{#snippet icon()}<Download class="h-6 w-6" />{/snippet}
		</StatCard>
	</div>

	<!-- Content Grid -->
	<div class="grid gap-6 lg:grid-cols-2">
		<!-- Recent Berita -->
		<div class="rounded-xl border border-slate-200 bg-white">
			<div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<h2 class="font-semibold text-slate-900">Berita Terbaru</h2>
				<a href="/dashboard/berita" class="text-sm font-medium text-blue-600 hover:text-blue-700">
					Lihat Semua
				</a>
			</div>
			<div class="divide-y divide-slate-100">
				{#each data.recentBerita as item}
					<div class="flex items-center justify-between px-6 py-4">
						<div class="min-w-0 flex-1">
							<p class="truncate font-medium text-slate-900">{item.judul}</p>
							<p class="text-sm text-slate-500">{item.dibuatPada}</p>
						</div>
						<span
							class="ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {item.status ===
							'published'
								? 'bg-emerald-50 text-emerald-700'
								: 'bg-amber-50 text-amber-700'}"
						>
							{item.status === 'published' ? 'Published' : 'Draft'}
						</span>
					</div>
				{:else}
					<div class="px-6 py-8 text-center text-slate-500">
						<p>Belum ada berita</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Quick Actions -->
		<div class="rounded-xl border border-slate-200 bg-white">
			<div class="border-b border-slate-200 px-6 py-4">
				<h2 class="font-semibold text-slate-900">Aksi Cepat</h2>
			</div>
			<div class="grid grid-cols-2 gap-4 p-6">
				<a
					href="/dashboard/berita/buat"
					class="flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
						<Newspaper class="h-6 w-6 text-blue-600" />
					</div>
					<span class="text-sm font-medium text-slate-700">Buat Berita</span>
				</a>

				<a
					href="/dashboard/divisi/buat"
					class="flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-purple-300 hover:bg-purple-50"
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
						<Users class="h-6 w-6 text-purple-600" />
					</div>
					<span class="text-sm font-medium text-slate-700">Tambah Divisi</span>
				</a>

				<a
					href="/dashboard/program-kerja/buat"
					class="flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-green-300 hover:bg-green-50"
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
						<FolderKanban class="h-6 w-6 text-green-600" />
					</div>
					<span class="text-sm font-medium text-slate-700">Tambah Proker</span>
				</a>

				<a
					href="/dashboard/dokumen/buat"
					class="flex flex-col items-center gap-3 rounded-xl border border-slate-200 p-4 transition-colors hover:border-orange-300 hover:bg-orange-50"
				>
					<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
						<FileText class="h-6 w-6 text-orange-600" />
					</div>
					<span class="text-sm font-medium text-slate-700">Upload Dokumen</span>
				</a>
			</div>
		</div>
	</div>
</div>
