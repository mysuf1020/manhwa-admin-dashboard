<script lang="ts">
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

	let { data }: { data: PageData } = $props();

	function handleMetricsFilter(metric: string) {
		const url = new URL(window.location.href);
		if (metric === 'views') {
			url.searchParams.delete('metric');
		} else {
			url.searchParams.set('metric', metric);
		}
		goto(url.toString(), { keepFocus: true });
	}

	function handleTypeFilter(type: string) {
		const url = new URL(window.location.href);
		if (type === 'All') {
			url.searchParams.delete('type');
		} else {
			url.searchParams.set('type', type);
		}
		goto(url.toString(), { keepFocus: true });
	}
</script>

<svelte:head>
	<title>Ranking Leaderboard | MangaReader</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8 md:py-12">
	<!-- Header -->
	<div class="text-center mb-10">
		<h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">👑 Leaderboard</h1>
		<p class="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Komik terbaik dan terpopuler sepanjang masa.</p>
	</div>

	<!-- Filter Controls -->
	<div class="flex flex-col sm:flex-row gap-3 justify-between bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 mb-8 shadow-sm">
		<!-- Metric Toggle -->
		<div class="flex gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
			<button
				onclick={() => handleMetricsFilter('views')}
				class="flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 {data.metric === 'views' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'}"
			>
				🔥 Terpopuler
			</button>
			<button
				onclick={() => handleMetricsFilter('rating')}
				class="flex-1 px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 {data.metric === 'rating' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'}"
			>
				⭐ Tertinggi
			</button>
		</div>

		<!-- Type Filter -->
		<div class="flex gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
			{#each ['All', 'Manhwa', 'Manga', 'Manhua'] as type (type)}
				<button
					onclick={() => handleTypeFilter(type)}
					class="px-4 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 whitespace-nowrap {data.typeFilter === type ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}"
				>
					{type === 'All' ? 'Semua Tipe' : type}
				</button>
			{/each}
		</div>
	</div>

	<!-- Ranking List -->
	<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
		{#if data.topComics.length === 0}
			<div class="p-16 text-center">
				<p class="text-slate-400 font-medium text-lg">Belum ada komik di kategori ini.</p>
			</div>
		{:else}
			{#each data.topComics as comic, i (comic.id)}
				<a href="/comic/{comic.slug}" class="flex items-center gap-4 p-4 md:p-5 border-b border-slate-100 dark:border-slate-800/50 last:border-none hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group {i === 0 ? 'bg-gradient-to-r from-amber-500/5 to-transparent' : ''}">
					<!-- Rank Number -->
					<div class="w-10 md:w-12 shrink-0 flex items-center justify-center font-black">
						{#if i === 0}
							<span class="text-3xl md:text-4xl text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">1</span>
						{:else if i === 1}
							<span class="text-2xl md:text-3xl text-slate-400">2</span>
						{:else if i === 2}
							<span class="text-2xl md:text-3xl text-amber-600">3</span>
						{:else}
							<span class="text-lg md:text-xl text-slate-500">{i + 1}</span>
						{/if}
					</div>

					<!-- Cover -->
					<div class="w-14 h-[72px] md:w-16 md:h-20 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
						<img src={comic.cover} alt={comic.title} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
					</div>

					<!-- Info -->
					<div class="grow min-w-0">
						<h3 class="text-base md:text-lg font-bold text-slate-900 dark:text-white truncate mb-1 group-hover:text-purple-400 transition-colors">{comic.title}</h3>
						<div class="flex items-center gap-2 mb-1.5 flex-wrap">
							<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md
								{comic.type === 'Manhwa' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : ''}
								{comic.type === 'Manga' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : ''}
								{comic.type === 'Manhua' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : ''}"
							>{comic.type}</span>
							{#if comic.status === 'Ongoing'}
								<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">Ongoing</span>
							{:else}
								<span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Completed</span>
							{/if}
						</div>
						<p class="text-xs text-slate-400 truncate hidden sm:block">{comic.genres}</p>
					</div>

					<!-- Metrics -->
					<div class="shrink-0 text-right">
						{#if data.metric === 'views'}
							<div class="text-base md:text-lg font-black text-purple-400 mb-0.5 flex items-center gap-1 justify-end">
								<svg class="w-4 h-4 md:w-5 md:h-5 text-purple-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
								{new Intl.NumberFormat('id-ID').format(comic.views)}
							</div>
							<div class="text-xs text-slate-500 flex justify-end items-center gap-1">
								<span class="text-amber-500">★</span> {comic.rating.toFixed(1)}
							</div>
						{:else}
							<div class="text-base md:text-lg font-black text-amber-400 mb-0.5 flex items-center gap-1 justify-end">
								<svg class="w-4 h-4 md:w-5 md:h-5 text-amber-500/70" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
								{comic.rating.toFixed(1)}
							</div>
							<div class="text-xs text-slate-500 flex justify-end items-center gap-1">
								{new Intl.NumberFormat('id-ID').format(comic.views)} views
							</div>
						{/if}
					</div>
				</a>
			{/each}
		{/if}
	</div>
</div>
