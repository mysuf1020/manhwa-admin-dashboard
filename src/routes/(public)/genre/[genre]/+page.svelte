<script lang="ts">
	import ComicCard from '$lib/components/ComicCard.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Genre: {data.genre} - MangaReader</title>
</svelte:head>

<div class="max-w-7xl px-4 py-6 mx-auto">
	<div class="mb-6">
		<a href="/" class="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-400 transition-colors">&larr; Kembali ke Beranda</a>
		<h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-2">Genre: <span class="text-purple-400">{data.genre}</span></h1>
		<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">{data.comics.length} komik ditemukan</p>
	</div>

	{#if data.comics.length === 0}
		<div class="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center text-slate-500">
			Belum ada komik dengan genre ini.
		</div>
	{:else}
		<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 md:gap-4">
			{#each data.comics as comic (comic.slug)}
				<ComicCard href="/comic/{comic.slug}" {comic} isHot={false} />
			{/each}
		</div>
	{/if}
</div>
