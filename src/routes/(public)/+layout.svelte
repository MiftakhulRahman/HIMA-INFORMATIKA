<script lang="ts">
	import { Header, Footer } from '$lib/components/public';
	import { Toaster } from 'svelte-sonner';

	interface Props {
		data: { pengaturan: Record<string, string> };
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
</script>

<Toaster position="top-right" richColors />
<Header siteName={data.pengaturan.nama_situs} logoUrl={data.pengaturan.logo_url} />
<main class="min-h-screen">
	{@render children()}
</main>
<Footer pengaturan={data.pengaturan} />
