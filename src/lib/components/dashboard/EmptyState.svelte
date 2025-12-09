<script lang="ts">
	import { clsx } from 'clsx';
	import { Package } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		icon?: Snippet;
		action?: Snippet;
	}

	let { title = 'Tidak ada data', description, icon, action }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 text-center">
	<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
		{#if icon}
			{@render icon()}
		{:else}
			<Package class="h-8 w-8 text-slate-400" />
		{/if}
	</div>
	<h3 class="text-lg font-medium text-slate-900">{title}</h3>
	{#if description}
		<p class="mt-1 text-sm text-slate-500">{description}</p>
	{/if}
	{#if action}
		<div class="mt-4">
			{@render action()}
		</div>
	{/if}
</div>
