<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Admin - Laporan Kerusakan | MangaReader</title>
</svelte:head>

<div class="mb-8">
	<h1 class="text-3xl font-black text-slate-900 dark:text-white mb-2">Manajemen Laporan</h1>
	<p class="text-slate-600 dark:text-slate-400">Tinjau laporan "Chapter Rusak" yang dilaporkan oleh pembaca.</p>
</div>

{#if data.reports.length === 0}
	<div class="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-emerald-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
		<h3 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Hore! Tidak Ada Laporan</h3>
		<p class="text-slate-600 dark:text-slate-400">Semua komik dalam kondisi prima. Server aman 🚀</p>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each data.reports as report (report.id)}
			<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl relative flex flex-col">
				<!-- Status Badge -->
				<div class="absolute top-6 right-6">
					{#if report.status === 'resolved'}
						<span class="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">Selesai</span>
					{:else if report.status === 'dismissed'}
						<span class="bg-slate-500/10 text-slate-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-500/20">Ditolak</span>
					{:else}
						<span class="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-rose-500/20">Pending</span>
					{/if}
				</div>

				<h3 class="font-bold mb-1 uppercase tracking-widest text-xs text-purple-600 dark:text-purple-400">{report.reasonCategory.replace('_', ' ')}</h3>
				<a href={`/comic/${report.comicSlug}/${report.chapterNumber}`} target="_blank" class="text-lg font-black text-slate-800 dark:text-slate-100 hover:text-purple-500 transition-colors mb-4 block line-clamp-1">
					{report.comicTitle} - Ch. {report.chapterNumber}
				</a>
				
				<div class="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 mb-6">
					<p class="text-sm text-slate-700 dark:text-slate-300 italic mb-2">
						"{report.description || 'Tanpa deskripsi spesifik.'}"
					</p>
					<p class="text-xs text-slate-500 font-medium">
						Dilaporakan oleh: <strong class="text-slate-700 dark:text-slate-400">@{report.reporterUsername}</strong>
					</p>
				</div>

				{#if report.status === 'pending'}
					<div class="flex gap-3">
						<form action="?/resolveReport" method="POST" use:enhance class="flex-1">
							<input type="hidden" name="reportId" value={report.id}>
							<button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl transition-colors text-sm border border-emerald-500">Tandai Selesai</button>
						</form>
						<form action="?/dismissReport" method="POST" use:enhance class="flex-1">
							<input type="hidden" name="reportId" value={report.id}>
							<button type="submit" class="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 font-bold py-2 rounded-xl transition-colors text-sm border border-slate-300 dark:border-slate-700">Tolak</button>
						</form>
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
