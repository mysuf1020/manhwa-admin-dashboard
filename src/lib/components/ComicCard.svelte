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
	class="group block rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
	style="position: relative; display: block; height: 100%;"
>
	<img
		src={comic.cover}
		alt={comic.title}
		class="transition-transform duration-500 group-hover:scale-105"
		style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;"
		loading="lazy"
	/>
	<div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.2) 60%, transparent 100%);"></div>
	{#if isHot}
		<div class="bg-purple-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-white" style="position: absolute; top: 8px; left: 8px; z-index: 10;">HOT</div>
	{/if}
	<div style="position: absolute; bottom: 0; left: 0; right: 0; padding: 10px;">
		<h3 class="font-bold text-white text-xs md:text-sm mb-1.5 group-hover:text-purple-400 line-clamp-2 transition-colors leading-tight" style="text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
			{comic.title}
		</h3>
		{#if comic.chapters && comic.chapters.length > 0}
			<div style="display: flex; flex-direction: column; gap: 2px;">
				{#each comic.chapters as ch}
					<div class="flex items-center justify-between">
						<span class="text-[10px] md:text-xs font-semibold" style="color: #a5b4fc;">Ch. {ch.number}</span>
						<span class="text-[9px] md:text-[10px]" style="color: #94a3b8;">{ch.time}</span>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex items-center justify-between">
				<span class="text-[10px] md:text-xs" style="color: #cbd5e1;">{comic.chapter}</span>
				<span class="text-[10px] hidden sm:inline" style="color: #94a3b8;">{comic.time}</span>
			</div>
		{/if}
	</div>
</a>
