<script lang="ts">
	import { clsx } from 'clsx';
	import { Sidebar, Navbar, Toast } from '$lib/components/dashboard';

	interface Props {
		data: {
			user: {
				namaLengkap: string;
				email: string;
				fotoProfil?: string | null;
			};
		};
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let sidebarCollapsed = $state(false);

	function toggleSidebar() {
		sidebarCollapsed = !sidebarCollapsed;
	}
</script>

<div class="min-h-screen bg-slate-50">
	<!-- Toast Provider -->
	<Toast />

	<!-- Sidebar -->
	<Sidebar user={data.user} bind:collapsed={sidebarCollapsed} />

	<!-- Main Content -->
	<div
		class={clsx(
			'min-h-screen transition-all duration-300',
			sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
		)}
	>
		<!-- Navbar -->
		<Navbar user={data.user} sidebarCollapsed={sidebarCollapsed} onToggleSidebar={toggleSidebar} />

		<!-- Page Content -->
		<main class="p-6">
			{@render children()}
		</main>
	</div>
</div>
