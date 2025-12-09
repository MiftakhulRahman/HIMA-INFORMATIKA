<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button, ConfirmDialog, EmptyState } from '$lib/components/dashboard';
	import { Plus, Trash2, Edit, FileDown, CheckSquare, Square, Image as ImageIcon, X } from 'lucide-svelte';
	import { clsx } from 'clsx';

	interface Props {
		data: {
			galeri: Array<{ id: number; judul: string | null; gambarUrl: string; kategori: string | null; status: 'aktif' | 'nonaktif' }>;
			pagination: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number };
			filters: { search: string };
		};
		form: { success?: boolean; message?: string } | null;
	}

	let { data, form }: Props = $props();
	let selectedIds = $state<number[]>([]);
	let deleteModalOpen = $state(false);
	let bulkDeleteModalOpen = $state(false);
	let deleteId = $state<number | null>(null);
	let deleteLoading = $state(false);
	let lightboxOpen = $state(false);
	let lightboxImage = $state('');

	$effect(() => { if (form?.success !== undefined) { form.success ? toast.success(form.message || 'Berhasil') : toast.error(form.message || 'Gagal'); if (form.success) selectedIds = []; } });

	const allSelected = $derived(data.galeri.length > 0 && selectedIds.length === data.galeri.length);
	function toggleSelectAll() { selectedIds = allSelected ? [] : data.galeri.map((g) => g.id); }
	function toggleSelect(id: number) { selectedIds = selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]; }
	function handlePageChange(page: number) { const p = new URLSearchParams(window.location.search); p.set('page', String(page)); goto(`?${p.toString()}`); }
	function handleSearch(value: string) { const p = new URLSearchParams(window.location.search); value ? p.set('search', value) : p.delete('search'); p.set('page', '1'); goto(`?${p.toString()}`); }
	function handleClearFilters() { goto('/dashboard/galeri'); }
	function handleRefresh() { invalidateAll(); toast.success('Data diperbarui'); }
	function openDeleteModal(id: number) { deleteId = id; deleteModalOpen = true; }
	function openBulkDeleteModal() { bulkDeleteModalOpen = true; }
	function openLightbox(url: string) { lightboxImage = url; lightboxOpen = true; }
</script>

<svelte:head><title>Kelola Galeri - Dashboard HIMA</title></svelte:head>

<div class="space-y-6">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Galeri' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Kelola Galeri</h1>
		</div>
		<div class="flex items-center gap-3">
			{#if selectedIds.length > 0}<Button variant="danger" onclick={openBulkDeleteModal}>{#snippet icon()}<Trash2 class="h-4 w-4" />{/snippet}Hapus ({selectedIds.length})</Button>{/if}
			<Button variant="outline" onclick={handleRefresh}>{#snippet icon()}<FileDown class="h-4 w-4" />{/snippet}Refresh</Button>
			<Button href="/dashboard/galeri/buat">{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}Upload Gambar</Button>
		</div>
	</div>

	<div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
		{#if data.galeri.length === 0}
			<EmptyState title="Belum ada gambar" description="Upload gambar pertama">
				{#snippet icon()}<ImageIcon class="h-8 w-8 text-slate-400" />{/snippet}
				{#snippet action()}<Button href="/dashboard/galeri/buat">{#snippet icon()}<Plus class="h-4 w-4" />{/snippet}Upload Gambar</Button>{/snippet}
			</EmptyState>
		{:else}
			<div class="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
				{#each data.galeri as item}
					{@const isSelected = selectedIds.includes(item.id)}
					<div class={clsx('group relative overflow-hidden rounded-lg border-2 transition-all', isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent hover:border-slate-300')}>
						<button onclick={() => openLightbox(item.gambarUrl)} class="block aspect-square w-full">
							<img src={item.gambarUrl} alt={item.judul || 'Gambar'} class="h-full w-full object-cover" />
						</button>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
						<button onclick={() => toggleSelect(item.id)} class="absolute left-2 top-2 rounded bg-white/90 p-1 opacity-0 transition-opacity group-hover:opacity-100">
							{#if isSelected}<CheckSquare class="h-5 w-5 text-blue-600" />{:else}<Square class="h-5 w-5 text-slate-600" />{/if}
						</button>
						<div class="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
							<p class="truncate text-sm font-medium text-white">{item.judul || 'Tanpa judul'}</p>
							<div class="flex gap-1">
								<a href="/dashboard/galeri/{item.id}/ubah" class="rounded bg-white/90 p-1.5 text-slate-600 hover:bg-white"><Edit class="h-4 w-4" /></a>
								<button onclick={() => openDeleteModal(item.id)} class="rounded bg-white/90 p-1.5 text-red-600 hover:bg-white"><Trash2 class="h-4 w-4" /></button>
							</div>
						</div>
					</div>
				{/each}
			</div>
			{#if data.pagination.totalPages > 1}
				<div class="border-t border-slate-200 px-4 py-3">
					<div class="flex justify-center gap-2">
						{#each Array(data.pagination.totalPages) as _, i}
							<button onclick={() => handlePageChange(i + 1)} class={clsx('rounded-lg px-3 py-1 text-sm', data.pagination.currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}>{i + 1}</button>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Lightbox -->
{#if lightboxOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onclick={() => lightboxOpen = false}>
		<button onclick={() => lightboxOpen = false} class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"><X class="h-6 w-6" /></button>
		<img src={lightboxImage} alt="Preview" class="max-h-full max-w-full object-contain" />
	</div>
{/if}

<ConfirmDialog bind:open={deleteModalOpen} title="Hapus Gambar" message="Yakin hapus?" confirmText="Ya, Hapus" loading={deleteLoading} onConfirm={() => { deleteLoading = true; const f = document.createElement('form'); f.method = 'POST'; f.action = '?/delete'; const i = document.createElement('input'); i.type = 'hidden'; i.name = 'id'; i.value = String(deleteId); f.appendChild(i); document.body.appendChild(f); f.submit(); }} onCancel={() => { deleteModalOpen = false; deleteId = null; }} />
<ConfirmDialog bind:open={bulkDeleteModalOpen} title="Hapus {selectedIds.length} Gambar" message="Yakin hapus yang dipilih?" confirmText="Ya, Hapus" loading={deleteLoading} onConfirm={() => { deleteLoading = true; const f = document.createElement('form'); f.method = 'POST'; f.action = '?/bulkDelete'; selectedIds.forEach((id) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = 'ids'; i.value = String(id); f.appendChild(i); }); document.body.appendChild(f); f.submit(); }} onCancel={() => bulkDeleteModalOpen = false} />
