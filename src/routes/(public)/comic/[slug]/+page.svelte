<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import ReadButton from '$lib/components/ReadButton.svelte';
	import ChapterRow from '$lib/components/ChapterRow.svelte';
	import RatingStars from '$lib/components/RatingStars.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.comic.title} - MangaReader</title>
</svelte:head>

<div class="max-w-5xl px-4 py-8 md:flex-row gap-8 mx-auto flex min-h-screen flex-col">
	<!-- Left Side: Cover Image Profil -->
	<div class="md:w-64 w-full shrink-0">
		<div class="rounded-xl shadow-2xl border-slate-800 overflow-hidden border">
			<img
				src={data.comic.coverUrl}
				alt="Cover {data.comic.title}"
				class="h-auto w-full object-cover"
			/>
		</div>

		{#if data.chapters.length > 0}
			<ReadButton
				slug={data.comic.slug}
				chapterNumber={data.chapters[data.chapters.length - 1].chapterNumber}
			/>
		{:else}
			<button
				disabled
				class="mt-4 bg-slate-800 text-slate-500 font-bold py-3 px-4 rounded-lg w-full cursor-not-allowed"
			>
				Belum Ada Chapter
			</button>
		{/if}
	</div>

	<!-- Right Side: Details & Chapters Database -->
	<div class="grow">
		<h1 class="text-3xl md:text-5xl font-bold mb-2">{data.comic.title}</h1>
		<div class="gap-4 text-sm text-slate-400 mb-6 mt-3 flex items-center">
			<span class="bg-slate-800 text-slate-200 px-3 py-1 border-slate-700 rounded-full border"
				>{data.comic.status}</span
			>
			<span class="gap-1 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
					/></svg
				>
				{data.comic.author || 'Author Tidak Diketahui'}
			</span>
			<span class="gap-1 flex items-center text-emerald-400 font-medium ml-1">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
				{new Intl.NumberFormat('id-ID').format(data.comic.viewCount)} Views
			</span>
		</div>

		<!-- Action Bar: Ratings & Bookmarks -->
		<div class="mb-5">
			<RatingStars 
				interactive={!!data.user} 
				rating={data.comic.averageRating} 
				count={data.comic.ratingCount} 
				userRating={data.userRating} 
			/>
			{#if !data.user}
				<p class="text-xs text-slate-500 mt-2">Masuk/Login untuk memberikan penilaian karya ini.</p>
			{/if}
		</div>

		<div class="mb-8 flex items-center gap-3">
			{#if data.isBookmarked}
				<form action="?/toggleBookmark" method="POST" use:enhance>
					<button class="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold px-4 py-2.5 rounded-lg transition-all hover:bg-emerald-500 hover:text-white hover:border-emerald-500 shadow-lg shadow-emerald-900/10 active:scale-95">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
						Tersimpan di Koleksi
					</button>
				</form>
			{:else}
				<form action="?/toggleBookmark" method="POST" use:enhance>
					<button class="flex items-center gap-2 bg-slate-800 text-slate-300 border border-slate-700 font-bold px-4 py-2.5 rounded-lg transition-all hover:bg-purple-600 hover:text-white hover:border-purple-500 shadow-lg active:scale-95">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
						Tambah ke Favorit
					</button>
				</form>
			{/if}
		</div>

		<div class="prose prose-invert mb-10 max-w-none">
			<h3 class="text-xl font-semibold mb-3">Sinopsis Cerita</h3>
			<p class="text-slate-300 leading-relaxed text-[15px]">
				{data.comic.description || 'Admin belum menuliskan deskripsi apapun untuk komik ini.'}
			</p>
		</div>

		<!-- Chapter List UI -->
		<div class="bg-slate-900 border-slate-800 rounded-xl p-1 md:p-6 mb-8 shadow-inner border">
			<h3 class="text-xl font-semibold mb-4 mx-3 md:mx-0 border-slate-800 pb-3 border-b">
				Daftar Chapter
			</h3>
			<div class="gap-2 px-2 custom-scrollbar flex max-h-[500px] flex-col overflow-y-auto">
				{#each data.chapters as chapter (chapter.id)}
					<ChapterRow
						slug={data.comic.slug}
						chapterNumber={chapter.chapterNumber}
						title={chapter.title}
						createdAt={chapter.createdAt}
					/>
				{:else}
					<div
						class="text-center p-12 bg-slate-950/50 rounded-lg text-slate-500 border border-dashed border-slate-800"
					>
						Wah, belum ada chapter yang diunggah sejauh ini.
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	/* Desain Scrollbar Custom agar terlihat elegan seperti website premium */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(71, 85, 105, 0.5);
		border-radius: 10px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(148, 163, 184, 0.8);
	}
</style>
