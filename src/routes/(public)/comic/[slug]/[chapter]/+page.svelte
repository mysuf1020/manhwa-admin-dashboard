<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
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
	// Offline Reading (PWA) Client-Side Caching Logic
	let isDownloading = $state(false);
	let downloadProgress = $state(0);
	let showReportModal = $state(false);
	let isSubmittingReport = $state(false);
	
	async function downloadChapter() {
		if (!('caches' in window)) {
			(window as unknown as { __toast: (m: string, t: string) => void }).__toast('Browser tidak mendukung Download Offline.', 'error');
			return;
		}

		isDownloading = true;
		downloadProgress = 0;
		try {
			const cache = await caches.open('manga-offline-cache');
			const urlsToCache = data.pages.map(p => p.imageUrl);
			
			for (let i = 0; i < urlsToCache.length; i++) {
				const url = urlsToCache[i];
				const response = await fetch(url);
				if (!response.ok) throw new Error('Network response was not ok');
				await cache.put(url, response.clone());
				downloadProgress = Math.round(((i + 1) / urlsToCache.length) * 100);
			}
			
			// Cache HTML Dokumen ini agar user bisa membuka route ini ketika offline
			await cache.add(window.location.href);

			(window as unknown as { __toast: (m: string, t: string) => void }).__toast('Berhasil Download Offline 📚', 'success');
		} catch (err) {
			console.error('Download offline error:', err);
			(window as unknown as { __toast: (m: string, t: string) => void }).__toast('Gagal melakukan unduhan gambar.', 'error');
		} finally {
			isDownloading = false;
		}
	}
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
			<!-- Baris Tindakan Ekstra -->
			<div class="flex justify-between items-center px-4 py-4 md:px-0">
				<h3 class="text-sm font-bold text-slate-500 dark:text-slate-400">Pusat Bantuan</h3>
				<button onclick={() => showReportModal = true} class="text-sm text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1 transition-colors">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2z" /></svg>
					Lapor Chapter Rusak
				</button>
			</div>
			<CommentSection comments={data.comments} user={data.user} />
		</div>
	{/if}

	<!-- FAB Unduh Offline -->
	{#if data.pages.length > 0}
		<button 
			onclick={downloadChapter} 
			disabled={isDownloading}
			class="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
			aria-label="Unduh Chapter untuk Dibaca Offline"
		>
			{#if isDownloading}
				<svg class="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
				<span class="font-bold text-sm hidden group-hover:block whitespace-nowrap">{downloadProgress}%</span>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
			{/if}
		</button>
	{/if}

	<!-- Modal Laporan -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	{#if showReportModal}
		<div class="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center p-4">
			<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200" onclick={(e) => e.stopPropagation()}>
				<h2 class="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
					<svg class="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
					Laporan Kerusakan
				</h2>
				<form action="?/submitReport" method="POST" use:enhance={() => {
					isSubmittingReport = true;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return async ({ update, result }: { update: any, result: any }) => {
						isSubmittingReport = false;
						if (result.type === 'success') {
							showReportModal = false;
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							(window as any).__toast('Laporan terkirim! Admin akan segera memeriksa.', 'success');
						} else if (result.type === 'failure') {
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							(window as any).__toast(result.data?.error || 'Gagal mengirim', 'error');
						}
						await update();
					};
				}}>
					<div class="mb-4">
						<label for="reasonCategory" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Jenis Kendala</label>
						<select id="reasonCategory" name="reasonCategory" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-3 outline-none rounded-xl focus:border-rose-500 transition-colors" required>
							<option value="broken_image">Gambar rusak / hitam / error memuat</option>
							<option value="wrong_chapter">Isi chapter tidak sesuai judul navigasi</option>
							<option value="inaccurate_translation">Terjemahan jelek abis</option>
							<option value="other">Kendala teknis lainnya</option>
						</select>
					</div>
					<div class="mb-6">
						<label for="description" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Detail (Bila perlu)</label>
						<textarea id="description" name="description" rows="3" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 px-4 py-3 outline-none rounded-xl focus:border-rose-500 transition-colors resize-none placeholder:text-slate-400" placeholder="Jelaskan spesifik halaman berapa yang rusak..."></textarea>
					</div>
					<div class="flex justify-end gap-3">
						<button type="button" onclick={() => showReportModal = false} class="px-5 py-2.5 font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors">Batal</button>
						<button type="submit" disabled={isSubmittingReport} class="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none">Kirim Laporan</button>
					</div>
				</form>
			</div>
		</div>
	{/if}
</main>
