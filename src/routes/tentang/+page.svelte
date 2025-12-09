<script lang="ts">
	import { Users, Target, Award, Heart } from 'lucide-svelte';
	import { Header, Footer } from '$lib/components/public';

	interface Props {
		data: {
			pengaturan: Record<string, string>;
			stats: { divisi: number; anggota: number; proker: number };
		};
	}

	let { data }: Props = $props();
	const pengaturan = $derived(data.pengaturan);
	const { stats } = data;
</script>

<svelte:head>
	<title>Tentang Kami - {pengaturan.nama_situs || 'HIMA Informatika'}</title>
	<meta name="description" content="Tentang HIMA Informatika - Himpunan Mahasiswa Informatika" />
</svelte:head>

<Header siteName={pengaturan.nama_situs} logoUrl={pengaturan.logo_url} />

<div class="min-h-screen bg-white">
	<!-- Hero -->
	<div class="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-24 overflow-hidden">
		<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
		<div class="container mx-auto px-6 text-center relative">
			<h1 class="text-4xl md:text-5xl font-bold mb-6">Tentang HIMA Informatika</h1>
			<p class="text-xl text-blue-100 max-w-3xl mx-auto">
				{pengaturan.tagline || 'Wadah aspirasi dan pengembangan mahasiswa Informatika'}
			</p>
		</div>
	</div>

	<!-- Stats -->
	<div class="container mx-auto px-6 -mt-12 relative z-10">
		<div class="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
			<div class="bg-white rounded-2xl shadow-xl p-6 text-center">
				<div class="text-3xl md:text-4xl font-bold text-blue-600">{stats.divisi}</div>
				<div class="text-slate-500 text-sm">Divisi</div>
			</div>
			<div class="bg-white rounded-2xl shadow-xl p-6 text-center">
				<div class="text-3xl md:text-4xl font-bold text-purple-600">{stats.anggota}</div>
				<div class="text-slate-500 text-sm">Anggota</div>
			</div>
			<div class="bg-white rounded-2xl shadow-xl p-6 text-center">
				<div class="text-3xl md:text-4xl font-bold text-green-600">{stats.proker}</div>
				<div class="text-slate-500 text-sm">Program</div>
			</div>
		</div>
	</div>

	<!-- About Section -->
	<div class="container mx-auto px-6 py-20">
		<div class="max-w-4xl mx-auto">
			<h2 class="text-3xl font-bold text-slate-900 mb-6">Siapa Kami?</h2>
			<p class="text-slate-600 mb-6 leading-relaxed text-lg">
				HIMA Informatika adalah Himpunan Mahasiswa Program Studi Informatika yang berfungsi sebagai wadah aspirasi, pengembangan bakat, dan pembinaan mahasiswa Informatika. Kami berkomitmen untuk membangun komunitas yang solid dan berkontribusi positif bagi civitas akademika.
			</p>
			<p class="text-slate-600 leading-relaxed text-lg">
				Melalui berbagai program kerja dan kegiatan, kami berupaya meningkatkan kemampuan akademik, soft skills, dan networking mahasiswa Informatika untuk menghadapi tantangan di era digital.
			</p>
		</div>
	</div>

	<!-- Visi Misi -->
	<div class="bg-slate-50 py-20">
		<div class="container mx-auto px-6">
			<div class="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
				<div class="bg-white rounded-2xl p-8 shadow-sm">
					<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6">
						<Target class="w-7 h-7 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-slate-900 mb-4">Visi</h3>
					<p class="text-slate-600 leading-relaxed">
						Menjadi himpunan mahasiswa yang unggul, inovatif, dan berdaya saing tinggi dalam mengembangkan potensi mahasiswa Informatika serta berkontribusi nyata bagi masyarakat.
					</p>
				</div>
				<div class="bg-white rounded-2xl p-8 shadow-sm">
					<div class="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-6">
						<Award class="w-7 h-7 text-white" />
					</div>
					<h3 class="text-2xl font-bold text-slate-900 mb-4">Misi</h3>
					<ul class="text-slate-600 space-y-3">
						<li class="flex items-start gap-2"><span class="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></span>Meningkatkan kualitas akademik mahasiswa</li>
						<li class="flex items-start gap-2"><span class="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></span>Mengembangkan soft skills dan leadership</li>
						<li class="flex items-start gap-2"><span class="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></span>Membangun jaringan dan kolaborasi</li>
						<li class="flex items-start gap-2"><span class="w-2 h-2 mt-2 rounded-full bg-green-500 flex-shrink-0"></span>Berkontribusi pada masyarakat melalui teknologi</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- Values -->
	<div class="container mx-auto px-6 py-20">
		<h2 class="text-3xl font-bold text-slate-900 text-center mb-12">Nilai-Nilai Kami</h2>
		<div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
			<div class="text-center">
				<div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
					<Users class="w-8 h-8 text-blue-600" />
				</div>
				<h4 class="font-semibold text-slate-900 mb-2">Solidaritas</h4>
				<p class="text-slate-500 text-sm">Kebersamaan dan gotong royong antar anggota</p>
			</div>
			<div class="text-center">
				<div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
					<Heart class="w-8 h-8 text-purple-600" />
				</div>
				<h4 class="font-semibold text-slate-900 mb-2">Integritas</h4>
				<p class="text-slate-500 text-sm">Kejujuran dan tanggung jawab dalam bertindak</p>
			</div>
			<div class="text-center">
				<div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
					<Award class="w-8 h-8 text-green-600" />
				</div>
				<h4 class="font-semibold text-slate-900 mb-2">Profesionalisme</h4>
				<p class="text-slate-500 text-sm">Bekerja dengan standar dan etika tinggi</p>
			</div>
		</div>
	</div>

	<!-- CTA -->
	<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
		<div class="container mx-auto px-6 text-center">
			<h2 class="text-2xl md:text-3xl font-bold mb-4">Ingin Bergabung?</h2>
			<p class="text-blue-100 mb-8">Jadilah bagian dari keluarga HIMA Informatika</p>
			<div class="flex flex-wrap gap-4 justify-center">
				<a href="/struktur-organisasi" class="px-6 py-3 bg-white text-blue-600 font-medium rounded-full hover:bg-blue-50 transition-colors">Lihat Pengurus</a>
				<a href="/kontak" class="px-6 py-3 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors">Hubungi Kami</a>
			</div>
		</div>
	</div>
</div>

<Footer {pengaturan} />
