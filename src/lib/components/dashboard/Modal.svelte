<script lang="ts">
	import { X } from 'lucide-svelte';
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		onClose?: () => void;
		children: Snippet;
		footer?: Snippet;
	}

	let { open = $bindable(), title, size = 'md', onClose, children, footer }: Props = $props();

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};

	function handleClose() {
		open = false;
		onClose?.();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
		onclick={handleBackdropClick}
	>
		<!-- Modal -->
		<div
			class={clsx(
				'relative w-full transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all',
				sizeClasses[size]
			)}
		>
			<!-- Header -->
			{#if title}
				<div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
					<h2 class="text-lg font-semibold text-slate-900">{title}</h2>
					<button
						onclick={handleClose}
						class="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
					>
						<X class="h-5 w-5" />
					</button>
				</div>
			{/if}

			<!-- Content -->
			<div class="px-6 py-4">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
