<script lang="ts">
	import { enhance } from '$app/forms';
	export let form;
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
		<div class="text-center mb-8">
			<h1 class="text-2xl font-bold text-gray-800">Login Admin</h1>
			<p class="text-gray-500 text-sm">Masuk untuk mengelola website HIMA</p>
		</div>

		{#if form?.error}
			<div class="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-200">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
				<input
					type="text"
					name="username"
					id="username"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Masukkan username"
					required
				/>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
				<input
					type="password"
					name="password"
					id="password"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="Masukkan password"
					required
				/>
			</div>

			<button
				type="submit"
				class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
			>
				Masuk Dashboard
			</button>
		</form>
	</div>
</div>
