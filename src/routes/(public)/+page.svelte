<script lang="ts">
	import ComicCard from '$lib/components/ComicCard.svelte';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

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

<div class="max-w-7xl px-4 py-8 mx-auto">
	<!-- Hero Section with Search (Removed entirely) -->

	<!-- Filters -->
	<section class="max-w-4xl mx-auto mb-16 relative z-20 -mt-16 flex justify-center px-4">
		<div
			class="flex flex-wrap items-center justify-center gap-3 bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-700/50 shadow-xl shadow-black/40"
		>
			{#each categories as cat (cat.id)}
				<button
					onclick={() => setTypeFilter(cat.id)}
					class={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${data.typeFilter === cat.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
				>
					{cat.label}
				</button>
			{/each}
		</div>
	</section>

	<!-- Popular Comics Section -->
	{#if data.popularComics && data.popularComics.length > 0 && !data.searchQuery && data.typeFilter === 'All' && data.currentPage === 1}
		<section class="mb-12">
			<div class="mb-6 flex items-center justify-between">
				<h2 class="text-2xl font-black text-white flex items-center gap-3 px-2">
					Trending Minggu Ini
				</h2>
			</div>
			<!-- Container bergeser (Horizontal Scroll) -->
			<div class="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar border-b border-slate-800/80">
				{#each data.popularComics as comic (comic.slug)}
					<div class="min-w-[140px] md:min-w-[170px] snap-start shrink-0">
						<ComicCard href="/comic/{comic.slug}" {comic} isHot={true} />
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Latest Updates Grid -->
	<section>
		<div class="mb-6 flex items-center justify-between px-2 pt-2">
			<div>
				<h2 class="text-2xl font-black text-white flex items-center gap-3">
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
			<div class="md:grid-cols-4 lg:grid-cols-6 gap-6 grid grid-cols-2">
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
							class="px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg border border-emerald-500/20 hover:border-emerald-500 active:scale-95"
							>&larr; Sebelumnya</a
						>
					{/if}

					<span
						class="px-5 py-2.5 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl shadow-inner pointer-events-none"
					>
						Halaman <span class="text-emerald-400">{data.currentPage}</span> dari {data.totalPages}
					</span>

					{#if data.currentPage < data.totalPages}
						<a
							href="?{data.typeFilter !== 'All' ? 'type=' + data.typeFilter + '&' : ''}page={data.currentPage + 1}"
							class="px-5 py-2.5 bg-slate-800 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg border border-emerald-500/20 hover:border-emerald-500 active:scale-95"
							>Lanjut &rarr;</a
						>
					{/if}
				</div>
			{/if}
		{/if}
	</section>
</div>
