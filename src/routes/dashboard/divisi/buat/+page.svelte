<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-svelte';

	interface Props {
		form: {
			success?: boolean;
			message?: string;
			errors?: Record<string, string>;
			data?: Record<string, string>;
		} | null;
	}

	let { form }: Props = $props();

	let nama = $state(form?.data?.nama || '');
	let slug = $state('');
	let deskripsi = $state(form?.data?.deskripsi || '');
	let ikon = $state(form?.data?.ikon || '');
	let gambarBanner = $state(form?.data?.gambarBanner || '');
	let urutan = $state(form?.data?.urutan || '0');
	let status = $state<'aktif' | 'nonaktif'>('aktif');
	let loading = $state(false);

	$effect(() => {
		slug = nama
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')
			.trim();
	});

	$effect(() => {
		if (form?.success !== undefined) {
			if (form.success) {
				toast.success(form.message || 'Divisi berhasil dibuat');
				goto('/dashboard/divisi');
			} else {
				toast.error(form.message || 'Terjadi kesalahan');
				loading = false;
			}
		}
	});

	const iconOptions = [
		'Code', 'Palette', 'Video', 'Megaphone', 'Users', 'BookOpen', 
		'Trophy', 'Globe', 'Camera', 'Music', 'Gamepad2', 'Cpu'
	];
</script>

<svelte:head>
	<title>Tambah Divisi - Dashboard HIMA</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Divisi', href: '/dashboard/divisi' }, { label: 'Buat Baru' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Tambah Divisi</h1>
		</div>
		<Button variant="ghost" href="/dashboard/divisi">
			{#snippet icon()}<ArrowLeft class="h-4 w-4" />{/snippet}
			Kembali
		</Button>
	</div>

	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
			};
		}}
		class="grid gap-6 lg:grid-cols-3"
	>
		<div class="space-y-6 lg:col-span-2">
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<div class="space-y-4">
					<div>
						<label for="nama" class="mb-1.5 block text-sm font-medium text-slate-700">
							Nama Divisi <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="nama"
							name="nama"
							bind:value={nama}
							required
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="Contoh: Pemrograman"
						/>
						{#if form?.errors?.nama}
							<p class="mt-1 text-sm text-red-500">{form.errors.nama}</p>
						{/if}
					</div>

					<div>
						<label for="slug" class="mb-1.5 block text-sm font-medium text-slate-700">Slug URL</label>
						<div class="flex items-center">
							<span class="rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
								/divisi/
							</span>
							<input
								type="text"
								id="slug"
								name="slug"
								bind:value={slug}
								required
								class="flex-1 rounded-r-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
					</div>

					<div>
						<label for="deskripsi" class="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi</label>
						<textarea
							id="deskripsi"
							name="deskripsi"
							bind:value={deskripsi}
							rows={5}
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="Deskripsi singkat tentang divisi..."
						></textarea>
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Pengaturan</h3>
				<div class="space-y-4">
					<div>
						<label class="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
						<select
							name="status"
							bind:value={status}
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="aktif">Aktif</option>
							<option value="nonaktif">Nonaktif</option>
						</select>
					</div>

					<div>
						<label for="urutan" class="mb-1.5 block text-sm font-medium text-slate-700">Urutan</label>
						<input
							type="number"
							id="urutan"
							name="urutan"
							bind:value={urutan}
							min="0"
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						/>
					</div>

					<Button type="submit" fullWidth {loading}>
						{#snippet icon()}<Save class="h-4 w-4" />{/snippet}
						Simpan Divisi
					</Button>
				</div>
			</div>

			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Ikon</h3>
				<select
					name="ikon"
					bind:value={ikon}
					class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="">Pilih Ikon</option>
					{#each iconOptions as icon}
						<option value={icon}>{icon}</option>
					{/each}
				</select>
			</div>

			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Gambar Banner</h3>
				<input
					type="text"
					name="gambarBanner"
					bind:value={gambarBanner}
					placeholder="URL gambar banner..."
					class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				/>
				{#if gambarBanner}
					<div class="relative mt-3">
						<img src={gambarBanner} alt="Preview" class="h-32 w-full rounded-lg object-cover" />
						<button
							type="button"
							onclick={() => (gambarBanner = '')}
							class="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
						>
							<X class="h-4 w-4" />
						</button>
					</div>
				{:else}
					<div class="mt-3 flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
						<ImageIcon class="h-6 w-6 text-slate-400" />
					</div>
				{/if}
			</div>
		</div>
	</form>
</div>
