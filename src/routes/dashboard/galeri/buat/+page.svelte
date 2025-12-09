<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-svelte';

	interface Props { form: { success?: boolean; message?: string; errors?: Record<string, string>; data?: Record<string, string> } | null; }

	let { form }: Props = $props();
	let judul = $state(form?.data?.judul || '');
	let deskripsi = $state(form?.data?.deskripsi || '');
	let gambarUrl = $state(form?.data?.gambarUrl || '');
	let kategori = $state(form?.data?.kategori || '');
	let tags = $state(form?.data?.tags || '');
	let status = $state<'aktif' | 'nonaktif'>('aktif');
	let loading = $state(false);

	$effect(() => { if (form?.success !== undefined) { form.success ? (toast.success(form.message || 'Berhasil'), goto('/dashboard/galeri')) : (toast.error(form.message || 'Gagal'), loading = false); } });

	const kategoriOptions = ['Kegiatan', 'Event', 'Workshop', 'Prestasi', 'Lainnya'];
</script>

<svelte:head><title>Upload Gambar - Dashboard HIMA</title></svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Galeri', href: '/dashboard/galeri' }, { label: 'Upload' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Upload Gambar</h1>
		</div>
		<Button variant="ghost" href="/dashboard/galeri">{#snippet icon()}<ArrowLeft class="h-4 w-4" />{/snippet}Kembali</Button>
	</div>

	<form method="POST" use:enhance={() => { loading = true; return async ({ update }) => await update(); }} class="grid gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
				<div>
					<label for="gambarUrl" class="mb-1.5 block text-sm font-medium text-slate-700">URL Gambar <span class="text-red-500">*</span></label>
					<input type="url" id="gambarUrl" name="gambarUrl" bind:value={gambarUrl} required placeholder="https://example.com/image.jpg" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				{#if gambarUrl}
					<div class="relative"><img src={gambarUrl} alt="Preview" class="max-h-64 w-full rounded-lg object-contain bg-slate-100" /><button type="button" onclick={() => gambarUrl = ''} class="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white"><X class="h-4 w-4" /></button></div>
				{:else}
					<div class="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50"><div class="text-center"><ImageIcon class="mx-auto h-10 w-10 text-slate-400" /><p class="mt-2 text-sm text-slate-500">Masukkan URL gambar</p></div></div>
				{/if}
				<div>
					<label for="judul" class="mb-1.5 block text-sm font-medium text-slate-700">Judul</label>
					<input type="text" id="judul" name="judul" bind:value={judul} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<div>
					<label for="deskripsi" class="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi</label>
					<textarea id="deskripsi" name="deskripsi" bind:value={deskripsi} rows={3} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
				<h3 class="font-semibold text-slate-900">Pengaturan</h3>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-slate-700">Kategori</label>
					<select name="kategori" bind:value={kategori} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
						<option value="">Pilih Kategori</option>
						{#each kategoriOptions as k}<option value={k}>{k}</option>{/each}
					</select>
				</div>
				<div>
					<label for="tags" class="mb-1.5 block text-sm font-medium text-slate-700">Tags</label>
					<input type="text" id="tags" name="tags" bind:value={tags} placeholder="tag1, tag2, tag3" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
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
