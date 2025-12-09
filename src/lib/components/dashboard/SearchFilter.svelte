<script lang="ts">
	import { Search, X, RefreshCw, Filter as FilterIcon } from 'lucide-svelte';

	interface FilterOption {
		value: string;
		label: string;
	}

	interface Props {
		searchValue?: string;
		searchPlaceholder?: string;
		statusOptions?: FilterOption[];
		statusValue?: string;
		categoryOptions?: FilterOption[];
		categoryValue?: string;
		onSearch?: (value: string) => void;
		onStatusChange?: (value: string) => void;
		onCategoryChange?: (value: string) => void;
		onRefresh?: () => void;
		onClear?: () => void;
	}

	let {
		searchValue = $bindable(''),
		searchPlaceholder = 'Cari...',
		statusOptions = [],
		statusValue = $bindable(''),
		categoryOptions = [],
		categoryValue = $bindable(''),
		onSearch,
		onStatusChange,
		onCategoryChange,
		onRefresh,
		onClear
	}: Props = $props();

	let searchTimeout: ReturnType<typeof setTimeout>;

	function handleSearchInput(e: Event) {
		const target = e.target as HTMLInputElement;
		searchValue = target.value;

		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			onSearch?.(searchValue);
		}, 300);
	}

	function handleStatusChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		statusValue = target.value;
		onStatusChange?.(statusValue);
	}

	function handleCategoryChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		categoryValue = target.value;
		onCategoryChange?.(categoryValue);
	}

	function handleClear() {
		searchValue = '';
		statusValue = '';
		categoryValue = '';
		onClear?.();
	}

	const hasFilters = $derived(searchValue || statusValue || categoryValue);
</script>

<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
		<!-- Search Input -->
		<div class="relative flex-1 sm:max-w-xs">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
			<input
				type="text"
				value={searchValue}
				oninput={handleSearchInput}
				placeholder={searchPlaceholder}
				class="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
			/>
		</div>

		<!-- Status Filter -->
		{#if statusOptions.length > 0}
			<div class="relative">
				<select
					value={statusValue}
					onchange={handleStatusChange}
					class="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="">Semua Status</option>
					{#each statusOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				<FilterIcon
					class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
				/>
			</div>
		{/if}

		<!-- Category Filter -->
		{#if categoryOptions.length > 0}
			<div class="relative">
				<select
					value={categoryValue}
					onchange={handleCategoryChange}
					class="appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-4 pr-10 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="">Semua Kategori</option>
					{#each categoryOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				<FilterIcon
					class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
				/>
			</div>
		{/if}
	</div>

	<!-- Actions -->
	<div class="flex items-center gap-2">
		{#if hasFilters}
			<button
				onclick={handleClear}
				class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
			>
				<X class="h-4 w-4" />
				<span>Hapus Filter</span>
			</button>
		{/if}

		{#if onRefresh}
			<button
				onclick={onRefresh}
				class="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
			>
				<RefreshCw class="h-4 w-4" />
				<span class="hidden sm:inline">Refresh</span>
			</button>
		{/if}
	</div>
</div>
