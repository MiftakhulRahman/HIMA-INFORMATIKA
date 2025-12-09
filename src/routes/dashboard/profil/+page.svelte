<script lang="ts">
	import { enhance } from '$app/forms';
	import { toast } from 'svelte-sonner';
	import { Breadcrumb, Button } from '$lib/components/dashboard';
	import { Save, User, Mail, Lock, Eye, EyeOff, X } from 'lucide-svelte';

	interface Props {
		data: { user: { id: number; username: string; email: string | null; namaLengkap: string | null; avatar: string | null } };
		form: { success?: boolean; message?: string; errors?: Record<string, string> } | null;
	}

	let { data, form }: Props = $props();
	let namaLengkap = $state(data.user.namaLengkap || '');
	let email = $state(data.user.email || '');
	let avatar = $state(data.user.avatar || '');
	let passwordLama = $state('');
	let passwordBaru = $state('');
	let konfirmasiPassword = $state('');
	let showPasswordLama = $state(false);
	let showPasswordBaru = $state(false);
	let loading = $state(false);

	$effect(() => {
		if (form?.success !== undefined) {
			form.success ? toast.success(form.message || 'Berhasil') : toast.error(form.message || 'Gagal');
			loading = false;
			if (form.success) { passwordLama = ''; passwordBaru = ''; konfirmasiPassword = ''; }
		}
	});
</script>

<svelte:head><title>Profil - Dashboard HIMA</title></svelte:head>

<div class="space-y-6">
	<div>
		<Breadcrumb items={[{ label: 'Profil' }]} />
		<h1 class="mt-2 text-2xl font-bold text-slate-900">Profil Saya</h1>
	</div>

	<div class="grid gap-6 lg:grid-cols-3">
		<!-- Avatar Card -->
		<div class="rounded-xl border border-slate-200 bg-white p-6">
			<h3 class="mb-4 font-semibold text-slate-900">Foto Profil</h3>
			<div class="flex flex-col items-center">
				{#if avatar}
					<div class="relative">
						<img src={avatar} alt="Avatar" class="h-32 w-32 rounded-full object-cover" />
						<button type="button" onclick={() => avatar = ''} class="absolute -right-1 -top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"><X class="h-4 w-4" /></button>
					</div>
				{:else}
					<div class="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
						<span class="text-4xl font-bold text-white">{data.user.username.charAt(0).toUpperCase()}</span>
					</div>
				{/if}
				<p class="mt-4 text-center font-medium text-slate-900">{data.user.namaLengkap || data.user.username}</p>
				<p class="text-sm text-slate-500">@{data.user.username}</p>
			</div>
		</div>

		<!-- Profile Form -->
		<div class="space-y-6 lg:col-span-2">
			<form method="POST" action="?/updateProfile" use:enhance={() => { loading = true; return async ({ update }) => await update(); }}>
				<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
					<h3 class="font-semibold text-slate-900">Informasi Profil</h3>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="username" class="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
							<input type="text" id="username" value={data.user.username} disabled class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-500" />
						</div>
						<div>
							<label for="namaLengkap" class="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label>
							<input type="text" id="namaLengkap" name="namaLengkap" bind:value={namaLengkap} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
						</div>
					</div>
					<div>
						<label for="email" class="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
						<div class="relative">
							<Mail class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
							<input type="email" id="email" name="email" bind:value={email} class="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
						</div>
					</div>
					<div>
						<label for="avatar" class="mb-1.5 block text-sm font-medium text-slate-700">URL Avatar</label>
						<input type="url" id="avatar" name="avatar" bind:value={avatar} placeholder="https://..." class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
					</div>
					<Button type="submit" {loading}>{#snippet icon()}<Save class="h-4 w-4" />{/snippet}Simpan Profil</Button>
				</div>
			</form>

			<form method="POST" action="?/updatePassword" use:enhance={() => { loading = true; return async ({ update }) => await update(); }}>
				<div class="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
					<h3 class="font-semibold text-slate-900">Ubah Password</h3>
					<div>
						<label for="passwordLama" class="mb-1.5 block text-sm font-medium text-slate-700">Password Lama</label>
						<div class="relative">
							<Lock class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
							<input type={showPasswordLama ? 'text' : 'password'} id="passwordLama" name="passwordLama" bind:value={passwordLama} class="w-full rounded-lg border border-slate-300 pl-10 pr-12 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
							<button type="button" onclick={() => showPasswordLama = !showPasswordLama} class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
								{#if showPasswordLama}<EyeOff class="h-5 w-5" />{:else}<Eye class="h-5 w-5" />{/if}
							</button>
						</div>
					</div>
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="passwordBaru" class="mb-1.5 block text-sm font-medium text-slate-700">Password Baru</label>
							<div class="relative">
								<input type={showPasswordBaru ? 'text' : 'password'} id="passwordBaru" name="passwordBaru" bind:value={passwordBaru} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-12 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
								<button type="button" onclick={() => showPasswordBaru = !showPasswordBaru} class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
									{#if showPasswordBaru}<EyeOff class="h-5 w-5" />{:else}<Eye class="h-5 w-5" />{/if}
								</button>
							</div>
						</div>
						<div>
							<label for="konfirmasiPassword" class="mb-1.5 block text-sm font-medium text-slate-700">Konfirmasi Password</label>
							<input type="password" id="konfirmasiPassword" name="konfirmasiPassword" bind:value={konfirmasiPassword} class="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
						</div>
					</div>
					{#if form?.errors?.password}<p class="text-sm text-red-500">{form.errors.password}</p>{/if}
					<Button type="submit" variant="outline" {loading}>{#snippet icon()}<Lock class="h-4 w-4" />{/snippet}Ubah Password</Button>
				</div>
			</form>
		</div>
	</div>
</div>
