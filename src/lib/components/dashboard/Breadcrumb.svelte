<script lang="ts">
	import { ChevronRight, Home } from 'lucide-svelte';

	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	interface Props {
		items: BreadcrumbItem[];
	}

	let { items }: Props = $props();
</script>

<nav class="flex items-center gap-2 text-sm">
	<a
		href="/dashboard"
		class="flex items-center gap-1 text-slate-500 transition-colors hover:text-blue-600"
	>
		<Home class="h-4 w-4" />
	</a>

	{#each items as item, i}
		<ChevronRight class="h-4 w-4 text-slate-400" />
		{#if item.href && i < items.length - 1}
			<a href={item.href} class="text-slate-500 transition-colors hover:text-blue-600">
				{item.label}
			</a>
		{:else}
			<span class="font-medium text-slate-900">{item.label}</span>
		{/if}
	{/each}
</nav>
