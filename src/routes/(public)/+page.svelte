<script lang="ts">
	import ComicCard from '$lib/components/ComicCard.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>MangaReader - Latest Updates</title>
</svelte:head>

<div class="max-w-7xl px-4 py-8 mx-auto">
	<!-- Hero Section -->
	<section
		class="mb-12 rounded-2xl h-64 md:h-80 bg-slate-900 border-slate-800 relative flex items-center overflow-hidden border"
	>
		<div class="inset-0 from-purple-900/50 absolute bg-linear-to-r to-transparent"></div>
		<div class="p-8 md:p-12 max-w-2xl relative z-10">
			<h1 class="text-3xl md:text-5xl font-bold mb-4">Read Your Favorite Manhwa</h1>
			<p class="text-slate-300 text-lg mb-6">
				High quality translations, daily updates, and zero interruptions.
			</p>
			<button
				class="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors"
			>
				Start Reading
			</button>
		</div>
	</section>

	<!-- Latest Updates Grid -->
	<section>
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-2xl font-bold border-purple-500 pl-3 border-l-4">Latest Updates</h2>
			<!-- eslint-disable-next-line -->
			<a href="/popular" class="text-sm text-purple-400 hover:text-purple-300">View All &rarr;</a>
		</div>

		<div class="md:grid-cols-4 lg:grid-cols-6 gap-4 grid grid-cols-2">
			{#each data.latestUpdates as comic (comic.slug)}
				<ComicCard href="/comic/{comic.slug}" {comic} isHot={true} />
			{/each}
		</div>
	</section>
</div>
