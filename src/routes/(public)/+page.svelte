<script lang="ts">
	import ComicCard from '$lib/components/ComicCard.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	// Extracted initial state to satisfy Svelte compile-time checking rules
	const initialQuery = data.searchQuery;
	let searchInput = $state(initialQuery);

	$effect(() => {
		searchInput = data.searchQuery;
	});

	// Handler form action (Hijacking native behavior to perform Client-Side CSR Svelte Routing)
	function handleSearch(e: Event) {
		e.preventDefault();
		const url = new URL(window.location.href);
		if (searchInput) {
			url.searchParams.set('q', searchInput);
		} else {
			url.searchParams.delete('q');
		}
		// Reset to page 1 natively if pagination existed, simply go to new URL parameters natively
		goto(url.toString(), { keepFocus: true });
	}

	function setTypeFilter(type: string) {
		const url = new URL(window.location.href);
		if (type === 'All') {
			url.searchParams.delete('type');
		} else {
			url.searchParams.set('type', type);
		}
		goto(url.toString(), { keepFocus: true });
	}

	const categories = [
		{ id: 'All', label: 'Semua Rilisan', icon: '📚' },
		{ id: 'Manhwa', label: 'Manhwa', icon: '🔥' },
		{ id: 'Manga', label: 'Manga', icon: '❤️' },
		{ id: 'Manhua', label: 'Manhua', icon: '🐉' }
	];
</script>

<svelte:head>
	<title>MangaReader - Katalog Lengkap</title>
</svelte:head>

<div class="max-w-7xl px-4 py-8 mx-auto">
	<!-- Hero Section with Search -->
	<section
		class="mb-10 rounded-3xl bg-slate-900 border-slate-800 border shadow-2xl relative flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden"
	>
		<div
			class="absolute inset-0 bg-[url('https://picsum.photos/seed/manga/1200/400')] opacity-10 blur-sm object-cover"
		></div>
		<div class="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/80 to-transparent"></div>

		<div class="relative z-10 w-full max-w-3xl mx-auto text-center">
			<h1 class="text-4xl md:text-6xl font-black mb-4 tracking-tight translate-y-2">
				Eksplorasi Dunia <span
					class="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-emerald-400"
					>Komik</span
				>
			</h1>
			<p class="text-slate-400 text-lg mb-8 font-medium">
				Ribuan judul Manhwa, Manga, dan Manhua siap dibaca kapan saja tanpa gangguan.
			</p>

			<form
				onsubmit={handleSearch}
				class="relative flex items-center w-full max-w-2xl mx-auto shadow-2xl shadow-purple-900/20 group"
			>
				<div
					class="absolute left-4 text-slate-400 group-focus-within:text-purple-400 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/></svg
					>
				</div>
				<input
					type="search"
					bind:value={searchInput}
					placeholder="Cari judul komik favoritmu disini..."
					class="w-full bg-slate-950/80 backdrop-blur-md border-2 border-slate-700 focus:border-purple-500 rounded-2xl py-4 pl-12 pr-32 text-white font-medium text-lg focus:outline-none transition-all focus:ring-4 focus:ring-purple-500/10 placeholder-slate-500"
				/>
				<button
					type="submit"
					class="absolute right-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg active:scale-95"
				>
					Cari
				</button>
			</form>
		</div>
	</section>

	<!-- Filters -->
	<section class="max-w-4xl mx-auto mb-12 relative z-20 -mt-16 flex justify-center px-4">
		<div
			class="flex flex-wrap items-center justify-center gap-3 bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-700/50 shadow-xl shadow-black/40"
		>
			{#each categories as cat (cat.id)}
				<button
					onclick={() => setTypeFilter(cat.id)}
					class={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${data.typeFilter === cat.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
				>
					<span class="text-lg">{cat.icon}</span>
					{cat.label}
				</button>
			{/each}
		</div>
	</section>

	<!-- Latest Updates Grid -->
	<section>
		<div class="mb-8 flex items-center justify-between">
			<div>
				<h2 class="text-2xl font-black text-white flex items-center gap-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-7 w-7 text-purple-500"
						viewBox="0 0 20 20"
						fill="currentColor"
						><path
							fill-rule="evenodd"
							d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
							clip-rule="evenodd"
						/></svg
					>
					{data.searchQuery ? `Hasil Pencarian: "${data.searchQuery}"` : 'Katalog Terbaru'}
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
				class="bg-slate-900 border border-slate-800 border-dashed rounded-3xl p-16 text-center shadow-inner"
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
				<h3 class="text-xl font-bold text-white mb-2">Pencarian Tidak Ditemukan</h3>
				<p class="text-slate-400">
					Tidak ada komik yang cocok dengan kriteria filter atau kunci pencarian Anda.
				</p>
				<button
					onclick={() => {
						searchInput = '';
						setTypeFilter('All');
					}}
					class="mt-6 font-bold text-purple-400 hover:text-purple-300 decoration-purple-500 hover:underline"
					>Reset Semua Filter</button
				>
			</div>
		{:else}
			<div class="md:grid-cols-4 lg:grid-cols-6 gap-6 grid grid-cols-2">
				{#each data.latestUpdates as comic (comic.slug)}
					<ComicCard href="/comic/{comic.slug}" {comic} isHot={true} />
				{/each}
			</div>
		{/if}
	</section>
</div>
