<script lang="ts">
	import type { PageData } from './$types';
	import ComicCard from '$lib/components/ComicCard.svelte';
	import ComicCardSkeleton from '$lib/components/ComicCardSkeleton.svelte';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let q = $state(data.filters.q);
	let genre = $state(data.filters.genre);
	let status = $state(data.filters.status);
	let type = $state(data.filters.type);
	let sort = $state(data.filters.sort);

	const genres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Isekai', 'Martial Arts', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller'];

	function applyFilters() {
		const url = new URL(window.location.href);
		url.search = '';
		if (q) url.searchParams.set('q', q);
		if (genre) url.searchParams.set('genre', genre);
		if (status) url.searchParams.set('status', status);
		if (type) url.searchParams.set('type', type);
		if (sort && sort !== 'latest') url.searchParams.set('sort', sort);
		goto(url.toString(), { keepFocus: true });
	}

	function clearAll() {
		q = ''; genre = ''; status = ''; type = ''; sort = 'latest';
		goto('/search');
	}
</script>

<svelte:head>
	<title>Pencarian Lanjutan | MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-black text-white mb-6">Pencarian Lanjutan</h1>

	<!-- Filter Bar -->
	<div class="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-5 mb-8 shadow-lg">
		<div class="flex flex-col md:flex-row gap-3 mb-4">
			<input
				bind:value={q}
				placeholder="Cari judul komik..."
				class="grow bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
				onkeydown={(e) => { if (e.key === 'Enter') applyFilters(); }}
			/>
			<button onclick={applyFilters} class="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-lg transition-colors shrink-0">
				Cari
			</button>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
			<select bind:value={genre} onchange={applyFilters} class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-purple-500 focus:outline-none appearance-none">
				<option value="">Semua Genre</option>
				{#each genres as g (g)}
					<option value={g}>{g}</option>
				{/each}
			</select>

			<select bind:value={status} onchange={applyFilters} class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-purple-500 focus:outline-none appearance-none">
				<option value="">Semua Status</option>
				<option value="Ongoing">Ongoing</option>
				<option value="Completed">Completed</option>
				<option value="Hiatus">Hiatus</option>
			</select>

			<select bind:value={type} onchange={applyFilters} class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-purple-500 focus:outline-none appearance-none">
				<option value="">Semua Tipe</option>
				<option value="Manhwa">Manhwa</option>
				<option value="Manga">Manga</option>
				<option value="Manhua">Manhua</option>
			</select>

			<select bind:value={sort} onchange={applyFilters} class="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-purple-500 focus:outline-none appearance-none">
				<option value="latest">Terbaru</option>
				<option value="popular">Terpopuler</option>
				<option value="rating">Rating Tertinggi</option>
				<option value="az">A-Z</option>
				<option value="za">Z-A</option>
				<option value="oldest">Terlama</option>
			</select>
		</div>

		{#if data.filters.q || data.filters.genre || data.filters.status || data.filters.type}
			<div class="mt-3 flex items-center gap-2 flex-wrap">
				<span class="text-xs text-slate-500">Filter aktif:</span>
				{#if data.filters.q}
					<span class="text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">"{data.filters.q}"</span>
				{/if}
				{#if data.filters.genre}
					<span class="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">{data.filters.genre}</span>
				{/if}
				{#if data.filters.status}
					<span class="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">{data.filters.status}</span>
				{/if}
				{#if data.filters.type}
					<span class="text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">{data.filters.type}</span>
				{/if}
				<button onclick={clearAll} class="text-xs text-red-400 hover:text-red-300 ml-auto transition-colors">✕ Reset</button>
			</div>
		{/if}
	</div>

	<!-- Results -->
	<div class="flex items-center justify-between mb-4">
		<p class="text-sm text-slate-400">{data.total} komik ditemukan</p>
	</div>

	{#if $navigating}
		<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
			{#each Array(12) as _, i (i)}
				<ComicCardSkeleton />
			{/each}
		</div>
	{:else if data.results.length === 0}
		<div class="text-center py-20 text-slate-600">
			<svg class="w-16 h-16 mx-auto mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
			<p class="text-lg font-semibold mb-1">Tidak ada hasil</p>
			<p class="text-sm">Coba ubah kata kunci atau filter pencarian Anda.</p>
		</div>
	{:else}
		<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
			{#each data.results as comic (comic.id)}
				<ComicCard href="/comic/{comic.slug}" {comic} />
			{/each}
		</div>
	{/if}
</div>
