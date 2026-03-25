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
</script>

<a
	{href}
	class="group block relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] aspect-3/4 h-full w-full"
>
	<img
		src={comic.cover}
		alt={comic.title}
		class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
		loading="lazy"
	/>
	<div class="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>
	{#if isHot}
		<div class="absolute top-2 left-2 bg-purple-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white z-10">HOT</div>
	{/if}
	<div class="absolute bottom-0 left-0 right-0 p-3">
		<h3 class="font-bold text-white text-xs md:text-sm mb-1 group-hover:text-purple-400 line-clamp-2 transition-colors drop-shadow-md leading-tight">
			{comic.title}
		</h3>
		<div class="flex items-center justify-between">
			<span class="text-[10px] md:text-xs text-slate-300">{comic.chapter}</span>
			<span class="text-slate-400 text-[10px] hidden sm:inline">{comic.time}</span>
		</div>
	</div>
</a>

