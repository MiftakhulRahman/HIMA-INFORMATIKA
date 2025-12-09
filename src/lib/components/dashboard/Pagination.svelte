<script lang="ts">
	import { clsx } from 'clsx';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';

	interface Props {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
		onPageChange?: (page: number) => void;
	}

	let { currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: Props = $props();

	const startItem = $derived((currentPage - 1) * itemsPerPage + 1);
	const endItem = $derived(Math.min(currentPage * itemsPerPage, totalItems));

	// Calculate visible page numbers
	const visiblePages = $derived(() => {
		const pages: (number | string)[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			if (currentPage <= 3) {
				for (let i = 1; i <= 4; i++) pages.push(i);
				pages.push('...');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1);
				pages.push('...');
				for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
			} else {
				pages.push(1);
				pages.push('...');
				for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
				pages.push('...');
				pages.push(totalPages);
			}
		}

		return pages;
	});

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			onPageChange?.(page);
		}
	}
</script>

<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
	<!-- Info -->
	<p class="text-sm text-slate-600">
		Menampilkan <span class="font-medium">{startItem}</span> -
		<span class="font-medium">{endItem}</span> dari
		<span class="font-medium">{totalItems}</span> data
	</p>

	<!-- Pagination Controls -->
	<div class="flex items-center gap-1">
		<!-- Previous -->
		<button
			onclick={() => goToPage(currentPage - 1)}
			disabled={currentPage === 1}
			class={clsx(
				'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
				currentPage === 1
					? 'cursor-not-allowed border-slate-200 text-slate-300'
					: 'border-slate-300 text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
			)}
		>
			<ChevronLeft class="h-4 w-4" />
		</button>

		<!-- Page Numbers -->
		{#each visiblePages() as page}
			{#if page === '...'}
				<span class="px-2 text-slate-400">...</span>
			{:else}
				<button
					onclick={() => goToPage(page as number)}
					class={clsx(
						'flex h-9 min-w-[36px] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors',
						page === currentPage
							? 'border-blue-500 bg-blue-500 text-white'
							: 'border-slate-300 text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
					)}
				>
					{page}
				</button>
			{/if}
		{/each}

		<!-- Next -->
		<button
			onclick={() => goToPage(currentPage + 1)}
			disabled={currentPage === totalPages}
			class={clsx(
				'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
				currentPage === totalPages
					? 'cursor-not-allowed border-slate-200 text-slate-300'
					: 'border-slate-300 text-slate-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600'
			)}
		>
			<ChevronRight class="h-4 w-4" />
		</button>
	</div>
</div>
