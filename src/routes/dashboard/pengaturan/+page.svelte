<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, Globe, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Linkedin, X, Image as ImageIcon } from 'lucide-svelte';

	interface Props {
		data: {
			pengaturan: Record<string, string>;
		};
		form: { success?: boolean; message?: string } | null;
	}

	let { data, form }: Props = $props();
	
	// General settings
	let namaSitus = $state(data.pengaturan.nama_situs || '');
	let tagline = $state(data.pengaturan.tagline || '');
	let logoUrl = $state(data.pengaturan.logo_url || '');
	let faviconUrl = $state(data.pengaturan.favicon_url || '');
	
	// Contact settings
	let email = $state(data.pengaturan.email || '');
	let telepon = $state(data.pengaturan.telepon || '');
	let alamat = $state(data.pengaturan.alamat || '');
	
	// Social media
	let facebook = $state(data.pengaturan.facebook || '');
	let instagram = $state(data.pengaturan.instagram || '');
	let twitter = $state(data.pengaturan.twitter || '');
	let youtube = $state(data.pengaturan.youtube || '');
	let linkedin = $state(data.pengaturan.linkedin || '');
	
	let loading = $state(false);

	$effect(() => {
		if (form?.success !== undefined) {
			form.success ? toast.success(form.message || 'Berhasil') : toast.error(form.message || 'Gagal');
			loading = false;
		}
	});
</script>

<svelte:head><title>Pengaturan Situs - Dashboard HIMA</title></svelte:head>

<div class="space-y-6">
	<div>
		<Breadcrumb items={[{ label: 'Pengaturan' }]} />
		<h1 class="mt-2 text-2xl font-bold text-slate-900">Pengaturan Situs</h1>
	</div>

	<form method="POST" use:enhance={() => { loading = true; return async ({ update }) => await update(); }} class="space-y-6">
		<!-- General Settings -->
		<div class="rounded-xl border border-slate-200 bg-white p-6">
			<div class="flex items-center gap-2 mb-4">
				<Globe class="h-5 w-5 text-blue-600" />
				<h3 class="font-semibold text-slate-900">Informasi Umum</h3>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="namaSitus" class="mb-1.5 block text-sm font-medium text-slate-700">Nama Situs</label>
					<input type="text" id="namaSitus" name="nama_situs" bind:value={namaSitus} placeholder="HIMA Informatika" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<div>
					<label for="tagline" class="mb-1.5 block text-sm font-medium text-slate-700">Tagline</label>
					<input type="text" id="tagline" name="tagline" bind:value={tagline} placeholder="Bersama Menuju Kesuksesan" class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
				</div>
				<div>
					<label for="logoUrl" class="mb-1.5 block text-sm font-medium text-slate-700">URL Logo</label>
					<input type="url" id="logoUrl" name="logo_url" bind:value={logoUrl} placeholder="https://..." class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					{#if logoUrl}
						<div class="mt-2 relative inline-block"><img src={logoUrl} alt="Logo" class="h-16 rounded" /><button type="button" onclick={() => logoUrl = ''} class="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white"><X class="h-3 w-3" /></button></div>
					{/if}
				</div>
				<div>
					<label for="faviconUrl" class="mb-1.5 block text-sm font-medium text-slate-700">URL Favicon</label>
					<input type="url" id="faviconUrl" name="favicon_url" bind:value={faviconUrl} placeholder="https://..." class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					{#if faviconUrl}
						<div class="mt-2 relative inline-block"><img src={faviconUrl} alt="Favicon" class="h-8 rounded" /><button type="button" onclick={() => faviconUrl = ''} class="absolute -right-2 -top-2 rounded-full bg-red-500 p-0.5 text-white"><X class="h-3 w-3" /></button></div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Contact Settings -->
		<div class="rounded-xl border border-slate-200 bg-white p-6">
			<div class="flex items-center gap-2 mb-4">
				<Phone class="h-5 w-5 text-green-600" />
				<h3 class="font-semibold text-slate-900">Informasi Kontak</h3>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
					<div class="relative">
						<Mail class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
						<input type="email" id="email" name="email" bind:value={email} placeholder="hima@univ.ac.id" class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
				</div>
				<div>
					<label for="telepon" class="mb-1.5 block text-sm font-medium text-slate-700">Telepon</label>
					<div class="relative">
						<Phone class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
						<input type="tel" id="telepon" name="telepon" bind:value={telepon} placeholder="+62..." class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
				</div>
				<div class="sm:col-span-2">
					<label for="alamat" class="mb-1.5 block text-sm font-medium text-slate-700">Alamat</label>
					<div class="relative">
						<MapPin class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
						<textarea id="alamat" name="alamat" bind:value={alamat} rows={2} placeholder="Jl. ..." class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"></textarea>
					</div>
				</div>
			</div>
		</div>

		<!-- Social Media -->
		<div class="rounded-xl border border-slate-200 bg-white p-6">
			<div class="flex items-center gap-2 mb-4">
				<Instagram class="h-5 w-5 text-pink-600" />
				<h3 class="font-semibold text-slate-900">Media Sosial</h3>
			</div>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<div>
					<label for="facebook" class="mb-1.5 block text-sm font-medium text-slate-700">Facebook</label>
					<div class="relative">
						<Facebook class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-600" />
						<input type="url" id="facebook" name="facebook" bind:value={facebook} placeholder="https://facebook.com/..." class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
				</div>
				<div>
					<label for="instagram" class="mb-1.5 block text-sm font-medium text-slate-700">Instagram</label>
					<div class="relative">
						<Instagram class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-600" />
						<input type="url" id="instagram" name="instagram" bind:value={instagram} placeholder="https://instagram.com/..." class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
				</div>
				<div>
					<label for="twitter" class="mb-1.5 block text-sm font-medium text-slate-700">Twitter / X</label>
					<div class="relative">
						<Twitter class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-800" />
						<input type="url" id="twitter" name="twitter" bind:value={twitter} placeholder="https://x.com/..." class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
				</div>
				<div>
					<label for="youtube" class="mb-1.5 block text-sm font-medium text-slate-700">YouTube</label>
					<div class="relative">
						<Youtube class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-red-600" />
						<input type="url" id="youtube" name="youtube" bind:value={youtube} placeholder="https://youtube.com/..." class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
				</div>
				<div>
					<label for="linkedin" class="mb-1.5 block text-sm font-medium text-slate-700">LinkedIn</label>
					<div class="relative">
						<Linkedin class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-700" />
						<input type="url" id="linkedin" name="linkedin" bind:value={linkedin} placeholder="https://linkedin.com/..." class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
				</div>
			</div>
		</div>

		<div class="flex justify-end">
			<Button type="submit" {loading}>{#snippet icon()}<Save class="h-4 w-4" />{/snippet}Simpan Pengaturan</Button>
		</div>
	</form>
</div>
