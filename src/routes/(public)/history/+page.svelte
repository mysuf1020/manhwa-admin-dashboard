<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date) {
		const relative = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
		const diff = Math.floor((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
		
		if (diff === 0) return 'Hari ini';
		if (diff === -1) return 'Kemarin';
		if (diff > -7) return relative.format(diff, 'day');
		
		return new Intl.DateTimeFormat('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Riwayat Baca | MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<div class="flex items-center gap-3 mb-8">
		<div class="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
			<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		</div>
		<div>
			<h1 class="text-3xl font-black text-white">Riwayat Baca</h1>
			<p class="text-sm text-slate-400 mt-1">Lanjutkan kembali komik yang sedang Anda ikuti.</p>
		</div>
	</div>

	{#if data.history.length === 0}
		<div class="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
			<div class="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-500">
				<svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
			</div>
			<h3 class="text-lg font-bold text-white mb-2">Belum ada riwayat baca</h3>
			<p class="text-sm text-slate-400 mb-6 max-w-sm mx-auto">Anda belum membaca komik apa pun. Jelajahi beranda untuk mencari judul menarik.</p>
			<a href="/" class="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
				Eksplor Komik
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each data.history as item (item.comicId)}
				<a href="/comic/{item.slug}/{item.chapterNumber}" class="group bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-xl p-3 flex gap-4 transition-all hover:bg-slate-800/50">
					<div class="w-20 h-28 shrink-0 rounded-lg overflow-hidden relative">
						<img src={item.cover} alt={item.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
						<div class="absolute inset-0 border border-white/10 rounded-lg"></div>
					</div>
					
					<div class="flex flex-col py-1 overflow-hidden">
						<h3 class="font-bold text-slate-200 group-hover:text-purple-400 transition-colors line-clamp-2 md:text-lg mb-1 leading-snug" title={item.title}>{item.title}</h3>
						
						<div class="mt-auto">
							<div class="inline-flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-xs font-bold text-purple-300 mb-2">
								<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
								Bab {item.chapterNumber}
							</div>
							
							<div class="flex items-center gap-1.5 text-xs text-slate-500">
								<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
								{formatDate(item.readAt)}
							</div>
						</div>
					</div>
				</a>
			{/each}
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="mt-10 flex justify-center gap-2">
				{#each Array(data.totalPages) as _, i (i)}
					<a
						href="/history?page={i + 1}"
						class="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors
						{data.currentPage === i + 1 
							? 'bg-purple-600 text-white border border-purple-500' 
							: 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white'}"
					>
						{i + 1}
					</a>
				{/each}
			</div>
		{/if}
	{/if}
</div>
