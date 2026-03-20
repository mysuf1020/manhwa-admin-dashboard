<script lang="ts">
	import { fly } from 'svelte/transition';

	let { 
		title, 
		chapterNumber, 
		comicSlug, 
		prevChapterNumber = null, 
		nextChapterNumber = null,
		visible = false
	} = $props<{
		title: string;
		chapterNumber: string;
		comicSlug: string;
		prevChapterNumber?: string | null;
		nextChapterNumber?: string | null;
		visible?: boolean;
	}>();
</script>

{#if visible}
<nav
	transition:fly={{ y: 100, duration: 300 }}
	class="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-4 md:px-8 py-5 shadow-[0_-20px_50px_rgba(0,0,0,0.6)] z-50 flex items-center justify-between"
>
	<!-- Return Button -->
	<a
		href={`/comic/${comicSlug}`}
		class="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
		onclick={(e) => e.stopPropagation()}
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
		</svg>
		<span class="font-bold sm:inline hidden max-w-[150px] md:max-w-[250px] truncate">{title}</span>
	</a>

	<!-- Controls Center -->
	<div class="flex items-center gap-2 md:gap-4">
		{#if prevChapterNumber}
			<a href="/comic/{comicSlug}/{prevChapterNumber}" class="px-4 md:px-6 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-sm" onclick={(e) => e.stopPropagation()}>&larr; Prev</a>
		{:else}
			<button class="px-4 md:px-6 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-slate-600 cursor-not-allowed shadow-inner" disabled onclick={(e) => e.stopPropagation()}>&larr; Prev</button>
		{/if}

		{#if nextChapterNumber}
			<a href="/comic/{comicSlug}/{nextChapterNumber}" class="px-4 md:px-6 py-2.5 bg-purple-600 border border-purple-500 rounded-xl text-sm font-bold text-white hover:bg-purple-500 shadow-lg shadow-purple-900/40 transition-colors" onclick={(e) => e.stopPropagation()}>Next &rarr;</a>
		{:else}
			<button class="px-4 md:px-6 py-2.5 bg-purple-900 border border-purple-800 rounded-xl text-sm font-bold text-white/50 cursor-not-allowed shadow-inner" disabled onclick={(e) => e.stopPropagation()}>Next &rarr;</button>
		{/if}
	</div>

	<!-- Chapter Indicator -->
	<div class="font-black text-xl text-purple-400 tracking-wide hidden sm:block">
		<span class="text-slate-500 text-sm font-semibold mr-1">Ch.</span>{chapterNumber}
	</div>
</nav>
{/if}
