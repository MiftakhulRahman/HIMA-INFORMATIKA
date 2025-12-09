<script lang="ts">
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
		FileDown,
		CheckSquare,
		Square,
		Building2,
		GripVertical
	} from 'lucide-svelte';
	import { clsx } from 'clsx';

	interface Props {
		data: {
			divisi: Array<{
				id: number;
				nama: string;
				slug: string;
				deskripsi: string | null;
				ikon: string | null;
				urutan: number;
				status: 'aktif' | 'nonaktif';
				gambarBanner: string | null;
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
			};
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
				selectedIds = [];
			} else {
				toast.error(form.message || 'Terjadi kesalahan');
			}
		}
	});

	// Computed
	const allSelected = $derived(
		data.divisi.length > 0 && selectedIds.length === data.divisi.length
	);

	// Handlers
	function toggleSelectAll() {
		if (allSelected) {
			selectedIds = [];
		} else {
			selectedIds = data.divisi.map((d) => d.id);
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

	function handleClearFilters() {
		goto('/dashboard/divisi');
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
		const headers = ['ID', 'Nama', 'Slug', 'Deskripsi', 'Status', 'Urutan'];
		const rows = data.divisi.map((d) => [
			d.id,
			`"${d.nama.replace(/"/g, '""')}"`,
			d.slug,
			`"${(d.deskripsi || '').replace(/"/g, '""')}"`,
			d.status,
			d.urutan
		]);

		const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.setAttribute('href', url);
		link.setAttribute('download', `divisi_${new Date().toISOString().split('T')[0]}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success('Data berhasil diekspor');
	}

	const statusOptions = [
		{ value: 'aktif', label: 'Aktif' },
		{ value: 'nonaktif', label: 'Nonaktif' }
	];
</script>

<svelte:head>
	<title>Kelola Divisi - Dashboard HIMA</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Divisi' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Kelola Divisi</h1>
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
			<Button href="/dashboard/divisi/buat">
				{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}
				Tambah Divisi
			</Button>
		</div>
	</div>

	<!-- Filters -->
	<div class="rounded-xl border border-slate-200 bg-white p-4">
		<SearchFilter
			searchValue={data.filters.search}
			searchPlaceholder="Cari nama divisi..."
			{statusOptions}
			statusValue={data.filters.status}
			onSearch={handleSearch}
			onStatusChange={handleStatusChange}
			onRefresh={handleRefresh}
			onClear={handleClearFilters}
		/>
	</div>

	<!-- Table -->
	<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
		{#if data.divisi.length === 0}
			<EmptyState title="Belum ada divisi" description="Mulai tambah divisi pertama Anda">
				{#snippet icon()}<Building2 class="h-8 w-8 text-slate-400" />{/snippet}
				{#snippet action()}
					<Button href="/dashboard/divisi/buat">
						{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}
						Tambah Divisi
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
								<GripVertical class="h-4 w-4" />
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Divisi
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Deskripsi
							</th>
							<th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
								Status
							</th>
							<th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
								Aksi
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-slate-100">
						{#each data.divisi as item}
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
									<div class="cursor-grab text-slate-400 hover:text-slate-600">
										<GripVertical class="h-4 w-4" />
									</div>
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										{#if item.gambarBanner}
											<img
												src={item.gambarBanner}
												alt={item.nama}
												class="h-10 w-10 rounded-lg object-cover"
											/>
										{:else}
											<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
												<Building2 class="h-5 w-5 text-purple-600" />
											</div>
										{/if}
										<div>
											<p class="font-medium text-slate-900">{item.nama}</p>
											<p class="text-sm text-slate-500">/{item.slug}</p>
										</div>
									</div>
								</td>
								<td class="px-4 py-3">
									<p class="max-w-xs truncate text-sm text-slate-600">
										{item.deskripsi || '-'}
									</p>
								</td>
								<td class="px-4 py-3">
									<Badge variant={item.status === 'aktif' ? 'success' : 'neutral'}>
										{item.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
									</Badge>
								</td>
								<td class="px-4 py-3">
									<div class="flex items-center justify-end gap-1">
										<a
											href="/divisi/{item.slug}"
											target="_blank"
											class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
											title="Lihat"
										>
											<Eye class="h-4 w-4" />
										</a>
										<a
											href="/dashboard/divisi/{item.id}/ubah"
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

<!-- Delete Modals -->
<ConfirmDialog
	bind:open={deleteModalOpen}
	title="Hapus Divisi"
	message="Apakah Anda yakin ingin menghapus divisi ini? Tindakan ini tidak dapat dibatalkan."
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

<ConfirmDialog
	bind:open={bulkDeleteModalOpen}
	title="Hapus {selectedIds.length} Divisi"
	message="Apakah Anda yakin ingin menghapus {selectedIds.length} divisi yang dipilih?"
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
