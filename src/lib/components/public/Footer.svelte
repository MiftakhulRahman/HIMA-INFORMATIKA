<script lang="ts">
	import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-svelte';

	interface Props {
		pengaturan?: Record<string, string>;
	}

	let { pengaturan = {} }: Props = $props();
</script>

<footer class="bg-slate-900 text-slate-300 pt-16 pb-8">
	<div class="container mx-auto px-6">
		<div class="grid md:grid-cols-4 gap-10 mb-12">
			<!-- Brand -->
			<div class="md:col-span-2">
				<div class="flex items-center gap-3 mb-4">
					{#if pengaturan.logo_url}
						<img src={pengaturan.logo_url} alt="Logo" class="h-10 w-10" />
					{/if}
					<span class="text-xl font-bold text-white">{pengaturan.nama_situs || 'HIMA Informatika'}</span>
				</div>
				<p class="text-slate-400 mb-6 max-w-md">
					{pengaturan.tagline || 'Himpunan Mahasiswa Informatika'}
				</p>
				<div class="flex gap-3">
					{#if pengaturan.facebook}
						<a href={pengaturan.facebook} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
							<Facebook class="w-5 h-5" />
						</a>
					{/if}
					{#if pengaturan.instagram}
						<a href={pengaturan.instagram} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-colors">
							<Instagram class="w-5 h-5" />
						</a>
					{/if}
					{#if pengaturan.twitter}
						<a href={pengaturan.twitter} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-600 transition-colors">
							<Twitter class="w-5 h-5" />
						</a>
					{/if}
					{#if pengaturan.youtube}
						<a href={pengaturan.youtube} target="_blank" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors">
							<Youtube class="w-5 h-5" />
						</a>
					{/if}
				</div>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-white font-semibold mb-4">Menu</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="/tentang" class="hover:text-white transition-colors">Tentang Kami</a></li>
					<li><a href="/berita" class="hover:text-white transition-colors">Berita</a></li>
					<li><a href="/divisi" class="hover:text-white transition-colors">Divisi</a></li>
					<li><a href="/program-kerja" class="hover:text-white transition-colors">Program Kerja</a></li>
					<li><a href="/galeri" class="hover:text-white transition-colors">Galeri</a></li>
					<li><a href="/dokumen" class="hover:text-white transition-colors">Dokumen</a></li>
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h4 class="text-white font-semibold mb-4">Kontak</h4>
				<ul class="space-y-3 text-sm">
					{#if pengaturan.email}
						<li class="flex items-center gap-2">
							<Mail class="w-4 h-4 flex-shrink-0" />
							<span>{pengaturan.email}</span>
						</li>
					{/if}
					{#if pengaturan.telepon}
						<li class="flex items-center gap-2">
							<Phone class="w-4 h-4 flex-shrink-0" />
							<span>{pengaturan.telepon}</span>
						</li>
					{/if}
					{#if pengaturan.alamat}
						<li class="flex items-start gap-2">
							<MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
							<span>{pengaturan.alamat}</span>
						</li>
					{/if}
				</ul>
			</div>
		</div>

		<!-- Bottom -->
		<div class="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
			<p>&copy; {new Date().getFullYear()} {pengaturan.nama_situs || 'HIMA Informatika'}. All rights reserved.</p>
		</div>
	</div>
</footer>
