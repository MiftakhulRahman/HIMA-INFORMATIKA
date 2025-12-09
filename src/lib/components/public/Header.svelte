<script lang="ts">
	import { page } from '$app/stores';
	import { Menu, X } from 'lucide-svelte';

	interface Props {
		siteName?: string;
		logoUrl?: string;
	}

	let { siteName = 'HIMA Informatika', logoUrl = '' }: Props = $props();
	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ href: '/', label: 'Beranda' },
		{ href: '/tentang', label: 'Tentang' },
		{ href: '/berita', label: 'Berita' },
		{ href: '/divisi', label: 'Divisi' },
		{ href: '/program-kerja', label: 'Program Kerja' },
		{ href: '/struktur-organisasi', label: 'Struktur' },
		{ href: '/galeri', label: 'Galeri' },
		{ href: '/dokumen', label: 'Dokumen' },
		{ href: '/kontak', label: 'Kontak' }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
	<div class="container mx-auto px-4 lg:px-6">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				{#if logoUrl}
					<img src={logoUrl} alt={siteName} class="h-8 w-8" />
				{/if}
				<span class="font-bold text-slate-900">{siteName}</span>
			</a>

			<!-- Desktop Nav -->
			<nav class="hidden lg:flex items-center gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						class="px-3 py-2 text-sm font-medium rounded-lg transition-colors {isActive(link.href, $page.url.pathname)
							? 'text-blue-600 bg-blue-50'
							: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<!-- Mobile Menu Button -->
			<button onclick={() => (mobileMenuOpen = !mobileMenuOpen)} class="lg:hidden p-2 text-slate-600">
				{#if mobileMenuOpen}
					<X class="w-6 h-6" />
				{:else}
					<Menu class="w-6 h-6" />
				{/if}
			</button>
		</div>

		<!-- Mobile Nav -->
		{#if mobileMenuOpen}
			<nav class="lg:hidden py-4 border-t border-slate-100">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (mobileMenuOpen = false)}
						class="block px-4 py-2 text-sm font-medium rounded-lg {isActive(link.href, $page.url.pathname)
							? 'text-blue-600 bg-blue-50'
							: 'text-slate-600'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		{/if}
	</div>
</header>

<!-- Spacer for fixed header -->
<div class="h-16"></div>
