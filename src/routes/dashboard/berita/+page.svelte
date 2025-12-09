<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import {
		Breadcrumb,
		SearchFilter,
		Pagination,
		Button,
		ConfirmDialog,
		EmptyState,
		Badge
	} from '$lib/components/dashboard';
	import {
		Plus,
		Trash2,
		Edit,
		Eye,
		MoreHorizontal,
		FileDown,
		CheckSquare,
		Square,
		Newspaper
	} from 'lucide-svelte';
	import { clsx } from 'clsx';

	interface Props {
		data: {
			berita: Array<{
				id: number;
				judul: string;
				slug: string;
				kategori: string | null;
				status: 'draft' | 'published';
				dilihatCount: number;
				gambarUtama: string | null;
				dibuatPada: string;
			}>;
			pagination: {
				currentPage: number;
				totalPages: number;
				totalItems: number;
				itemsPerPage: number;
			};
			filters: {
				search: string;
				status: string;
				kategori: string;
			};
			categories: string[];
		};
		form: { success?: boolean; message?: string } | null;
	}

	let { data, form }: Props = $props();

	// State
	let selectedIds = $state<number[]>([]);
	let deleteModalOpen = $state(false);
	let bulkDeleteModalOpen = $state(false);
	let deleteId = $state<number | null>(null);
	let deleteLoading = $state(false);

	// Show toast on form result
	$effect(() => {
		if (form?.success !== undefined) {
			if (form.success) {
				toast.success(form.message || 'Berhasil!');
			} else {
				toast.error(form.message || 'Terjadi kesalahan');
			}
		}
	});

	// Computed
	const allSelected = $derived(
		data.berita.length > 0 && selectedIds.length === data.berita.length
	);

	// Handlers
	function toggleSelectAll() {
		if (allSelected) {
			selectedIds = [];
		} else {
			selectedIds = data.berita.map((b) => b.id);
		}
	}

	function toggleSelect(id: number) {
		if (selectedIds.includes(id)) {
			selectedIds = selectedIds.filter((i) => i !== id);
		} else {
			selectedIds = [...selectedIds, id];
		}
	}

	function handlePageChange(page: number) {
		const params = new URLSearchParams(window.location.search);
		params.set('page', page.toString());
		goto(`?${params.toString()}`);
	}

	function handleSearch(value: string) {
		const params = new URLSearchParams(window.location.search);
		if (value) {
			params.set('search', value);
		} else {
			params.delete('search');
		}
		params.set('page', '1');
		goto(`?${params.toString()}`);
	}

	function handleStatusChange(value: string) {
		const params = new URLSearchParams(window.location.search);
		if (value) {
			params.set('status', value);
		} else {
			params.delete('status');
		}
		params.set('page', '1');
		goto(`?${params.toString()}`);
	}

	function handleCategoryChange(value: string) {
		const params = new URLSearchParams(window.location.search);
		if (value) {
			params.set('kategori', value);
		} else {
			params.delete('kategori');
		}
		params.set('page', '1');
		goto(`?${params.toString()}`);
	}

	function handleClearFilters() {
		goto('/dashboard/berita');
	}

	function handleRefresh() {
		invalidateAll();
		toast.success('Data berhasil diperbarui');
	}

	function openDeleteModal(id: number) {
		deleteId = id;
		deleteModalOpen = true;
	}

	function openBulkDeleteModal() {
		bulkDeleteModalOpen = true;
	}

	async function exportData() {
		toast.info('Mengekspor data...');

		// Create CSV content
		const headers = ['ID', 'Judul', 'Slug', 'Kategori', 'Status', 'Views', 'Tanggal'];
		const rows = data.berita.map((b) => [
			b.id,
			`"${b.judul.replace(/"/g, '""')}"`,
			b.slug,
			b.kategori || '-',
			b.status,
			b.dilihatCount,
			b.dibuatPada
		]);

		const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

		// Download
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `berita_${new Date().toISOString().split('T')[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		toast.success('Data berhasil diekspor');
	}

	// Status options for filter
	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' }
	];

	const categoryOptions = $derived(data.categories.map((c) => ({ value: c, label: c })));
</script>

<svelte:head>
	<title>Kelola Berita - Dashboard HIMA</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Berita' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Kelola Berita</h1>
		</div>
		<div class="flex items-center gap-3">
			{#if selectedIds.length > 0}
				<Button variant="danger" onclick={openBulkDeleteModal}>
					{#snippet icon()}<Trash2 class="h-4 w-4" />{/snippet}
					Hapus ({selectedIds.length})
				</Button>
			{/if}
			<Button variant="outline" onclick={exportData}>
				{#snippet icon()}<FileDown class="h-4 w-4" />{/snippet}
				Export
			</Button>
			<Button href="/dashboard/berita/buat">
				{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}
				Tambah Berita
			</Button>
		</div>
	</div>

	<!-- Filters -->
	<div class="rounded-xl border border-slate-200 bg-white p-4">
		<SearchFilter
			searchValue={data.filters.search}
			searchPlaceholder="Cari judul berita..."
			{statusOptions}
			statusValue={data.filters.status}
			categoryOptions={categoryOptions}
			categoryValue={data.filters.kategori}
			onSearch={handleSearch}
			onStatusChange={handleStatusChange}
			onCategoryChange={handleCategoryChange}
			onRefresh={handleRefresh}
			onClear={handleClearFilters}
		/>
	</div>

	<!-- Table -->
	<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
		{#if data.berita.length === 0}
			<EmptyState
				title="Belum ada berita"
				description="Mulai buat berita pertama Anda"
			>
				{#snippet icon()}<Newspaper class="h-8 w-8 text-slate-400" />{/snippet}
				{#snippet action()}
					<Button href="/dashboard/berita/buat">
						{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}
						Tambah Berita
					</Button>
				{/snippet}
			</EmptyState>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-slate-200 bg-slate-50">
							<th class="px-4 py-3 text-left">
								<button
									onclick={toggleSelectAll}
									class="flex items-center justify-center text-slate-500 hover:text-slate-700"
								>
									{#if allSelected}
										<CheckSquare class="h-5 w-5 text-blue-600" />
									{:else}
										<Square class="h-5 w-5" />
									{/if}
								</button>
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Berita
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Kategori
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Status
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Views
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Tanggal
							</th>
							<th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
								Aksi
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each data.berita as item}
							{@const isSelected = selectedIds.includes(item.id)}
							<tr class={clsx('transition-colors', isSelected && 'bg-blue-50')}>
								<td class="px-4 py-3">
									<button
										onclick={() => toggleSelect(item.id)}
										class="flex items-center justify-center text-slate-500 hover:text-slate-700"
									>
										{#if isSelected}
											<CheckSquare class="h-5 w-5 text-blue-600" />
										{:else}
											<Square class="h-5 w-5" />
										{/if}
									</button>
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										{#if item.gambarUtama}
											<img
												src={item.gambarUtama}
												alt={item.judul}
												class="h-12 w-16 rounded-lg object-cover"
											/>
										{:else}
											<div
												class="flex h-12 w-16 items-center justify-center rounded-lg bg-slate-100"
											>
												<Newspaper class="h-5 w-5 text-slate-400" />
											</div>
										{/if}
										<div class="min-w-0">
											<p class="truncate font-medium text-slate-900">{item.judul}</p>
											<p class="truncate text-sm text-slate-500">/{item.slug}</p>
										</div>
									</div>
								</td>
								<td class="px-4 py-3">
									{#if item.kategori}
										<Badge variant="info">{item.kategori}</Badge>
									{:else}
										<span class="text-slate-400">-</span>
									{/if}
								</td>
								<td class="px-4 py-3">
									<Badge variant={item.status === 'published' ? 'success' : 'warning'}>
										{item.status === 'published' ? 'Published' : 'Draft'}
									</Badge>
								</td>
								<td class="px-4 py-3">
									<span class="text-slate-600">{item.dilihatCount.toLocaleString()}</span>
								</td>
								<td class="px-4 py-3">
									<span class="text-sm text-slate-600">{item.dibuatPada}</span>
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center justify-end gap-1">
										<a
											href="/berita/{item.slug}"
											target="_blank"
											class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
											title="Lihat"
										>
											<Eye class="h-4 w-4" />
										</a>
										<a
											href="/dashboard/berita/{item.id}/ubah"
											class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
											title="Edit"
										>
											<Edit class="h-4 w-4" />
										</a>
										<button
											onclick={() => openDeleteModal(item.id)}
											class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
											title="Hapus"
										>
											<Trash2 class="h-4 w-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="border-t border-slate-200 px-4 py-3">
				<Pagination
					currentPage={data.pagination.currentPage}
					totalPages={data.pagination.totalPages}
					totalItems={data.pagination.totalItems}
					itemsPerPage={data.pagination.itemsPerPage}
					onPageChange={handlePageChange}
				/>
			</div>
		{/if}
	</div>
</div>

<!-- Delete Single Modal -->
<ConfirmDialog
	bind:open={deleteModalOpen}
	title="Hapus Berita"
	message="Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat dibatalkan."
	confirmText="Ya, Hapus"
	loading={deleteLoading}
	onConfirm={() => {
		deleteLoading = true;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/delete';
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'id';
		input.value = String(deleteId);
		form.appendChild(input);
		document.body.appendChild(form);
		form.submit();
	}}
	onCancel={() => {
		deleteModalOpen = false;
		deleteId = null;
	}}
/>

<!-- Bulk Delete Modal -->
<ConfirmDialog
	bind:open={bulkDeleteModalOpen}
	title="Hapus {selectedIds.length} Berita"
	message="Apakah Anda yakin ingin menghapus {selectedIds.length} berita yang dipilih? Tindakan ini tidak dapat dibatalkan."
	confirmText="Ya, Hapus Semua"
	loading={deleteLoading}
	onConfirm={() => {
		deleteLoading = true;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/bulkDelete';
		selectedIds.forEach((id) => {
			const input = document.createElement('input');
			input.type = 'hidden';
			input.name = 'ids';
			input.value = String(id);
			form.appendChild(input);
		});
		document.body.appendChild(form);
		form.submit();
	}}
	onCancel={() => {
		bulkDeleteModalOpen = false;
	}}
/>
