<script lang="ts">
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';
	import { Loader2 } from 'lucide-svelte';

	interface Props {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		disabled?: boolean;
		fullWidth?: boolean;
		href?: string;
		onclick?: (e: MouseEvent) => void;
		children: Snippet;
		icon?: Snippet;
	}

	let {
		type = 'button',
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		fullWidth = false,
		href,
		onclick,
		children,
		icon
	}: Props = $props();

	const baseStyles =
		'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

	const variantStyles = {
		primary:
			'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg shadow-blue-500/25',
		secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500',
		danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
		ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
		outline:
			'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500'
	};

	const sizeStyles = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const classes = $derived(
		clsx(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && 'w-full')
	);
</script>

{#if href}
	<a {href} class={classes}>
		{#if loading}
			<Loader2 class="h-4 w-4 animate-spin" />
		{:else if icon}
			{@render icon()}
		{/if}
		{@render children()}
	</a>
{:else}
	<button {type} disabled={disabled || loading} {onclick} class={classes}>
		{#if loading}
			<Loader2 class="h-4 w-4 animate-spin" />
		{:else if icon}
			{@render icon()}
		{/if}
		{@render children()}
	</button>
{/if}
