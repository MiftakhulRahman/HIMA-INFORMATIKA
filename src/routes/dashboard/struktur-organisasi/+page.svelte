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
	import { Plus, Trash2, Edit, FileDown, CheckSquare, Square, Users, User } from 'lucide-svelte';
	import { clsx } from 'clsx';

	interface Props {
		data: {
			struktur: Array<{
				id: number;
				nama: string;
				jabatan: string;
				foto: string | null;
				periode: string | null;
				divisiNama: string | null;
				status: 'aktif' | 'nonaktif';
			}>;
			pagination: {
				currentPage: number;
				totalPages: number;
				totalItems: number;
				itemsPerPage: number;
			};
			filters: { search: string; status: string };
		};
		form: { success?: boolean; message?: string } | null;
	}

	let { data, form }: Props = $props();
	let selectedIds = $state<number[]>([]);
	let deleteModalOpen = $state(false);
	let bulkDeleteModalOpen = $state(false);
	let deleteId = $state<number | null>(null);
	let deleteLoading = $state(false);

	$effect(() => {
		if (form?.success !== undefined) {
			form.success ? toast.success(form.message || 'Berhasil') : toast.error(form.message || 'Gagal');
			if (form.success) selectedIds = [];
		}
	});

	const allSelected = $derived(data.struktur.length > 0 && selectedIds.length === data.struktur.length);

	function toggleSelectAll() { selectedIds = allSelected ? [] : data.struktur.map((s) => s.id); }
	function toggleSelect(id: number) { selectedIds = selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]; }
	function handlePageChange(page: number) { const p = new URLSearchParams(window.location.search); p.set('page', String(page)); goto(`?${p.toString()}`); }
	function handleSearch(value: string) { const p = new URLSearchParams(window.location.search); value ? p.set('search', value) : p.delete('search'); p.set('page', '1'); goto(`?${p.toString()}`); }
	function handleStatusChange(value: string) { const p = new URLSearchParams(window.location.search); value ? p.set('status', value) : p.delete('status'); p.set('page', '1'); goto(`?${p.toString()}`); }
	function handleClearFilters() { goto('/dashboard/struktur-organisasi'); }
	function handleRefresh() { invalidateAll(); toast.success('Data diperbarui'); }
	function openDeleteModal(id: number) { deleteId = id; deleteModalOpen = true; }
	function openBulkDeleteModal() { bulkDeleteModalOpen = true; }
	async function exportData() {
		toast.info('Mengekspor...');
		const csv = [['ID', 'Nama', 'Jabatan', 'Divisi', 'Periode', 'Status'].join(','), ...data.struktur.map((s) => [s.id, `"${s.nama}"`, `"${s.jabatan}"`, s.divisiNama || '-', s.periode || '-', s.status].join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `struktur_${new Date().toISOString().split('T')[0]}.csv`; link.click();
		toast.success('Diekspor');
	}

	const statusOptions = [{ value: 'aktif', label: 'Aktif' }, { value: 'nonaktif', label: 'Nonaktif' }];
</script>

<svelte:head><title>Struktur Organisasi - Dashboard HIMA</title></svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Struktur Organisasi' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Struktur Organisasi</h1>
		</div>
		<div class="flex items-center gap-3">
			{#if selectedIds.length > 0}
				<Button variant="danger" onclick={openBulkDeleteModal}>{#snippet icon()}<Trash2 class="h-4 w-4" />{/snippet}Hapus ({selectedIds.length})</Button>
			{/if}
			<Button variant="outline" onclick={exportData}>{#snippet icon()}<FileDown class="h-4 w-4" />{/snippet}Export</Button>
			<Button href="/dashboard/struktur-organisasi/buat">{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}Tambah Anggota</Button>
		</div>
	</div>

	<div class="rounded-xl border border-slate-200 bg-white p-4">
		<SearchFilter searchValue={data.filters.search} searchPlaceholder="Cari nama..." {statusOptions} statusValue={data.filters.status} onSearch={handleSearch} onStatusChange={handleStatusChange} onRefresh={handleRefresh} onClear={handleClearFilters} />
	</div>

	<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
		{#if data.struktur.length === 0}
			<EmptyState title="Belum ada anggota" description="Tambah anggota struktur organisasi">
				{#snippet icon()}<Users class="h-8 w-8 text-slate-400" />{/snippet}
				{#snippet action()}<Button href="/dashboard/struktur-organisasi/buat">{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}Tambah Anggota</Button>{/snippet}
			</EmptyState>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead><tr class="border-b border-slate-200 bg-slate-50">
						<th class="px-4 py-3"><button onclick={toggleSelectAll} class="text-slate-500">{#if allSelected}<CheckSquare class="h-5 w-5 text-blue-600" />{:else}<Square class="h-5 w-5" />{/if}</button></th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Anggota</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Jabatan</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Divisi</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Periode</th>
						<th class="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
						<th class="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Aksi</th>
					</tr></thead>
					<tbody class="divide-y divide-slate-100">
						{#each data.struktur as item}
							{@const isSelected = selectedIds.includes(item.id)}
							<tr class={clsx('transition-colors', isSelected && 'bg-blue-50')}>
								<td class="px-4 py-3"><button onclick={() => toggleSelect(item.id)} class="text-slate-500">{#if isSelected}<CheckSquare class="h-5 w-5 text-blue-600" />{:else}<Square class="h-5 w-5" />{/if}</button></td>
								<td class="px-4 py-3">
									<div class="flex items-center gap-3">
										{#if item.foto}<img src={item.foto} alt={item.nama} class="h-10 w-10 rounded-full object-cover" />{:else}<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"><User class="h-5 w-5 text-blue-600" /></div>{/if}
										<p class="font-medium text-slate-900">{item.nama}</p>
									</div>
								</td>
								<td class="px-4 py-3 text-sm text-slate-600">{item.jabatan}</td>
								<td class="px-4 py-3 text-sm text-slate-600">{item.divisiNama || '-'}</td>
								<td class="px-4 py-3 text-sm text-slate-600">{item.periode || '-'}</td>
								<td class="px-4 py-3"><Badge variant={item.status === 'aktif' ? 'success' : 'neutral'}>{item.status}</Badge></td>
								<td class="px-4 py-3">
									<div class="flex items-center justify-end gap-1">
										<a href="/dashboard/struktur-organisasi/{item.id}/ubah" class="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Edit class="h-4 w-4" /></a>
										<button onclick={() => openDeleteModal(item.id)} class="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><Trash2 class="h-4 w-4" /></button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="border-t border-slate-200 px-4 py-3">
				<Pagination currentPage={data.pagination.currentPage} totalPages={data.pagination.totalPages} totalItems={data.pagination.totalItems} itemsPerPage={data.pagination.itemsPerPage} onPageChange={handlePageChange} />
			</div>
		{/if}
	</div>
</div>

<ConfirmDialog bind:open={deleteModalOpen} title="Hapus Anggota" message="Yakin hapus anggota ini?" confirmText="Ya, Hapus" loading={deleteLoading} onConfirm={() => { deleteLoading = true; const f = document.createElement('form'); f.method = 'POST'; f.action = '?/delete'; const i = document.createElement('input'); i.type = 'hidden'; i.name = 'id'; i.value = String(deleteId); f.appendChild(i); document.body.appendChild(f); f.submit(); }} onCancel={() => { deleteModalOpen = false; deleteId = null; }} />
<ConfirmDialog bind:open={bulkDeleteModalOpen} title="Hapus {selectedIds.length} Anggota" message="Yakin hapus anggota yang dipilih?" confirmText="Ya, Hapus" loading={deleteLoading} onConfirm={() => { deleteLoading = true; const f = document.createElement('form'); f.method = 'POST'; f.action = '?/bulkDelete'; selectedIds.forEach((id) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = 'ids'; i.value = String(id); f.appendChild(i); }); document.body.appendChild(f); f.submit(); }} onCancel={() => bulkDeleteModalOpen = false} />
