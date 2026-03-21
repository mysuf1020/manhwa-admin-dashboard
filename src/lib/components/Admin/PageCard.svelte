<script lang="ts">
	import DeleteForm from './DeleteForm.svelte';
	import Button from '../Button.svelte';

	let { page } = $props();
</script>

<div
	class="group bg-white dark:bg-slate-950 rounded-lg border-slate-300 dark:border-slate-700 hover:border-emerald-500 shadow-lg shadow-black/40 relative aspect-2/3 overflow-hidden border transition-colors"
>
	<img
		src={page.imageUrl}
		alt="Page {page.pageNumber}"
		class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
		loading="lazy"
	/>

	<!-- Overlay Label -->
	<div
		class="top-0 left-0 bg-black/80 backdrop-blur-md text-slate-900 dark:text-white text-xs font-black px-3 py-1.5 rounded-br-lg shadow absolute"
	>
		#{page.pageNumber}
	</div>

	<!-- Delete Button Overlay -->
	<div
		class="inset-0 bg-black/80 p-4 absolute flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
	>
		<DeleteForm action="?/deletePage" id={page.id} class="w-full">
			<Button type="submit" variant="danger" class="text-xs py-2.5 w-full">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
					/></svg
				>
				Musnahkan
			</Button>
		</DeleteForm>
	</div>
</div>
