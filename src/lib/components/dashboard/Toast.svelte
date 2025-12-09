<script lang="ts">
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster
	position="top-right"
	richColors
	closeButton
	toastOptions={{
		duration: 4000,
		style: 'font-family: inherit;'
	}}
/>
