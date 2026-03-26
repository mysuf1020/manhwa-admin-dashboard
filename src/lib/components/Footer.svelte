<footer class="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-16">
	<div class="max-w-7xl mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
			<!-- Brand -->
			<div>
				<h3 class="text-xl font-black mb-3">
					<span class="bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">MangaReader</span>
				</h3>
				<p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">Platform baca komik online gratis. Manhwa, Manga, dan Manhua terlengkap dengan update tercepat.</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Navigasi</h4>
				<div class="flex flex-col gap-2.5">
					<a href="/" class="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-400 transition-colors">Beranda</a>
					<a href="/search" class="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-400 transition-colors">Pencarian</a>
					<a href="/ranking" class="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-400 transition-colors">Ranking</a>
					<a href="/schedule" class="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-400 transition-colors">Jadwal Rilis</a>
					<a href="/history" class="text-sm text-slate-500 dark:text-slate-400 hover:text-purple-400 transition-colors">Riwayat Baca</a>
				</div>
			</div>

			<!-- Genre -->
			<div>
				<h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Genre Populer</h4>
				<div class="flex flex-wrap gap-2">
					{#each ['Action', 'Fantasy', 'Romance', 'Comedy', 'Drama', 'Horror', 'Isekai', 'Martial Arts'] as genre (genre)}
						<a href="/genre/{genre}" class="text-xs bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 transition-colors">{genre}</a>
					{/each}
				</div>
			</div>
		</div>

		<div class="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
			<p class="text-xs text-slate-400 dark:text-slate-500">&copy; {new Date().getFullYear()} MangaReader. Dibangun dengan SvelteKit & Tailwind CSS.</p>
			<p class="text-xs text-slate-400 dark:text-slate-500">Semua komik adalah milik penulis dan penerbit masing-masing.</p>
		</div>
	</div>
</footer>
