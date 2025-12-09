<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, ArrowLeft } from 'lucide-svelte';

	interface Props {
		data: {
			divisiList: Array<{ id: number; nama: string }>;
		};
		form: {
			success?: boolean;
			message?: string;
			errors?: Record<string, string>;
			data?: Record<string, string>;
		} | null;
	}

	let { data, form }: Props = $props();

	let judul = $state(form?.data?.judul || '');
	let deskripsi = $state(form?.data?.deskripsi || '');
	let divisiId = $state(form?.data?.divisiId || '');
	let tahun = $state(form?.data?.tahun || String(new Date().getFullYear()));
	let periode = $state(form?.data?.periode || '');
	let target = $state(form?.data?.target || '');
	let status = $state<'rencana' | 'berjalan' | 'selesai'>('rencana');
	let urutan = $state('0');
	let loading = $state(false);

	$effect(() => {
		if (form?.success !== undefined) {
			if (form.success) {
				toast.success(form.message || 'Program kerja berhasil dibuat');
				goto('/dashboard/program-kerja');
			} else {
				toast.error(form.message || 'Terjadi kesalahan');
				loading = false;
			}
		}
	});
</script>

<svelte:head>
	<title>Tambah Program Kerja - Dashboard HIMA</title>
</svelte:head>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<Breadcrumb items={[{ label: 'Program Kerja', href: '/dashboard/program-kerja' }, { label: 'Buat Baru' }]} />
			<h1 class="mt-2 text-2xl font-bold text-slate-900">Tambah Program Kerja</h1>
		</div>
		<Button variant="ghost" href="/dashboard/program-kerja">
			{#snippet icon()}<ArrowLeft class="h-4 w-4" />{/snippet}
			Kembali
		</Button>
	</div>

	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => await update();
		}}
		class="grid gap-6 lg:grid-cols-3"
	>
		<div class="space-y-6 lg:col-span-2">
			<div class="rounded-xl border border-slate-200 bg-white p-6">
				<div class="space-y-4">
					<div>
						<label for="judul" class="mb-1.5 block text-sm font-medium text-slate-700">
							Judul Program Kerja <span class="text-red-500">*</span>
						</label>
						<input
							type="text"
							id="judul"
							name="judul"
							bind:value={judul}
							required
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="Contoh: Workshop Programming 2024"
						/>
						{#if form?.errors?.judul}
							<p class="mt-1 text-sm text-red-500">{form.errors.judul}</p>
						{/if}
					</div>

					<div>
						<label for="deskripsi" class="mb-1.5 block text-sm font-medium text-slate-700">Deskripsi</label>
						<textarea
							id="deskripsi"
							name="deskripsi"
							bind:value={deskripsi}
							rows={4}
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="Deskripsi detail program kerja..."
						></textarea>
					</div>

					<div>
						<label for="target" class="mb-1.5 block text-sm font-medium text-slate-700">Target</label>
						<textarea
							id="target"
							name="target"
							bind:value={target}
							rows={3}
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							placeholder="Target yang ingin dicapai..."
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
						<label class="mb-1.5 block text-sm font-medium text-slate-700">Divisi</label>
						<select
							name="divisiId"
							bind:value={divisiId}
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="">Semua Divisi (Umum)</option>
							{#each data.divisiList as d}
								<option value={d.id}>{d.nama}</option>
							{/each}
						</select>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label for="tahun" class="mb-1.5 block text-sm font-medium text-slate-700">Tahun</label>
							<input
								type="number"
								id="tahun"
								name="tahun"
								bind:value={tahun}
								min="2020"
								max="2030"
								class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
						<div>
							<label for="periode" class="mb-1.5 block text-sm font-medium text-slate-700">Periode</label>
							<input
								type="text"
								id="periode"
								name="periode"
								bind:value={periode}
								placeholder="2024/2025"
								class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
							/>
						</div>
					</div>

					<div>
						<label class="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
						<select
							name="status"
							bind:value={status}
							class="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
						>
							<option value="rencana">Rencana</option>
							<option value="berjalan">Berjalan</option>
							<option value="selesai">Selesai</option>
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
						Simpan Program Kerja
					</Button>
				</div>
			</div>
		</div>
	</form>
</div>
