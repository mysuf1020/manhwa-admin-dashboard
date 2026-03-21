<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Manga Diikuti | MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 min-h-screen">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
			Update Mengikuti
		</h1>
	</div>

	{#if data.followedUpdates.length === 0}
		<div class="py-20 text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
			<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Belum ada update bab</h3>
			<p class="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Kamu belum mengikuti komik apapun, atau komik yang kamu ikuti belum merilis bab terbaru. Eksplorasi katalog untuk mulai mengikuti karya favoritmu!</p>
			<a href="/" class="mt-6 inline-block bg-purple-600 hover:bg-purple-500 text-slate-900 dark:text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-lg active:scale-95">Telusuri Katalog</a>
		</div>
	{:else}
		<div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
			{#each data.followedUpdates as update}
				<a href="/comic/{update.comicSlug}/{update.chapterNumber}" class="group block relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-[3/4] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
					<img src="{update.comicCover || `https://picsum.photos/seed/${update.comicSlug}/300/400`}" alt="{update.comicTitle}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
					<div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
					<div class="absolute top-2 right-2">
						<span class="inline-block px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded uppercase tracking-wider shadow-md">NEW</span>
					</div>
					<div class="absolute bottom-0 left-0 right-0 p-4">
						<div class="flex items-center gap-2 mb-2">
							<span class="inline-flex items-center justify-center bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">Ch. {update.chapterNumber}</span>
							{#if update.chapterTitle}
								<span class="text-slate-300 text-xs truncate">{update.chapterTitle}</span>
							{/if}
						</div>
						<h3 class="text-white font-bold text-sm line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors drop-shadow-md">{update.comicTitle}</h3>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
