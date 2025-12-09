<script lang="ts">
	export let form;
</script>

<div class="p-10 text-center">
	<h1 class="text-2xl font-bold mb-4">Setup Admin Pertama</h1>

	{#if form?.success}
		<div class="bg-green-100 p-4 rounded text-green-800 border border-green-300">
			{form.message} <br />
			<a href="/masuk" class="font-bold underline">Ke Halaman Login</a>
		</div>
	{:else if form?.message}
		<div class="bg-yellow-100 p-4 rounded text-yellow-800 mb-4">
			{form.message}
		</div>
	{/if}

	{#if !form?.success}
		<form method="POST">
			<button class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
				Buat Admin Default
			</button>
		</form>
	{/if}
</div>
