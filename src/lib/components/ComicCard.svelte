<script lang="ts">
	let {
		href,
		isHot = false,
		comic
	} = $props<{
		href: string;
		isHot?: boolean;
		comic: import('$lib/types').ComicList;
	}>();

	let slug = $derived(href.replace('/comic/', ''));
</script>

<a {href} class="comic-card group block relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:-translate-y-1 aspect-[3/4] bg-slate-100 dark:bg-slate-900">
	<img
		src={comic.cover}
		alt={comic.title}
		class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
		loading="lazy"
	/>

	<!-- Gradient overlay -->
	<div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

	<!-- HOT badge -->
	{#if isHot}
		<div class="absolute top-2 left-2 z-10">
			<span class="inline-block bg-purple-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-lg shadow-purple-600/30">HOT</span>
		</div>
	{/if}

	<!-- Bottom info -->
	<div class="absolute bottom-0 left-0 right-0 p-3 z-10 flex flex-col justify-end">
		<h3 class="font-bold text-white text-xs sm:text-sm mb-1.5 group-hover:text-purple-300 line-clamp-2 transition-colors leading-tight drop-shadow-md">
			{comic.title}
		</h3>
		{#if comic.chapters && comic.chapters.length > 0}
			<div class="flex flex-col gap-0.5 relative z-20">
				{#each comic.chapters.slice(0, 3) as ch}
					<button 
						onclick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/comic/${slug}/${ch.number}`; }}
						class="w-full text-left flex items-center justify-between hover:bg-white/10 rounded px-1.5 py-0.5 -mx-1 transition-colors relative"
					>
						<span class="text-[10px] sm:text-xs font-semibold text-indigo-300">Ch. {ch.number}</span>
						<span class="text-[9px] sm:text-[10px] text-slate-400">{ch.time}</span>
					</button>
				{/each}
			</div>
		{:else}
			<div class="flex items-center justify-between relative z-20">
				<span class="text-[10px] sm:text-xs font-semibold text-slate-300">{comic.chapter}</span>
				<span class="text-[9px] sm:text-[10px] text-slate-400 hidden sm:inline">{comic.time}</span>
			</div>
		{/if}
	</div>
</a>

<style>
	.comic-card {
		container-type: inline-size;
	}
</style>
