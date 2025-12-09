<script lang="ts">
	import { page } from '$app/stores';
	import { Menu, Bell, Search } from 'lucide-svelte';
	import UserDropdown from './UserDropdown.svelte';

	interface Props {
		user: {
			namaLengkap: string;
			email: string;
			fotoProfil?: string | null;
		};
		sidebarCollapsed?: boolean;
		onToggleSidebar?: () => void;
	}

	let { user, sidebarCollapsed = false, onToggleSidebar }: Props = $props();

	// Generate breadcrumb from current path
	const breadcrumbs = $derived(() => {
		const path = $page.url.pathname;
		const segments = path.split('/').filter(Boolean);

		const crumbs: { label: string; href: string }[] = [];
		let currentPath = '';

		const labelMap: Record<string, string> = {
			dashboard: 'Dashboard',
			berita: 'Berita',
			divisi: 'Divisi',
			'program-kerja': 'Program Kerja',
			'struktur-organisasi': 'Struktur Organisasi',
			dokumen: 'Dokumen',
			galeri: 'Galeri',
			media: 'Media Library',
			pengaturan: 'Pengaturan',
			profil: 'Profil',
			buat: 'Buat Baru',
			ubah: 'Edit'
		};

		for (const segment of segments) {
			currentPath += '/' + segment;
			const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
			crumbs.push({ label, href: currentPath });
		}

		return crumbs;
	});
</script>

<header
	class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm"
>
	<!-- Left: Mobile Menu + Breadcrumb -->
	<div class="flex items-center gap-4">
		<!-- Mobile menu toggle -->
		<button
			onclick={onToggleSidebar}
			class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
		>
			<Menu class="h-5 w-5" />
		</button>

		<!-- Breadcrumb -->
		<nav class="hidden items-center gap-2 text-sm sm:flex">
			{#each breadcrumbs() as crumb, i}
				{#if i > 0}
					<span class="text-slate-400">/</span>
				{/if}
				{#if i === breadcrumbs().length - 1}
					<span class="font-medium text-slate-900">{crumb.label}</span>
				{:else}
					<a href={crumb.href} class="text-slate-500 transition-colors hover:text-blue-600">
						{crumb.label}
					</a>
				{/if}
			{/each}
		</nav>
	</div>

	<!-- Right: Search + Notifications + User -->
	<div class="flex items-center gap-3">
		<!-- Search -->
		<div class="relative hidden md:block">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				placeholder="Cari..."
				class="w-64 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
		</div>

		<!-- Notifications -->
		<button
			class="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
		>
			<Bell class="h-5 w-5" />
			<span
				class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"
			></span>
		</button>

		<!-- User Dropdown -->
		<UserDropdown {user} />
	</div>
</header>
