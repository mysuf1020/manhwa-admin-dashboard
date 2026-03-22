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
	class="group bg-slate-50 dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 hover:border-purple-500/50 flex flex-col overflow-hidden border transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
>
	<div class="relative aspect-3/4 overflow-hidden">
		<img
			src={comic.cover}
			alt={comic.title}
			class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
			loading="lazy"
		/>
		{#if isHot}
			<div class="top-2 left-2 bg-purple-600 text-[10px] font-bold px-2 py-0.5 rounded absolute uppercase tracking-wider">HOT</div>
		{/if}
	</div>
	<div class="p-3 flex grow flex-col justify-between">
		<div>
			<h3 class="font-bold text-xs md:text-sm mb-1 group-hover:text-purple-400 line-clamp-2 transition-colors">
				{comic.title}
			</h3>
		</div>
		<div class="mt-2 flex items-center justify-between">
			<span class="text-[10px] md:text-xs text-slate-600 dark:text-slate-400">{comic.chapter}</span>
			<span class="text-slate-500 text-[10px] hidden sm:inline">{comic.time}</span>
		</div>
	</div>
</a>
