<script lang="ts">
	import { clsx } from 'clsx';

	type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

	interface Props {
		variant?: BadgeVariant;
		size?: 'sm' | 'md';
		children: import('svelte').Snippet;
	}

	let { variant = 'neutral', size = 'sm', children }: Props = $props();

	const variantStyles: Record<BadgeVariant, string> = {
		success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
		warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
		danger: 'bg-red-50 text-red-700 ring-red-600/20',
		info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
		neutral: 'bg-slate-100 text-slate-700 ring-slate-600/20'
	};

	const sizeStyles = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-2.5 py-1 text-sm'
	};
</script>

<span
	class={clsx(
		'inline-flex items-center rounded-full font-medium ring-1 ring-inset',
		variantStyles[variant],
		sizeStyles[size]
	)}
>
	{@render children()}
</span>
