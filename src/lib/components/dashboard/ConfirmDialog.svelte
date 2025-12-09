<script lang="ts">
	import { clsx } from 'clsx';
	import { AlertTriangle, Trash2 } from 'lucide-svelte';

	interface Props {
		open: boolean;
		title?: string;
		message?: string;
		confirmText?: string;
		cancelText?: string;
		variant?: 'danger' | 'warning' | 'info';
		loading?: boolean;
		onConfirm?: () => void;
		onCancel?: () => void;
	}

	let {
		open = $bindable(),
		title = 'Konfirmasi',
		message = 'Apakah Anda yakin ingin melanjutkan?',
		confirmText = 'Ya, Lanjutkan',
		cancelText = 'Batal',
		variant = 'danger',
		loading = false,
		onConfirm,
		onCancel
	}: Props = $props();

	const variantStyles = {
		danger: {
			icon: 'bg-red-100 text-red-600',
			button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
		},
		warning: {
			icon: 'bg-amber-100 text-amber-600',
			button: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
		},
		info: {
			icon: 'bg-blue-100 text-blue-600',
			button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
		}
	};

	function handleConfirm() {
		onConfirm?.();
	}

	function handleCancel() {
		open = false;
		onCancel?.();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
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
		<div class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl">
			<div class="p-6">
				<div class="flex items-start gap-4">
					<!-- Icon -->
					<div
						class={clsx(
							'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full',
							variantStyles[variant].icon
						)}
					>
						{#if variant === 'danger'}
							<Trash2 class="h-6 w-6" />
						{:else}
							<AlertTriangle class="h-6 w-6" />
						{/if}
					</div>

					<!-- Content -->
					<div class="flex-1">
						<h3 class="text-lg font-semibold text-slate-900">{title}</h3>
						<p class="mt-2 text-sm text-slate-600">{message}</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
				<button
					onclick={handleCancel}
					disabled={loading}
					class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
				>
					{cancelText}
				</button>
				<button
					onclick={handleConfirm}
					disabled={loading}
					class={clsx(
						'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
						variantStyles[variant].button
					)}
				>
					{#if loading}
						<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
								fill="none"
							/>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					{/if}
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
