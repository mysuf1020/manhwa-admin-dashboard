<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const todayIndex = new Date().getDay();
	const currentDayMapping = todayIndex === 0 ? 6 : todayIndex - 1;
	
	let activeTab = $state(data.days[currentDayMapping]);
</script>

<svelte:head>
	<title>Jadwal Rilis | MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
	<div class="text-center mb-10">
		<h1 class="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">📅 Jadwal Rilis Komik</h1>
		<p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Update komik favoritmu setiap harinya. Jadwal bisa berubah sewaktu-waktu.</p>
	</div>

	<!-- Day Tabs -->
	<div class="flex overflow-x-auto no-scrollbar gap-1.5 mb-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl snap-x shadow-sm">
		{#each data.days as day, i (day)}
			<button
				onclick={() => (activeTab = day)}
				class="flex-1 shrink-0 snap-center px-3 md:px-5 py-3 rounded-xl font-bold transition-all duration-200 text-sm md:text-base min-w-[80px] {activeTab === day ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'} {i === currentDayMapping && activeTab !== day ? 'ring-1 ring-purple-500/50' : ''}"
			>
				{day}
				{#if i === currentDayMapping}
					<span class="block text-[10px] font-medium mt-0.5 {activeTab === day ? 'text-purple-200' : 'text-purple-400'}">Hari Ini</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Content -->
	<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl min-h-[400px] p-4 md:p-6 shadow-xl relative overflow-hidden">
		<!-- Decorative watermark -->
		<div class="absolute -right-8 -bottom-8 text-[120px] md:text-[150px] font-black text-slate-100 dark:text-slate-800/30 select-none pointer-events-none z-0 leading-none">
			{activeTab}
		</div>

		<div class="relative z-10">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
					<span class="w-1.5 h-6 bg-purple-500 rounded-full inline-block"></span>
					Rilisan Tiap {activeTab}
				</h2>
				<span class="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-full">{data.schedule[activeTab].length} Komik</span>
			</div>

			{#if data.schedule[activeTab].length === 0}
				<div class="py-20 flex flex-col items-center justify-center text-slate-400">
					<svg class="w-16 h-16 mb-4 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					<p class="font-medium text-lg">Belum ada komik terjadwal untuk hari ini.</p>
				</div>
			{:else}
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
					{#each data.schedule[activeTab] as comic (comic.id)}
						<a href="/comic/{comic.slug}" class="group block relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
							<div class="aspect-[3/4] w-full relative">
								<img src={comic.cover} alt={comic.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
								<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
								<div class="absolute top-2 left-2">
									<span class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-md
										{comic.type === 'Manhwa' ? 'bg-orange-500 text-white' : ''}
										{comic.type === 'Manga' ? 'bg-blue-500 text-white' : ''}
										{comic.type === 'Manhua' ? 'bg-emerald-500 text-white' : ''}">
										{comic.type}
									</span>
								</div>
								<div class="absolute bottom-0 inset-x-0 p-3">
									<h3 class="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors drop-shadow-md" title={comic.title}>{comic.title}</h3>
									<p class="text-[10px] text-slate-400 mt-1 line-clamp-1">{comic.genres || 'Unknown Genre'}</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
