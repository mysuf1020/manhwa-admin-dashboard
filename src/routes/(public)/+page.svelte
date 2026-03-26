<script lang="ts">
	import ComicCard from '$lib/components/ComicCard.svelte';
	import AdBanner from '$lib/components/AdBanner.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';

	let { data }: { data: PageData } = $props();

	// Featured Slider state
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
		url.searchParams.delete('page');
		if (type === 'All') {
			url.searchParams.delete('type');
		} else {
			url.searchParams.set('type', type);
		}
		goto(url.toString());
	}

	const categories = [
		{ id: 'All', label: 'Semua Rilisan' },
		{ id: 'Manhwa', label: 'Manhwa' },
		{ id: 'Manga', label: 'Manga' },
		{ id: 'Manhua', label: 'Manhua' }
	];

	function setGenreFilter(genre: string) {
		const url = new URL(window.location.href);
		url.searchParams.delete('page');
		if (!genre) {
			url.searchParams.delete('genre');
		} else {
			url.searchParams.set('genre', genre);
		}
		goto(url.toString());
	}
</script>

<svelte:head>
	<title>MangaReader - Katalog Lengkap</title>
</svelte:head>

<div class="max-w-7xl px-4 md:px-6 py-6 md:py-10 mx-auto space-y-10">
	<!-- Ad Banner: Homepage Top -->
	<AdBanner ads={data.activeAds} position="homepage_top" isVip={data.user?.isVip} />

	<!-- ═══════════════════════════════════════ -->
	<!-- Featured Slider (Pilihan Editor) -->
	<!-- ═══════════════════════════════════════ -->
	{#if data.featuredComics && data.featuredComics.length > 0 && !data.searchQuery && data.typeFilter === 'All' && data.currentPage === 1}
		<section class="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl aspect-[21/9] md:aspect-[21/7] bg-slate-900">
			{#each data.featuredComics as comic, i (comic.id)}
				<a
					href="/comic/{comic.slug}"
					class="absolute inset-0 transition-opacity duration-700 ease-in-out {i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}"
				>
					<img src={comic.cover} alt={comic.title} class="w-full h-full object-cover" />
					<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
					<div class="absolute bottom-0 left-0 right-0 p-5 md:p-10">
						<span class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-purple-400 mb-1 md:mb-2 block">Pilihan Editor</span>
						<h2 class="text-xl md:text-4xl font-black text-white mb-1 md:mb-2 drop-shadow-lg">{comic.title}</h2>
						{#if comic.author}
							<p class="text-xs md:text-sm text-slate-300 mb-1">oleh {comic.author}</p>
						{/if}
						{#if comic.description}
							<p class="text-xs md:text-sm text-slate-400 line-clamp-2 max-w-xl hidden md:block">{comic.description}</p>
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
							class="w-2 h-2 rounded-full transition-all duration-300 {i === currentSlide ? 'bg-purple-400 w-6' : 'bg-white/30 hover:bg-white/60'}"
							aria-label="Slide {i + 1}"
						></button>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	<!-- ═══════════════════════════════════════ -->
	<!-- Update Komik Diikuti -->
	<!-- ═══════════════════════════════════════ -->
	{#if data.followedUpdates && data.followedUpdates.length > 0}
		<section>
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
					Update Manga Diikuti
				</h2>
				<a href="/following" class="text-sm font-bold text-purple-500 hover:text-purple-400 transition-colors">Lihat Semua →</a>
			</div>
			<div class="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar snap-x">
				{#each data.followedUpdates as item (item.comicId + item.chapterNumber)}
					<a href="/comic/{item.slug}/{item.chapterNumber}" class="shrink-0 snap-start group w-[140px] md:w-[170px] relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 aspect-[3/4] bg-slate-100 dark:bg-slate-900">
						<img src="{item.cover}" alt="{item.title}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
						<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
						<div class="absolute top-2 right-2">
							<span class="inline-block px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-md">NEW</span>
						</div>
						<div class="absolute bottom-0 left-0 right-0 p-3">
							<span class="inline-block px-2 py-0.5 mb-1.5 bg-purple-600 text-white text-[10px] font-bold rounded-md shadow-md">Ch. {item.chapterNumber}</span>
							<h3 class="text-white font-bold text-xs md:text-sm line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors drop-shadow-md">{item.title}</h3>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- ═══════════════════════════════════════ -->
	<!-- Continue Reading -->
	<!-- ═══════════════════════════════════════ -->
	{#if data.continueReading && data.continueReading.length > 0}
		<section>
			<h2 class="text-lg md:text-xl font-black mb-4 text-slate-900 dark:text-white flex items-center gap-2">
				<svg class="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
				Lanjutkan Membaca
			</h2>
			<div class="flex gap-4 overflow-x-auto pb-3 no-scrollbar snap-x">
				{#each data.continueReading as item (item.comicId)}
					<a href="/comic/{item.slug}/{item.chapterNumber}" class="shrink-0 snap-start group w-[140px] md:w-[170px]">
						<div class="aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 mb-2 relative bg-slate-100 dark:bg-slate-900">
							<img src={item.cover} alt={item.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
							<div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-2.5 pt-8">
								<span class="text-[10px] font-bold text-purple-300 bg-purple-600/30 px-2 py-0.5 rounded-md border border-purple-500/20">Ch. {item.chapterNumber}</span>
							</div>
						</div>
						<p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 group-hover:text-purple-400 transition-colors font-medium leading-snug">{item.title}</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- ═══════════════════════════════════════ -->
	<!-- Announcement Banners -->
	<!-- ═══════════════════════════════════════ -->
	{#if data.activeAnnouncements && data.activeAnnouncements.length > 0}
		<section class="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
			{#each data.activeAnnouncements as ann (ann.id)}
				<a
					href={ann.linkUrl || '#'}
					class="shrink-0 snap-start w-full md:w-auto md:grow relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-purple-500/30 transition-all group"
				>
					{#if ann.imageUrl}
						<img src={ann.imageUrl} alt={ann.title} class="w-full h-20 md:h-24 object-cover group-hover:scale-105 transition-transform duration-500" />
						<div class="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center px-5">
							<span class="text-white text-sm font-bold drop-shadow-lg">{ann.title}</span>
						</div>
					{:else}
						<div class="h-20 md:h-24 bg-gradient-to-r from-purple-900/40 to-slate-900 flex items-center px-5">
							<span class="text-white text-sm font-bold">{ann.title}</span>
							{#if ann.content}
								<span class="text-xs text-slate-400 ml-3 hidden md:inline">{ann.content}</span>
							{/if}
						</div>
					{/if}
				</a>
			{/each}
		</section>
	{/if}

	<!-- ═══════════════════════════════════════ -->
	<!-- Spesial Untukmu (Rekomendasi) -->
	<!-- ═══════════════════════════════════════ -->
	{#if data.forYouComics && data.forYouComics.length > 0}
		<section>
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clip-rule="evenodd" /></svg>
					Spesial Untukmu
				</h2>
			</div>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
				{#each data.forYouComics as comic (comic.id)}
					<ComicCard href="/comic/{comic.slug}" {comic} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- Ad Banner (Mid) -->
	<AdBanner ads={data.activeAds} position="homepage_mid" isVip={data.user?.isVip} />

	<!-- ═══════════════════════════════════════ -->
	<!-- Category & Genre Filters -->
	<!-- ═══════════════════════════════════════ -->
	<section class="flex flex-col items-center gap-4">
		<div
			class="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar bg-slate-50 dark:bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-lg"
		>
			{#each categories as cat (cat.id)}
				<button
					onclick={() => setTypeFilter(cat.id)}
					class="whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 {data.typeFilter === cat.id ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}"
				>
					{cat.label}
				</button>
			{/each}
		</div>

		<!-- Genre Filter Pills -->
		{#if data.allGenres && data.allGenres.length > 0}
			<div class="flex items-center gap-2 overflow-x-auto no-scrollbar w-full max-w-4xl pb-1 px-1">
				<button
					onclick={() => setGenreFilter('')}
					class="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border {!data.genreFilter ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-500/50 hover:text-purple-400'}"
				>
					Semua Genre
				</button>
				{#each data.allGenres as genre (genre)}
					<button
						onclick={() => setGenreFilter(genre)}
						class="shrink-0 whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border {data.genreFilter === genre ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30' : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-500/50 hover:text-purple-400'}"
					>
						{genre}
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<!-- ═══════════════════════════════════════ -->
	<!-- Trending Minggu Ini (Grid, bukan scroll) -->
	<!-- ═══════════════════════════════════════ -->
	{#if data.popularComics && data.popularComics.length > 0 && !data.searchQuery && data.typeFilter === 'All' && data.currentPage === 1}
		<section>
			<div class="mb-5 flex items-center gap-3">
				<div class="w-1.5 h-7 bg-purple-500 rounded-full"></div>
				<h2 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">
					🔥 Trending Minggu Ini
				</h2>
			</div>
			<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
				{#each data.popularComics as comic (comic.slug)}
					<ComicCard href="/comic/{comic.slug}" {comic} isHot={true} />
				{/each}
			</div>
		</section>
	{/if}

	<!-- ═══════════════════════════════════════ -->
	<!-- Latest Updates Grid (Katalog) -->
	<!-- ═══════════════════════════════════════ -->
	<section>
		<div class="mb-5 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div class="w-1.5 h-7 bg-emerald-500 rounded-full"></div>
				<div>
					<h2 class="text-lg md:text-xl font-black text-slate-900 dark:text-white">
						{data.searchQuery ? `Hasil Pencarian: "${data.searchQuery}"` : 'Katalog Rilisan Terbaru'}
					</h2>
					{#if data.typeFilter !== 'All' && !data.searchQuery}
						<p class="text-sm font-semibold text-emerald-500 mt-0.5">
							Menampilkan kategori: {data.typeFilter}
						</p>
					{/if}
				</div>
			</div>
		</div>

		{#if data.latestUpdates.length === 0}
			<div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-16 text-center">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
				<h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Pencarian Tidak Ditemukan</h3>
				<p class="text-slate-500 dark:text-slate-400">Tidak ada komik yang cocok dengan kriteria filter atau kunci pencarian Anda.</p>
				<button
					onclick={() => {
						const url = new URL(window.location.href);
						url.searchParams.delete('q');
						url.searchParams.delete('type');
						url.searchParams.delete('genre');
						url.searchParams.delete('page');
						goto(url.toString());
					}}
					class="mt-6 font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-6 py-2.5 rounded-full border border-purple-500/20 transition-colors"
				>Reset Semua Filter</button>
			</div>
		{:else}
			<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
				{#each data.latestUpdates as comic (comic.slug)}
					<ComicCard href="/comic/{comic.slug}" {comic} />
				{/each}
			</div>

			<!-- Pagination Controls -->
			{#if !data.searchQuery && data.totalPages > 1}
				<div class="flex justify-center items-center gap-3 mt-12 mb-8 text-sm font-bold">
					{#if data.currentPage > 1}
						<a
							href="?{data.typeFilter !== 'All' ? 'type=' + data.typeFilter + '&' : ''}page={data.currentPage - 1}"
							class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-purple-600 hover:text-white transition-colors shadow-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 active:scale-95"
						>&larr; Sebelumnya</a>
					{/if}

					<span class="px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl shadow-inner pointer-events-none">
						Halaman <span class="text-purple-400 font-black">{data.currentPage}</span> dari {data.totalPages}
					</span>

					{#if data.currentPage < data.totalPages}
						<a
							href="?{data.typeFilter !== 'All' ? 'type=' + data.typeFilter + '&' : ''}page={data.currentPage + 1}"
							class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-purple-600 hover:text-white transition-colors shadow-lg border border-slate-200 dark:border-slate-700 hover:border-purple-500 active:scale-95"
						>Lanjut &rarr;</a>
					{/if}
				</div>
			{/if}
		{/if}
	</section>
</div>
