<script lang="ts">
	import { User, Settings, LogOut, ChevronDown } from 'lucide-svelte';
	import { clsx } from 'clsx';

	interface Props {
		user: {
			namaLengkap: string;
			email: string;
			fotoProfil?: string | null;
		};
	}

	let { user }: Props = $props();
	let isOpen = $state(false);

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function closeDropdown() {
		isOpen = false;
	}
</script>

<svelte:window
	onclick={(e) => {
		const target = e.target as HTMLElement;
		if (!target.closest('.user-dropdown')) {
			closeDropdown();
		}
	}}
/>

<div class="user-dropdown relative">
	<button
		onclick={toggleDropdown}
		class="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-slate-100"
	>
		{#if user.fotoProfil}
			<img
				src={user.fotoProfil}
				alt={user.namaLengkap}
				class="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200"
			/>
		{:else}
			<div
				class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold uppercase text-white"
			>
				{user.namaLengkap.charAt(0)}
			</div>
		{/if}
		<div class="hidden text-left md:block">
			<p class="text-sm font-medium text-slate-700">{user.namaLengkap}</p>
		</div>
		<ChevronDown
			class={clsx('h-4 w-4 text-slate-400 transition-transform', isOpen && 'rotate-180')}
		/>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50"
		>
			<!-- User Info -->
			<div class="border-b border-slate-100 px-4 py-3">
				<p class="text-sm font-medium text-slate-900">{user.namaLengkap}</p>
				<p class="text-xs text-slate-500">{user.email}</p>
			</div>

			<!-- Menu Items -->
			<div class="p-2">
				<a
					href="/dashboard/profil"
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
					onclick={closeDropdown}
				>
					<User class="h-4 w-4" />
					<span>Profil Saya</span>
				</a>
				<a
					href="/dashboard/pengaturan"
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
					onclick={closeDropdown}
				>
					<Settings class="h-4 w-4" />
					<span>Pengaturan</span>
				</a>
			</div>

			<!-- Logout -->
			<div class="border-t border-slate-100 p-2">
				<a
					href="/keluar"
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
				>
					<LogOut class="h-4 w-4" />
					<span>Keluar</span>
				</a>
			</div>
		</div>
	{/if}
</div>
