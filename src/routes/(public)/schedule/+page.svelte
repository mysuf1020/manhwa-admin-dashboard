<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Tentukan hari saat ini (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
	const todayIndex = new Date().getDay();
	// Format array days kita: Senin(0), Selasa(1), Rabu(2), Kamis(3), Jumat(4), Sabtu(5), Minggu(6)
	const currentDayMapping = todayIndex === 0 ? 6 : todayIndex - 1;
	
	let activeTab = $state(data.days[currentDayMapping]);
</script>

<svelte:head>
	<title>Jadwal Rilis | MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
	<div class="text-center mb-10">
		<h1 class="text-3xl md:text-4xl font-black text-white mb-3">📅 Jadwal Rilis Komik</h1>
		<p class="text-slate-400 max-w-2xl mx-auto">Update komik favoritmu setiap harinya. Jadwal bisa berubah sewaktu-waktu tergantung dari author atau tim penerjemah.</p>
	</div>

	<!-- Day Tabs -->
	<div class="flex overflow-x-auto no-scrollbar gap-2 mb-8 bg-slate-900 border border-slate-800 p-2 rounded-2xl snap-x">
		{#each data.days as day, i (day)}
			<button
				onclick={() => (activeTab = day)}
				class="flex-1 shrink-0 snap-center px-4 md:px-6 py-3 rounded-xl font-bold transition-all text-sm md:text-base border {activeTab === day ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/40' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800 hover:text-slate-200'} {i === currentDayMapping && activeTab !== day ? 'ring-1 ring-purple-500/50' : ''}"
			>
				{day}
				{#if i === currentDayMapping}
					<span class="block text-[10px] font-medium {activeTab === day ? 'text-purple-200' : 'text-purple-400'} mt-0.5">Hari Ini</span>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Content based on Active Tab -->
	<div class="bg-slate-900 border border-slate-800 rounded-2xl min-h-[400px] p-4 md:p-6 shadow-xl relative overflow-hidden">
		<!-- Active day watermank (stylistic) -->
		<div class="absolute -right-10 -bottom-10 text-[150px] font-black text-slate-800/20 select-none pointer-events-none z-0">
			{activeTab}
		</div>

		<div class="relative z-10">
			<h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
				<span class="w-2 h-6 bg-purple-500 rounded-full inline-block"></span>
				Rilisan Tiap {activeTab}
				<span class="bg-slate-800 text-slate-400 text-xs px-2.5 py-1 rounded-full ml-auto">{data.schedule[activeTab].length} Komik</span>
			</h2>

			{#if data.schedule[activeTab].length === 0}
				<div class="py-20 flex flex-col items-center justify-center text-slate-500">
					<svg class="w-16 h-16 mb-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
					<p class="font-medium">Belum ada komik terjadwal untuk hari ini.</p>
				</div>
			{:else}
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
					{#each data.schedule[activeTab] as comic (comic.id)}
						<a href="/comic/{comic.slug}" class="group block relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]">
							<div class="aspect-3/4 w-full relative">
								<img src={comic.cover} alt={comic.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
								<div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>
								<div class="absolute top-2 left-2 flex gap-1 flex-col">
									<span class="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider
										{comic.type === 'Manhwa' ? 'bg-orange-500/90 text-white' : ''}
										{comic.type === 'Manga' ? 'bg-blue-500/90 text-white' : ''}
										{comic.type === 'Manhua' ? 'bg-emerald-500/90 text-white' : ''}">
										{comic.type}
									</span>
								</div>
								<div class="absolute bottom-0 inset-x-0 p-3">
									<h3 class="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors" title={comic.title}>{comic.title}</h3>
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
