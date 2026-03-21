<script lang="ts">
	import type { PageData } from './$types';
	import ReaderNav from '$lib/components/ReaderNav.svelte';
	import ReaderFooter from '$lib/components/ReaderFooter.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';

	let { data }: { data: PageData } = $props();

	// State boolean untuk menampilkan navbar di bagian bawah
	let showNav = $state(false);

	// Reading mode: 'scroll' (default manhwa) atau 'page' (manga style)
	let readingMode = $state<'scroll' | 'page'>('scroll');
	let currentPage = $state(0);

	// Initialize from user preference if available
	$effect(() => {
		if (data.user?.readingMode === 'page') readingMode = 'page';
	});

	function toggleNav() {
		if (readingMode === 'scroll') {
			showNav = !showNav;
		}
	}

	function nextPage() {
		if (currentPage < data.pages.length - 1) currentPage++;
	}

	function prevPage() {
		if (currentPage > 0) currentPage--;
	}

	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';

	function toggleReadingMode() {
		readingMode = readingMode === 'scroll' ? 'page' : 'scroll';
		currentPage = 0;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

		switch (e.key.toLowerCase()) {
			case 'arrowright':
			case 'd':
				if (readingMode === 'page') nextPage();
				else if (data.nextChapterNumber) goto(`/comic/${data.comic.slug}/${data.nextChapterNumber}`);
				break;
			case 'arrowleft':
			case 'a':
				if (readingMode === 'page') prevPage();
				else if (data.prevChapterNumber) goto(`/comic/${data.comic.slug}/${data.prevChapterNumber}`);
				break;
			case 'm':
				toggleReadingMode();
				break;
			case 'f':
				if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
				else document.exitFullscreen().catch(() => {});
				break;
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') window.removeEventListener('keydown', handleKeydown);
	});
</script>

<svelte:head>
	<title>Chapter {data.chapter.chapterNumber} - {data.comic.title} | MangaReader</title>
</svelte:head>

<!-- Overlay Bottom Nav Reader -->
<ReaderNav
	title={data.comic.title}
	chapterNumber={data.chapter.chapterNumber}
	comicSlug={data.comic.slug}
	prevChapterNumber={data.prevChapterNumber}
	nextChapterNumber={data.nextChapterNumber}
	visible={showNav}
/>

<!-- Area Utama Pembaca -->
<main class="bg-black pb-12 flex min-h-screen flex-col items-center select-none">
	<!-- Reading Mode Toggle -->
	<div class="w-full max-w-3xl flex justify-end px-4 pt-3 pb-1">
		<button
			onclick={toggleReadingMode}
			class="text-xs text-slate-500 hover:text-purple-400 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
		>
			{#if readingMode === 'scroll'}
				<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
				Mode Scroll
			{:else}
				<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
				Mode Halaman
			{/if}
		</button>
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="max-w-3xl shadow-2xl relative flex w-full flex-col cursor-pointer" onclick={toggleNav}>
		{#if data.pages.length === 0}
			<div class="py-32 px-4 text-slate-500 border-slate-200 dark:border-slate-800 rounded-xl m-4 mt-12 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed text-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
				<p class="text-xl mb-2 font-medium">Kosong Melompong</p>
				<p class="text-sm text-slate-600">Admin/Uploader belum mensisipkan potongan rilis chapter ini ke Database.</p>
			</div>
		{:else if readingMode === 'scroll'}
			<!-- Infinite Scroll Mode (Manhwa) -->
			{#each data.pages as pg (pg.id)}
				<!-- svelte-ignore a11y_missing_attribute -->
				<img src={pg.imageUrl} loading="lazy" class="m-0 p-0 pointer-events-none block h-auto w-full" />
			{/each}
		{:else}
			<!-- Page-by-Page Mode (Manga) -->
			<div class="relative w-full flex items-center justify-center min-h-[60vh]">
				<!-- svelte-ignore a11y_missing_attribute -->
				<img src={data.pages[currentPage].imageUrl} class="max-h-[85vh] w-auto mx-auto object-contain pointer-events-none" />
			</div>
			<!-- Page Controls -->
			<div class="flex items-center justify-center gap-4 py-4 bg-white dark:bg-slate-950/80">
				<button onclick={prevPage} disabled={currentPage === 0} class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors text-sm font-bold">← Prev</button>
				<span class="text-slate-600 dark:text-slate-400 text-sm font-mono">{currentPage + 1} / {data.pages.length}</span>
				<button onclick={nextPage} disabled={currentPage === data.pages.length - 1} class="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors text-sm font-bold">Next →</button>
			</div>
		{/if}
	</div>

	<!-- Area Bawah Pembaca (Call to Actions) -->
	{#if data.pages.length > 0}
		<ReaderFooter
			chapterNumber={data.chapter.chapterNumber}
			comicSlug={data.comic.slug}
			nextChapterNumber={data.nextChapterNumber}
		/>
		<div class="w-full max-w-3xl mt-6 border-t border-slate-200 dark:border-slate-800">
			<CommentSection comments={data.comments} user={data.user} />
		</div>
	{/if}
</main>
