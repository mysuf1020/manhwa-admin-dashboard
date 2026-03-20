<script lang="ts">
	let { title, chapterNumber, comicSlug } = $props<{
		title: string;
		chapterNumber: string;
		comicSlug: string;
	}>();
</script>

<nav
	class="top-0 bg-slate-950/80 backdrop-blur-lg border-slate-800/80 px-2 md:px-6 py-3 shadow-lg shadow-purple-900/5 sticky z-50 flex items-center justify-between border-b transition-all duration-300"
>
	<!-- eslint-disable-next-line -->
	<a
		href={`/comic/${comicSlug}`}
		class="text-slate-400 hover:text-white gap-1 md:gap-2 flex items-center transition-colors"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
				clip-rule="evenodd"
			/>
		</svg>
		<span
			class="font-semibold text-sm md:text-base sm:inline md:max-w-none hidden max-w-[150px] truncate"
			>{title}</span
		>
		<span class="sm:hidden font-semibold">Kembali</span>
	</a>

	<div class="font-bold text-lg text-purple-400 tracking-wide">
		Ch. {chapterNumber}
	</div>

	<div class="gap-1 md:gap-2 flex">
		<button
			class="p-2 text-xs md:text-sm bg-slate-900 border-slate-700 rounded hover:bg-slate-800 shadow-sm border transition-colors disabled:opacity-30"
			disabled
		>
			&larr; Prev
		</button>
		<button
			class="p-2 text-xs md:text-sm bg-purple-600 border-purple-500 rounded hover:bg-purple-500 text-white font-medium shadow-md shadow-purple-900/20 border transition-colors"
		>
			Next &rarr;
		</button>
	</div>
</nav>
