<script lang="ts">
	import { Mail, Phone, MapPin, Send } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Header, Footer } from '$lib/components/public';
	import { Toaster } from 'svelte-sonner';

	interface Props {
		data: { pengaturan: Record<string, string> };
		form: { success?: boolean; message?: string } | null;
	}

	let { data, form }: Props = $props();
	const pengaturan = $derived(data.pengaturan);

	let nama = $state('');
	let email = $state('');
	let subjek = $state('');
	let pesan = $state('');
	let loading = $state(false);

	$effect(() => {
		if (form?.success !== undefined) {
			form.success ? toast.success(form.message || 'Pesan terkirim') : toast.error(form.message || 'Gagal mengirim');
			loading = false;
			if (form.success) { nama = ''; email = ''; subjek = ''; pesan = ''; }
		}
	});
</script>

<svelte:head>
	<title>Kontak - HIMA Informatika</title>
	<meta name="description" content="Hubungi HIMA Informatika" />
</svelte:head>

<Toaster position="top-right" richColors />
<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-slate-50">
	<div class="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20">
		<div class="container mx-auto px-6 text-center">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
			<p class="text-xl text-teal-100 max-w-2xl mx-auto">Kami siap membantu dan menjawab pertanyaan Anda</p>
		</div>
	</div>

	<div class="container mx-auto px-6 py-16">
		<div class="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
			<!-- Contact Info -->
			<div>
				<h2 class="text-2xl font-bold text-slate-900 mb-6">Informasi Kontak</h2>
				<div class="space-y-6">
					{#if pengaturan.email}
						<div class="flex items-start gap-4">
							<div class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
								<Mail class="w-6 h-6 text-teal-600" />
							</div>
							<div>
								<h3 class="font-medium text-slate-900">Email</h3>
								<p class="text-slate-600">{pengaturan.email}</p>
							</div>
						</div>
					{/if}
					{#if pengaturan.telepon}
						<div class="flex items-start gap-4">
							<div class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
								<Phone class="w-6 h-6 text-teal-600" />
							</div>
							<div>
								<h3 class="font-medium text-slate-900">Telepon</h3>
								<p class="text-slate-600">{pengaturan.telepon}</p>
							</div>
						</div>
					{/if}
					{#if pengaturan.alamat}
						<div class="flex items-start gap-4">
							<div class="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
								<MapPin class="w-6 h-6 text-teal-600" />
							</div>
							<div>
								<h3 class="font-medium text-slate-900">Alamat</h3>
								<p class="text-slate-600">{pengaturan.alamat}</p>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Contact Form -->
			<div class="bg-white rounded-2xl p-8 shadow-sm">
				<h2 class="text-2xl font-bold text-slate-900 mb-6">Kirim Pesan</h2>
				<form method="POST" use:enhance={() => { loading = true; return async ({ update }) => await update(); }} class="space-y-4">
					<div class="grid sm:grid-cols-2 gap-4">
						<div>
							<label for="nama" class="block text-sm font-medium text-slate-700 mb-1">Nama</label>
							<input type="text" id="nama" name="nama" bind:value={nama} required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none" />
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-slate-700 mb-1">Email</label>
							<input type="email" id="email" name="email" bind:value={email} required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none" />
						</div>
					</div>
					<div>
						<label for="subjek" class="block text-sm font-medium text-slate-700 mb-1">Subjek</label>
						<input type="text" id="subjek" name="subjek" bind:value={subjek} required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none" />
					</div>
					<div>
						<label for="pesan" class="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
						<textarea id="pesan" name="pesan" bind:value={pesan} rows={5} required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:outline-none"></textarea>
					</div>
					<button type="submit" disabled={loading} class="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
						{#if loading}
							<span class="animate-spin">⏳</span> Mengirim...
						{:else}
							<Send class="w-5 h-5" /> Kirim Pesan
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<Footer {pengaturan} />
