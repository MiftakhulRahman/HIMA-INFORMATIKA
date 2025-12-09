<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, ArrowLeft } from 'lucide-svelte';

	interface Props {
		data: {
			dokumen: { id: number; judul: string; slug: string; deskripsi: string | null; kategori: 'AD/ART' | 'Surat Keputusan' | 'Laporan' | 'Lainnya'; fileUrl: string; fileNama: string | null; status: 'aktif' | 'nonaktif' };
		};
		form: { success?: boolean; message?: string; errors?: Record<string, string> } | null;
	}

	let { data, form }: Props = $props();
	let judul = $state(data.dokumen.judul);
	let slug = $state(data.dokumen.slug);
	let deskripsi = $state(data.dokumen.deskripsi || '');
	let kategori = $state<'AD/ART' | 'Surat Keputusan' | 'Laporan' | 'Lainnya'>(data.dokumen.kategori);
	let fileUrl = $state(data.dokumen.fileUrl);
	let fileNama = $state(data.dokumen.fileNama || '');
	let status = $state<'aktif' | 'nonaktif'>(data.dokumen.status);
	let loading = $state(false);

	$effect(() => { if (form?.success !== undefined) { form.success ? (toast.success(form.message || 'Berhasil'), goto('/dashboard/dokumen')) : (toast.error(form.message || 'Gagal'), loading = false); } });
</script>

<svelte:head><title>Edit Dokumen - Dashboard HIMA</title></svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Dokumen', href: '/dashboard/dokumen' }, { label: 'Edit' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Edit Dokumen</h1>
		</div>
		<Button variant="ghost" href="/dashboard/dokumen">{#snippet icon()}<ArrowLeft class="h-4 w-4" />{/snippet}Kembali</Button>
	</div>

	<form method="POST" use:enhance={() => { loading = true; return async ({ update }) => await update(); }} class="grid gap-6 lg:grid-cols-3">
		<input type="hidden" name="id" value={data.dokumen.id} />
		<div class="space-y-6 lg:col-span-2">
			<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
				<div>
					<label for="judul" class="mb-1.5 block text-sm font-medium text-slate-700">Judul</label>
					<input type="text" id="judul" name="judul" bind:value={judul} required class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<div>
					<label for="slug" class="mb-1.5 block text-sm font-medium text-slate-700">Slug URL</label>
					<input type="text" id="slug" name="slug" bind:value={slug} required class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<div>
					<label for="deskripsi" class="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi</label>
					<textarea id="deskripsi" name="deskripsi" bind:value={deskripsi} rows={3} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
				</div>
				<div>
					<label for="fileUrl" class="mb-1.5 block text-sm font-medium text-slate-700">URL File</label>
					<input type="url" id="fileUrl" name="fileUrl" bind:value={fileUrl} required class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<div>
					<label for="fileNama" class="mb-1.5 block text-sm font-medium text-slate-700">Nama File</label>
					<input type="text" id="fileNama" name="fileNama" bind:value={fileNama} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
			</div>
		</div>
		<div class="space-y-6">
			<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
				<h3 class="font-semibold text-slate-900">Pengaturan</h3>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-slate-700">Kategori</label>
					<select name="kategori" bind:value={kategori} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
						<option value="AD/ART">AD/ART</option>
						<option value="Surat Keputusan">Surat Keputusan</option>
						<option value="Laporan">Laporan</option>
						<option value="Lainnya">Lainnya</option>
					</select>
				</div>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
					<select name="status" bind:value={status} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
						<option value="aktif">Aktif</option>
						<option value="nonaktif">Nonaktif</option>
					</select>
				</div>
				<Button type="submit" fullWidth {loading}>{#snippet icon()}<Save class="h-4 w-4" />{/snippet}Simpan</Button>
			</div>
		</div>
	</form>
</div>
