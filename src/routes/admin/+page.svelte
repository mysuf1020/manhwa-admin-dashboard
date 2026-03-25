<script lang="ts">
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();

	function formatNumber(n: number): string {
		if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
		if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
		return n.toString();
	}

	function timeAgo(dateStr: string): string {
		const diff = Date.now() - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 60) return `${mins} menit lalu`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `${hours} jam lalu`;
		return `${Math.floor(hours / 24)} hari lalu`;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const maxViews = $derived(
		Math.max(...(data.charts.topComics as any[]).map((d: any) => Number(d.view_count) || 0), 1)
	);
</script>

<div class="md:grid-cols-3 gap-6 mb-8 grid grid-cols-1">
	<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Total Comics</h3>
		<p class="text-3xl font-bold text-slate-900 dark:text-white">{formatNumber(data.stats.comics)}</p>
	</div>
	<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Total Chapters</h3>
		<p class="text-3xl font-bold text-slate-900 dark:text-white">{formatNumber(data.stats.chapters)}</p>
	</div>
	<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="text-slate-600 dark:text-slate-400 text-sm font-medium mb-1">Total Views</h3>
		<p class="text-3xl font-bold text-slate-900 dark:text-white">{formatNumber(data.stats.views)}</p>
	</div>
</div>

<!-- Analytics: Top Comics & Status (CSS-based bars) -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
	<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="font-bold text-slate-900 dark:text-white mb-4">Top Comics by Views</h3>
		<div class="space-y-3">
			{#each (data.charts.topComics as any[]) as item}
				<div>
					<div class="flex justify-between text-sm mb-1">
						<span class="text-slate-700 dark:text-slate-300 truncate mr-2">{item.title}</span>
						<span class="text-slate-500 text-xs font-mono shrink-0">{formatNumber(Number(item.view_count))}</span>
					</div>
					<div class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5">
						<div class="bg-purple-500 h-2.5 rounded-full transition-all" style="width: {(Number(item.view_count) / maxViews * 100).toFixed(1)}%"></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
	<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="font-bold text-slate-900 dark:text-white mb-4">Status Distribution</h3>
		<div class="space-y-3">
			{#each (data.charts.statusDist as any[]) as item, i}
				{@const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500']}
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full {colors[i % colors.length]}"></div>
						<span class="text-sm text-slate-700 dark:text-slate-300">{item.status || 'Unknown'}</span>
					</div>
					<span class="text-sm font-bold text-slate-900 dark:text-white">{item.count}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl shadow-lg overflow-hidden border">
	<div class="px-6 py-4 border-slate-200 dark:border-slate-800 flex items-center justify-between border-b">
		<h2 class="font-bold text-lg text-slate-900 dark:text-white">Recently Added Chapters</h2>
	</div>
	<div class="w-full overflow-x-auto">
		<table class="w-full min-w-max border-collapse text-left">
			<thead>
				<tr class="bg-white dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 text-xs uppercase">
					<th class="py-3 px-6 font-medium">Comic</th>
					<th class="py-3 px-6 font-medium">Chapter</th>
					<th class="py-3 px-6 font-medium">Date</th>
					<th class="py-3 px-6 font-medium text-right">Action</th>
				</tr>
			</thead>
			<tbody class="divide-slate-800 divide-y">
				{#each data.recentChapters as ch (ch.id)}
					<tr class="hover:bg-slate-100 dark:bg-slate-800/50 transition-colors">
						<td class="py-3 px-6 text-sm font-medium text-slate-900 dark:text-white">{ch.comicTitle}</td>
						<td class="py-3 px-6 text-sm text-slate-700 dark:text-slate-300">Ch. {ch.chapterNumber}</td>
						<td class="py-3 px-6 text-sm text-slate-600 dark:text-slate-400">{timeAgo(ch.createdAt)}</td>
						<td class="py-3 px-6 text-right">
							<a href="/admin/chapters/{ch.id}" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs transition-colors">Edit</a>
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan="4" class="py-8 text-center text-slate-500">Belum ada chapter.</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
