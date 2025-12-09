<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, ArrowLeft, User, X } from 'lucide-svelte';

	interface Props {
		data: { divisiList: Array<{ id: number; nama: string }> };
		form: { success?: boolean; message?: string; errors?: Record<string, string>; data?: Record<string, string> } | null;
	}

	let { data, form }: Props = $props();
	let nama = $state(form?.data?.nama || '');
	let jabatan = $state(form?.data?.jabatan || '');
	let divisiId = $state(form?.data?.divisiId || '');
	let foto = $state(form?.data?.foto || '');
	let email = $state(form?.data?.email || '');
	let instagram = $state(form?.data?.instagram || '');
	let linkedin = $state(form?.data?.linkedin || '');
	let periode = $state(form?.data?.periode || '');
	let urutan = $state(form?.data?.urutan || '0');
	let status = $state<'aktif' | 'nonaktif'>('aktif');
	let loading = $state(false);

	$effect(() => {
		if (form?.success !== undefined) {
			form.success ? (toast.success(form.message || 'Berhasil'), goto('/dashboard/struktur-organisasi')) : (toast.error(form.message || 'Gagal'), loading = false);
		}
	});
</script>

<svelte:head><title>Tambah Anggota - Dashboard HIMA</title></svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Struktur Organisasi', href: '/dashboard/struktur-organisasi' }, { label: 'Buat Baru' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Tambah Anggota</h1>
		</div>
		<Button variant="ghost" href="/dashboard/struktur-organisasi">{#snippet icon()}<ArrowLeft class="h-4 w-4" />{/snippet}Kembali</Button>
	</div>

	<form method="POST" use:enhance={() => { loading = true; return async ({ update }) => await update(); }} class="grid gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="nama" class="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap <span class="text-red-500">*</span></label>
						<input type="text" id="nama" name="nama" bind:value={nama} required class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
					<div>
						<label for="jabatan" class="mb-1.5 block text-sm font-medium text-slate-700">Jabatan <span class="text-red-500">*</span></label>
						<input type="text" id="jabatan" name="jabatan" bind:value={jabatan} required class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Ketua, Wakil Ketua, dll" />
					</div>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label class="mb-1.5 block text-sm font-medium text-slate-700">Divisi</label>
						<select name="divisiId" bind:value={divisiId} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
							<option value="">Tidak Ada / Pengurus Inti</option>
							{#each data.divisiList as d}<option value={d.id}>{d.nama}</option>{/each}
						</select>
					</div>
					<div>
						<label for="periode" class="mb-1.5 block text-sm font-medium text-slate-700">Periode</label>
						<input type="text" id="periode" name="periode" bind:value={periode} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="2024/2025" />
					</div>
				</div>
				<div>
					<label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
					<input type="email" id="email" name="email" bind:value={email} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="instagram" class="mb-1.5 block text-sm font-medium text-slate-700">Instagram</label>
						<input type="text" id="instagram" name="instagram" bind:value={instagram} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="@username" />
					</div>
					<div>
						<label for="linkedin" class="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn</label>
						<input type="text" id="linkedin" name="linkedin" bind:value={linkedin} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="linkedin.com/in/username" />
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
				<h3 class="font-semibold text-slate-900">Pengaturan</h3>
				<div>
					<label class="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
					<select name="status" bind:value={status} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
						<option value="aktif">Aktif</option>
						<option value="nonaktif">Nonaktif</option>
					</select>
				</div>
				<div>
					<label for="urutan" class="mb-1.5 block text-sm font-medium text-slate-700">Urutan</label>
					<input type="number" id="urutan" name="urutan" bind:value={urutan} min="0" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<Button type="submit" fullWidth {loading}>{#snippet icon()}<Save class="h-4 w-4" />{/snippet}Simpan</Button>
			</div>
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Foto</h3>
				<input type="text" name="foto" bind:value={foto} placeholder="URL foto..." class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				{#if foto}
					<div class="relative mt-3"><img src={foto} alt="Preview" class="h-32 w-32 rounded-full mx-auto object-cover" /><button type="button" onclick={() => foto = ''} class="absolute right-1/4 top-0 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"><X class="h-4 w-4" /></button></div>
				{:else}
					<div class="mt-3 flex h-24 w-24 mx-auto items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50"><User class="h-8 w-8 text-slate-400" /></div>
				{/if}
			</div>
		</div>
	</form>
</div>
