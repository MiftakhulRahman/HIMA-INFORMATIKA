<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, ArrowLeft, Image as ImageIcon, X } from 'lucide-svelte';

	interface Props {
		data: {
			berita: {
				id: number;
				judul: string;
				slug: string;
				ringkasan: string | null;
				konten: string | null;
				kategori: string | null;
				tags: string[] | null;
				gambarUtama: string | null;
				status: 'draft' | 'published';
			};
		};
		form: {
			success?: boolean;
			message?: string;
			errors?: Record<string, string>;
		} | null;
	}

	let { data, form }: Props = $props();

	// Form data - initialized from server data
	let judul = $state(data.berita.judul);
	let slug = $state(data.berita.slug);
	let ringkasan = $state(data.berita.ringkasan || '');
	let konten = $state(data.berita.konten || '');
	let kategori = $state(data.berita.kategori || '');
	let tags = $state(data.berita.tags?.join(', ') || '');
	let gambarUtama = $state(data.berita.gambarUtama || '');
	let status = $state<'draft' | 'published'>(data.berita.status);
	let loading = $state(false);

	// Show toast on form result
	$effect(() => {
		if (form?.success !== undefined) {
			if (form.success) {
				toast.success(form.message || 'Berita berhasil diperbarui');
				goto('/dashboard/berita');
			} else {
				toast.error(form.message || 'Terjadi kesalahan');
				loading = false;
			}
		}
	});

	// Category suggestions
	const kategoris = ['Pengumuman', 'Kegiatan', 'Prestasi', 'Tutorial', 'Artikel', 'Event'];
</script>

<svelte:head>
	<title>Edit Berita - Dashboard HIMA</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<Breadcrumb
				items={[{ label: 'Berita', href: '/dashboard/berita' }, { label: 'Edit' }]}
			/>
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Edit Berita</h1>
		</div>
		<Button variant="ghost" href="/dashboard/berita">
			{#snippet icon()}<ArrowLeft class="h-4 w-4" />{/snippet}
			Kembali
		</Button>
	</div>

	<!-- Form -->
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
		<!-- Hidden ID -->
		<input type="hidden" name="id" value={data.berita.id} />

		<!-- Main Content -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Title & Slug -->
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<div class="space-y-4">
					<div>
						<label for="judul" class="mb-1.5 block text-sm font-medium text-slate-700">
							Judul Berita <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="judul"
							name="judul"
							bind:value={judul}
							required
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="Masukkan judul berita"
						/>
						{#if form?.errors?.judul}
							<p class="mt-1 text-sm text-red-500">{form.errors.judul}</p>
						{/if}
					</div>

					<div>
						<label for="slug" class="mb-1.5 block text-sm font-medium text-slate-700">
							Slug URL
						</label>
						<div class="flex items-center">
							<span class="rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
								/berita/
							</span>
							<input
								type="text"
								id="slug"
								name="slug"
								bind:value={slug}
								required
								class="flex-1 rounded-r-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
						{#if form?.errors?.slug}
							<p class="mt-1 text-sm text-red-500">{form.errors.slug}</p>
						{/if}
					</div>
				</div>
			</div>

			<!-- Ringkasan -->
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<label for="ringkasan" class="mb-1.5 block text-sm font-medium text-slate-700">
					Ringkasan
				</label>
				<textarea
					id="ringkasan"
					name="ringkasan"
					bind:value={ringkasan}
					rows={3}
					class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					placeholder="Ringkasan singkat berita..."
				></textarea>
				<p class="mt-1 text-xs text-slate-500">
					{ringkasan.length}/200 karakter (maksimal)
				</p>
			</div>

			<!-- Konten -->
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<label for="konten" class="mb-1.5 block text-sm font-medium text-slate-700">
					Konten Berita <span class="text-red-500">*</span>
				</label>
				<textarea
					id="konten"
					name="konten"
					bind:value={konten}
					rows={15}
					required
					class="w-full rounded-lg border border-slate-300 px-4 py-2.5 font-mono text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					placeholder="Tulis konten berita... (mendukung HTML)"
				></textarea>
				<p class="mt-1 text-xs text-slate-500">
					Mendukung format HTML untuk styling konten
				</p>
			</div>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Publish Box -->
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Publikasi</h3>
				<div class="space-y-4">
					<div>
						<label class="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
						<select
							name="status"
							bind:value={status}
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
						</select>
					</div>

					<div class="flex gap-2">
						<Button type="submit" fullWidth {loading}>
							{#snippet icon()}<Save class="h-4 w-4" />{/snippet}
							Simpan Perubahan
						</Button>
					</div>
				</div>
			</div>

			<!-- Gambar Utama -->
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Gambar Utama</h3>
				<div>
					<input
						type="text"
						name="gambarUtama"
						bind:value={gambarUtama}
						placeholder="URL gambar..."
						class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
					/>
					{#if gambarUtama}
						<div class="relative mt-3">
							<img
								src={gambarUtama}
								alt="Preview"
								class="h-40 w-full rounded-lg object-cover"
								onerror={(e) => {
									(e.target as HTMLImageElement).style.display = 'none';
								}}
							/>
							<button
								type="button"
								onclick={() => (gambarUtama = '')}
								class="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
							>
								<X class="h-4 w-4" />
							</button>
						</div>
					{:else}
						<div class="mt-3 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
							<div class="text-center">
								<ImageIcon class="mx-auto h-8 w-8 text-slate-400" />
								<p class="mt-1 text-xs text-slate-500">Masukkan URL gambar</p>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Kategori -->
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Kategori</h3>
				<select
					name="kategori"
					bind:value={kategori}
					class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				>
					<option value="">Pilih Kategori</option>
					{#each kategoris as kat}
						<option value={kat}>{kat}</option>
					{/each}
				</select>
			</div>

			<!-- Tags -->
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<h3 class="mb-4 font-semibold text-slate-900">Tags</h3>
				<input
					type="text"
					name="tags"
					bind:value={tags}
					placeholder="tag1, tag2, tag3..."
					class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
				/>
				<p class="mt-1 text-xs text-slate-500">Pisahkan dengan koma</p>
			</div>
		</div>
	</form>
</div>
