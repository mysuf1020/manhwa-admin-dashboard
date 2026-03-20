<script lang="ts">
	let { chapterNumber } = $props<{ chapterNumber: string }>();
</script>

<div
	class="max-w-3xl mt-12 py-12 px-4 border-slate-800/60 from-black to-slate-950 flex w-full flex-col items-center border-t bg-linear-to-b text-center"
>
	<h2 class="text-lg md:text-xl font-medium text-slate-300 mb-6">
		Akhir dari Chapter {chapterNumber}
	</h2>
	<div class="sm:flex-row gap-4 max-w-md flex w-full flex-col justify-center">
		<button
			class="bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-xl font-bold shadow-lg w-full transition-all active:scale-95"
		>
			Komentar
		</button>
		<button
			class="from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-purple-900/30 w-full bg-linear-to-r whitespace-nowrap transition-all active:scale-95"
		>
			Lanjut Chapter
		</button>
	</div>
</div>
