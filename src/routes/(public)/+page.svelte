<script lang="ts">
	import ComicCard from '$lib/components/ComicCard.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	let { data }: { data: PageData } = $props();

	// State untuk Featured Slider
	let currentSlide = $state(0);
	let sliderInterval: ReturnType<typeof setInterval>;

	onMount(() => {
		if (data.featuredComics && data.featuredComics.length > 1) {
			sliderInterval = setInterval(() => {
				currentSlide = (currentSlide + 1) % data.featuredComics.length;
			}, 5000);
		}
	});

	onDestroy(() => {
		if (sliderInterval) clearInterval(sliderInterval);
	});

	function setTypeFilter(type: string) {
		const url = new URL(window.location.href);
		url.searchParams.delete('page'); // Reset paginasi
		if (type === 'All') {
			url.searchParams.delete('type');
		} else {
			url.searchParams.set('type', type);
		}
		goto(url.toString(), { keepFocus: true });
	}

	const categories = [
		{ id: 'All', label: 'Semua Rilisan' },
		{ id: 'Manhwa', label: 'Manhwa' },
		{ id: 'Manga', label: 'Manga' },
		{ id: 'Manhua', label: 'Manhua' }
	];
</script>

<svelte:head>
	<title>MangaReader - Katalog Lengkap</title>
</svelte:head>

<div class="max-w-7xl px-4 py-4 md:py-6 mx-auto">
	<!-- Featured Slider (Komik Pilihan Editor) -->
	{#if data.featuredComics && data.featuredComics.length > 0 && !data.searchQuery && data.typeFilter === 'All' && data.currentPage === 1}
		<section class="mb-6 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl" style="min-height: 200px;">
			{#each data.featuredComics as comic, i (comic.id)}
				<a
					href="/comic/{comic.slug}"
					class="absolute inset-0 transition-opacity duration-700 {i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
				>
					<img src={comic.cover} alt={comic.title} class="w-full h-full object-cover">
					<div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>
					<div class="absolute bottom-0 left-0 right-0 p-4 md:p-8">
						<span class="text-[10px] md:text-xs font-bold uppercase tracking-widest text-purple-400 mb-1 md:mb-2 block">Pilihan Editor</span>
						<h2 class="text-xl md:text-3xl font-black text-slate-900 dark:text-white mb-1 md:mb-2 drop-shadow-lg">{comic.title}</h2>
						{#if comic.author}
							<p class="text-xs md:text-sm text-slate-700 dark:text-slate-300 mb-1">oleh {comic.author}</p>
						{/if}
						{#if comic.description}
							<p class="text-xs md:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 max-w-xl hidden md:block">{comic.description}</p>
						{/if}
					</div>
				</a>
			{/each}
			<!-- Slider Dots -->
			{#if data.featuredComics.length > 1}
				<div class="absolute bottom-3 right-4 md:bottom-5 md:right-6 z-20 flex gap-1.5">
					{#each Array.from({ length: data.featuredComics.length }, (__, idx) => idx) as i (i)}
						<button
							onclick={() => { currentSlide = i; clearInterval(sliderInterval); }}
							class="w-2 h-2 rounded-full transition-all {i === currentSlide ? 'bg-purple-400 w-5' : 'bg-white/30 hover:bg-white/50'}"
							aria-label="Slide {i + 1}"
						></button>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- Continue Reading (hanya untuk user yang login) -->
	{#if data.continueReading && data.continueReading.length > 0}
		<section class="mb-8">
			<h2 class="text-lg font-bold mb-3 text-slate-800 dark:text-slate-200 flex items-center gap-2">
				<svg class="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
				Lanjutkan Membaca
			</h2>
			<div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
				{#each data.continueReading as item (item.comicId)}
					<a href="/comic/{item.slug}/{item.chapterNumber}" class="shrink-0 snap-start group w-28 md:w-32">
						<div class="aspect-3/4 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 mb-1.5 relative">
							<img src={item.cover} alt={item.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
							<div class="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/90 to-transparent p-2 pt-6">
								<span class="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded">Ch. {item.chapterNumber}</span>
							</div>
						</div>
						<p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 group-hover:text-purple-400 transition-colors font-medium">{item.title}</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Announcement Banners -->
	{#if data.activeAnnouncements && data.activeAnnouncements.length > 0}
		<section class="mb-6 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
			{#each data.activeAnnouncements as ann (ann.id)}
				<a
					href={ann.linkUrl || '#'}
					class="shrink-0 snap-start w-full md:w-auto md:grow relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 transition-colors group"
				>
					{#if ann.imageUrl}
						<img src={ann.imageUrl} alt={ann.title} class="w-full h-20 md:h-24 object-cover group-hover:scale-105 transition-transform duration-500">
						<div class="absolute inset-0 bg-linear-to-r from-black/70 to-transparent flex items-center px-4">
							<span class="text-slate-900 dark:text-white text-sm font-bold drop-shadow-lg">{ann.title}</span>
						</div>
					{:else}
						<div class="h-20 md:h-24 bg-linear-to-r from-purple-900/40 to-slate-900 flex items-center px-4">
							<span class="text-slate-900 dark:text-white text-sm font-bold">{ann.title}</span>
							{#if ann.content}
								<span class="text-xs text-slate-600 dark:text-slate-400 ml-3 hidden md:inline">{ann.content}</span>
							{/if}
						</div>
					{/if}
				</a>
			{/each}
		</section>
	{/if}

	<!-- Filters -->
	<section class="mb-6 flex justify-center">
		<div
			class="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar bg-slate-50 dark:bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-xl border border-slate-300 dark:border-slate-700/50 shadow-lg"
		>
			{#each categories as cat (cat.id)}
				<button
					onclick={() => setTypeFilter(cat.id)}
					class={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${data.typeFilter === cat.id ? 'bg-emerald-500 text-slate-900 dark:text-white shadow-md shadow-emerald-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
				>
					{cat.label}
				</button>
			{/each}
		</div>
	</section>

	<!-- Popular Comics Section -->
	{#if data.popularComics && data.popularComics.length > 0 && !data.searchQuery && data.typeFilter === 'All' && data.currentPage === 1}
		<section class="mb-8">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">
					Trending Minggu Ini
				</h2>
			</div>
			<!-- Horizontal Scroll Container -->
			<div class="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar">
				{#each data.popularComics as comic (comic.slug)}
					<div class="w-[120px] md:w-[150px] snap-start shrink-0">
						<ComicCard href="/comic/{comic.slug}" {comic} isHot={true} />
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Latest Updates Grid -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-lg md:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-7 w-7 text-purple-500"
						viewBox="0 0 20 20"
						fill="currentColor"
						><path
							fill-rule="evenodd"
							d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1-1-4-1-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
							clip-rule="evenodd"
						/></svg
					>
					{data.searchQuery ? `Hasil Pencarian: "${data.searchQuery}"` : 'Katalog Rilisan Terbaru'}
				</h2>
				{#if data.typeFilter !== 'All' && !data.searchQuery}
					<p class="text-sm font-semibold text-emerald-400 mt-1 pl-10">
						Menampilkan kategori: {data.typeFilter}
					</p>
				{/if}
			</div>
		</div>

		{#if data.latestUpdates.length === 0}
			<div
				class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl p-16 text-center shadow-inner"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-16 w-16 text-slate-700 mx-auto mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/></svg
				>
				<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Pencarian Tidak Ditemukan</h3>
				<p class="text-slate-600 dark:text-slate-400">
					Tidak ada komik yang cocok dengan kriteria filter atau kunci pencarian Anda.
				</p>
				<button
					onclick={() => {
						const url = new URL(window.location.href);
						url.searchParams.delete('q');
						url.searchParams.delete('type');
						url.searchParams.delete('page');
						goto(url.toString());
					}}
					class="mt-6 font-bold text-purple-400 hover:text-purple-300 decoration-purple-500 hover:underline"
					>Reset Semua Filter</button
				>
			</div>
		{:else}
			<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 md:gap-4">
				{#each data.latestUpdates as comic (comic.slug)}
					<ComicCard href="/comic/{comic.slug}" {comic} isHot={false} />
				{/each}
			</div>

			<!-- Pagination Controls -->
			{#if !data.searchQuery && data.totalPages > 1}
				<div class="flex justify-center items-center gap-3 mt-16 mb-8 text-sm font-bold">
					{#if data.currentPage > 1}
						<a
							href="?{data.typeFilter !== 'All' ? 'type=' + data.typeFilter + '&' : ''}page={data.currentPage - 1}"
							class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg border border-emerald-500/20 hover:border-emerald-500 active:scale-95"
							>&larr; Sebelumnya</a
						>
					{/if}

					<span
						class="px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl shadow-inner pointer-events-none"
					>
						Halaman <span class="text-emerald-400">{data.currentPage}</span> dari {data.totalPages}
					</span>

					{#if data.currentPage < data.totalPages}
						<a
							href="?{data.typeFilter !== 'All' ? 'type=' + data.typeFilter + '&' : ''}page={data.currentPage + 1}"
							class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg border border-emerald-500/20 hover:border-emerald-500 active:scale-95"
							>Lanjut &rarr;</a
						>
					{/if}
				</div>
			{/if}
		{/if}
	</section>
</div>
