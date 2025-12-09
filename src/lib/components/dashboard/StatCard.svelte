<script lang="ts">
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		value?: string | number;
		trend?: 'up' | 'down' | 'neutral';
		trendValue?: string;
		icon?: Snippet;
		color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
	}

	let {
		title,
		description,
		value,
		trend,
		trendValue,
		icon,
		color = 'blue'
	}: Props = $props();

	const colorStyles = {
		blue: 'from-blue-500 to-blue-600',
		green: 'from-emerald-500 to-emerald-600',
		purple: 'from-purple-500 to-purple-600',
		orange: 'from-orange-500 to-orange-600',
		red: 'from-red-500 to-red-600'
	};

	const trendStyles = {
		up: 'text-emerald-600 bg-emerald-50',
		down: 'text-red-600 bg-red-50',
		neutral: 'text-slate-600 bg-slate-100'
	};
</script>

<div
	class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
>
	<div class="p-6">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				{#if title}
					<p class="text-sm font-medium text-slate-500">{title}</p>
				{/if}
				{#if value !== undefined}
					<p class="mt-2 text-3xl font-bold text-slate-900">{value}</p>
				{/if}
				{#if description}
					<p class="mt-1 text-sm text-slate-500">{description}</p>
				{/if}
				{#if trend && trendValue}
					<div class="mt-3 flex items-center gap-2">
						<span class={clsx('rounded-full px-2 py-0.5 text-xs font-medium', trendStyles[trend])}>
							{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '–'} {trendValue}
						</span>
						<span class="text-xs text-slate-500">vs bulan lalu</span>
					</div>
				{/if}
			</div>
			{#if icon}
				<div
					class={clsx(
						'flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white',
						colorStyles[color]
					)}
				>
					{@render icon()}
				</div>
			{/if}
		</div>
	</div>
</div>
