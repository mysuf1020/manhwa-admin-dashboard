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

	import { Pie, Bar } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		LinearScale,
		BarElement
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

	let statusChartData = $derived({
		labels: data.charts.statusDist.map((d: any) => d.status || 'Unknown'),
		datasets: [
			{
				data: data.charts.statusDist.map((d: any) => Number(d.count)),
				backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'],
				borderWidth: 0
			}
		]
	});

	let topComicsChartData = $derived({
		labels: data.charts.topComics.map((d: any) => d.title.substring(0, 15) + '...'),
		datasets: [
			{
				label: 'Views',
				data: data.charts.topComics.map((d: any) => d.view_count),
				backgroundColor: '#a855f7',
				borderRadius: 6
			}
		]
	});
</script>

<div class="md:grid-cols-3 gap-6 mb-8 grid grid-cols-1">
	<div class="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="text-slate-400 text-sm font-medium mb-1">Total Comics</h3>
		<p class="text-3xl font-bold text-white">{formatNumber(data.stats.comics)}</p>
	</div>
	<div class="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="text-slate-400 text-sm font-medium mb-1">Total Chapters</h3>
		<p class="text-3xl font-bold text-white">{formatNumber(data.stats.chapters)}</p>
	</div>
	<div class="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-lg border">
		<h3 class="text-slate-400 text-sm font-medium mb-1">Total Views</h3>
		<p class="text-3xl font-bold text-white">{formatNumber(data.stats.views)}</p>
	</div>
</div>

<div class="bg-slate-900 border-slate-800 rounded-xl shadow-lg overflow-hidden border">
	<div class="px-6 py-4 border-slate-800 flex items-center justify-between border-b">
		<h2 class="font-bold text-lg text-white">Recently Added Chapters</h2>
	</div>
	<div class="w-full overflow-x-auto">
		<table class="w-full min-w-max border-collapse text-left">
			<thead>
				<tr class="bg-slate-950/50 text-slate-400 text-xs uppercase">
					<th class="py-3 px-6 font-medium">Comic</th>
					<th class="py-3 px-6 font-medium">Chapter</th>
					<th class="py-3 px-6 font-medium">Date</th>
					<th class="py-3 px-6 font-medium text-right">Action</th>
				</tr>
			</thead>
			<tbody class="divide-slate-800 divide-y">
				{#each data.recentChapters as ch (ch.id)}
					<tr class="hover:bg-slate-800/50 transition-colors">
						<td class="py-3 px-6 text-sm font-medium text-white">{ch.comicTitle}</td>
						<td class="py-3 px-6 text-sm text-slate-300">Ch. {ch.chapterNumber}</td>
						<td class="py-3 px-6 text-sm text-slate-400">{timeAgo(ch.createdAt)}</td>
						<td class="py-3 px-6 text-right">
							<a href="/admin/chapters/{ch.id}" class="text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded text-xs transition-colors">Edit</a>
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
