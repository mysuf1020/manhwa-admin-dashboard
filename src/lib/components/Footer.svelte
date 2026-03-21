<footer class="bg-slate-950 border-t border-slate-800/50 mt-12">
	<div class="max-w-7xl mx-auto px-4 py-10">
		<!-- Top Section -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
			<!-- Brand -->
			<div>
				<h3 class="text-xl font-black text-white mb-2">Manga<span class="text-purple-400">Reader</span></h3>
				<p class="text-sm text-slate-500 leading-relaxed">Platform baca komik online gratis. Manhwa, Manga, dan Manhua terlengkap dengan update tercepat.</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Navigasi</h4>
				<div class="flex flex-col gap-2">
					<a href="/" class="text-sm text-slate-500 hover:text-purple-400 transition-colors">Beranda</a>
					<a href="/search" class="text-sm text-slate-500 hover:text-purple-400 transition-colors">Pencarian</a>
					<a href="/ranking" class="text-sm text-slate-500 hover:text-purple-400 transition-colors">Ranking</a>
					<a href="/history" class="text-sm text-slate-500 hover:text-purple-400 transition-colors">Riwayat Baca</a>
				</div>
			</div>

			<!-- Genre -->
			<div>
				<h4 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Genre Populer</h4>
				<div class="flex flex-wrap gap-1.5">
					{#each ['Action', 'Fantasy', 'Romance', 'Comedy', 'Drama', 'Horror', 'Isekai', 'Martial Arts'] as genre (genre)}
						<a href="/genre/{genre}" class="text-xs bg-slate-900 text-slate-500 border border-slate-800 px-2.5 py-1 rounded-full hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/20 transition-colors">{genre}</a>
					{/each}
				</div>
			</div>
		</div>

		<!-- Divider -->
		<div class="border-t border-slate-800/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
			<p class="text-xs text-slate-600">&copy; {new Date().getFullYear()} MangaReader. Dibangun dengan SvelteKit & Tailwind CSS.</p>
			<p class="text-xs text-slate-700">Semua komik adalah milik penulis dan penerbit masing-masing.</p>
		</div>
	</div>
</footer>
