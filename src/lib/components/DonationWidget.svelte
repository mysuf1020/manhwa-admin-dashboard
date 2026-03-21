<script lang="ts">
	let { trakteerUrl = "https://trakteer.id/mangareader", saweriaUrl = "https://saweria.co/mangareader" } = $props<{ trakteerUrl?: string; saweriaUrl?: string; }>();
</script>

<div class="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/5 border border-amber-200 dark:border-amber-700/30 rounded-3xl p-6 md:p-8 text-center shadow-lg w-full max-w-3xl mx-auto my-10 relative overflow-hidden">
	<!-- Decorative background blob -->
	<div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
	<div class="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

	<div class="mb-4 relative z-10 animate-bounce">
		<span class="text-5xl drop-shadow-md">☕️</span>
	</div>
	
	<h3 class="text-2xl font-black text-amber-900 dark:text-amber-500 mb-2 relative z-10 tracking-tight">Dukung Sang Penerjemah!</h3>
	<p class="text-amber-800/80 dark:text-amber-200/70 text-sm mb-8 max-w-lg mx-auto relative z-10 leading-relaxed font-medium">
		Suka dengan terjemahan komik ini? Bantulah admin beli kopi (dan bayar tagihan server) agar update chapter selalu ngebut dan tanpa iklan!
	</p>
	
	<div class="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
		<a href={trakteerUrl} target="_blank" rel="noopener noreferrer" class="group flex items-center justify-center gap-3 bg-[#be1e2d] hover:bg-[#9a1824] text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-xl shadow-red-500/20 active:scale-95 border border-red-400/30 overflow-hidden relative">
			<div class="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
			<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
			Trakteer
		</a>
		
		<a href={saweriaUrl} target="_blank" rel="noopener noreferrer" class="group flex items-center justify-center gap-3 bg-[#E9B10D] hover:bg-[#d6a20b] text-slate-900 font-bold py-3.5 px-8 rounded-xl transition-all shadow-xl shadow-yellow-500/20 active:scale-95 border border-yellow-200 overflow-hidden relative">
			<div class="absolute inset-0 bg-linear-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
			<svg class="h-6 w-6" viewBox="0 0 512 512" fill="currentColor">
				<path d="M472.9 69.1l-146.4 17.6c-7.3.9-14.7-2.6-18.4-9l-82.5-144c-3.1-5.3-8.8-8.6-14.9-8.6h0c-6.1 0-11.8 3.3-14.9 8.6L113.3 77.7c-3.7 6.4-11 9.9-18.4 9L6.5 69.1C3 68.7-.1 71.4 0 75v346c0 30.9 25.1 56 56 56h400c30.9 0 56-25.1 56-56V75c0-3.6-3-6.3-6.5-5.9zM256 424c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"/>
				<path d="M256 248c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z"/>
			</svg>
			Saweria
		</a>
	</div>
</div>
