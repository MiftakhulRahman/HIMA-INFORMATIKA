<script lang="ts">
	import { page } from '$app/stores';
	import { clsx } from 'clsx';
	import {
		LayoutDashboard,
		Newspaper,
		Users,
		FolderKanban,
		Building2,
		FileText,
		Image,
		Upload,
		Settings,
		User,
		ChevronLeft,
		LogOut,
		Menu
	} from 'lucide-svelte';

	interface Props {
		user: {
			namaLengkap: string;
			email: string;
			fotoProfil?: string | null;
		};
		collapsed?: boolean;
	}

	let { user, collapsed = $bindable(false) }: Props = $props();

	const menuItems = [
		{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/dashboard/berita', label: 'Berita', icon: Newspaper },
		{ href: '/dashboard/divisi', label: 'Divisi', icon: Building2 },
		{ href: '/dashboard/program-kerja', label: 'Program Kerja', icon: FolderKanban },
		{ href: '/dashboard/struktur-organisasi', label: 'Struktur Organisasi', icon: Users },
		{ href: '/dashboard/dokumen', label: 'Dokumen', icon: FileText },
		{ href: '/dashboard/galeri', label: 'Galeri', icon: Image },
		{ href: '/dashboard/media', label: 'Media Library', icon: Upload },
		{ href: '/dashboard/pengaturan', label: 'Pengaturan', icon: Settings },
		{ href: '/dashboard/profil', label: 'Profil', icon: User }
	];

	function isActive(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === '/dashboard') {
			return currentPath === '/dashboard';
		}
		return currentPath.startsWith(href);
	}

	function toggleSidebar() {
		collapsed = !collapsed;
	}
</script>

<aside
	class={clsx(
		'fixed left-0 top-0 z-40 flex h-screen flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl transition-all duration-300',
		collapsed ? 'w-20' : 'w-64'
	)}
>
	<!-- Logo Section -->
	<div
		class="flex h-16 items-center justify-between border-b border-slate-700/50 px-4"
	>
		{#if !collapsed}
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold"
				>
					HI
				</div>
				<div>
					<h1 class="text-sm font-bold">HIMA Informatika</h1>
					<p class="text-xs text-slate-400">Dashboard Admin</p>
				</div>
			</div>
		{:else}
			<div
				class="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold"
			>
				HI
			</div>
		{/if}
	</div>

	<!-- Toggle Button -->
	<button
		onclick={toggleSidebar}
		class="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-400 shadow-lg transition-colors hover:bg-slate-700 hover:text-white"
	>
		<ChevronLeft class={clsx('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
	</button>

	<!-- Navigation Menu -->
	<nav class="mt-6 flex-1 space-y-1 overflow-y-auto px-3">
		{#each menuItems as item}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				class={clsx(
					'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
					active
						? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
						: 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
				)}
				title={collapsed ? item.label : undefined}
			>
				<item.icon class={clsx('h-5 w-5 flex-shrink-0', active && 'text-white')} />
				{#if !collapsed}
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- User Section -->
	<div class="border-t border-slate-700/50 p-4">
		{#if !collapsed}
			<div class="mb-3 flex items-center gap-3">
				{#if user.fotoProfil}
					<img
						src={user.fotoProfil}
						alt={user.namaLengkap}
						class="h-10 w-10 rounded-full object-cover ring-2 ring-slate-600"
					/>
				{:else}
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-semibold uppercase"
					>
						{user.namaLengkap.charAt(0)}
					</div>
				{/if}
				<div class="min-w-0 flex-1">
					<p class="truncate text-sm font-medium">{user.namaLengkap}</p>
					<p class="truncate text-xs text-slate-400">{user.email}</p>
				</div>
			</div>
		{/if}
		<a
			href="/keluar"
			class={clsx(
				'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300',
				collapsed && 'justify-center'
			)}
			title={collapsed ? 'Keluar' : undefined}
		>
			<LogOut class="h-5 w-5" />
			{#if !collapsed}
				<span>Keluar</span>
			{/if}
		</a>
	</div>
</aside>
