<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import ReadButton from '$lib/components/ReadButton.svelte';
	import ChapterRow from '$lib/components/ChapterRow.svelte';
	import RatingStars from '$lib/components/RatingStars.svelte';
	import ShareButtons from '$lib/components/ShareButtons.svelte';
	import DonationWidget from '$lib/components/DonationWidget.svelte';

	let { data }: { data: PageData } = $props();

	// Age-gate for mature content
	let matureConsent = $state(false);
	$effect(() => {
		if (!data.comic.isMature) {
			matureConsent = true;
		}
	});
</script>

<svelte:head>
	<title>{data.comic.title} - MangaReader</title>
	<meta property="og:title" content="{data.comic.title} - MangaReader" />
	<meta property="og:description" content="{data.comic.description ? data.comic.description.substring(0, 150) + '...' : 'Baca komik ini gratis di MangaReader'}" />
	<meta property="og:image" content="{data.comic.coverUrl}" />
	<meta name="twitter:title" content="{data.comic.title}" />
	<meta name="twitter:description" content="{data.comic.description ? data.comic.description.substring(0, 150) + '...' : 'Baca komik ini gratis di MangaReader'}" />
	<meta name="twitter:image" content="{data.comic.coverUrl}" />
</svelte:head>

<div class="max-w-5xl px-4 py-4 md:py-8 md:flex-row gap-4 md:gap-8 mx-auto flex min-h-screen flex-col">
	<!-- Left Side: Cover Image Profil -->
	<div class="md:w-64 w-full max-w-[200px] md:max-w-none mx-auto md:mx-0 shrink-0">
		<div class="rounded-xl shadow-2xl border-slate-200 dark:border-slate-800 overflow-hidden border">
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
				class="mt-4 bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold py-3 px-4 rounded-lg w-full cursor-not-allowed"
			>
				Belum Ada Chapter
			</button>
		{/if}
	</div>

	<!-- Right Side: Details & Chapters Database -->
	<div class="grow">
		<h1 class="text-2xl md:text-4xl font-bold mb-2">
			{data.comic.title}
			{#if data.comic.isMature}
				<span class="ml-2 inline-block align-middle text-sm bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">18+</span>
			{/if}
		</h1>
		{#if data.comic.genres}
			<div class="flex flex-wrap gap-1.5 mb-3">
				{#each data.comic.genres.split(',').map((g: string) => g.trim()).filter(Boolean) as genre (genre)}
					<a href="/genre/{encodeURIComponent(genre)}" class="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-full hover:bg-purple-500 hover:text-slate-900 dark:text-white transition-colors">{genre}</a>
				{/each}
			</div>
		{/if}
		<div class="gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6 mt-3 flex items-center">
			<span class="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 border-slate-300 dark:border-slate-700 rounded-full border"
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

		<div class="mb-8 flex items-center gap-3 flex-wrap">
			{#if data.isBookmarked}
				<form action="?/toggleBookmark" method="POST" use:enhance>
					<button class="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold px-4 py-2.5 rounded-lg transition-all hover:bg-emerald-500 hover:text-slate-900 dark:text-white hover:border-emerald-500 shadow-lg shadow-emerald-900/10 active:scale-95">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
						Tersimpan di Favorit
					</button>
				</form>
			{:else}
				<form action="?/toggleBookmark" method="POST" use:enhance>
					<button class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold px-4 py-2.5 rounded-lg transition-all hover:bg-purple-600 hover:text-slate-900 dark:hover:text-white hover:border-purple-500 shadow-lg active:scale-95">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
						Tambah ke Favorit
					</button>
				</form>
			{/if}

			{#if data.user}
				<button onclick={() => {(document.getElementById('collectionModal') as HTMLDialogElement)?.showModal()}} class="flex items-center gap-2 bg-rose-500/10 text-rose-500 border border-rose-500/30 font-bold px-4 py-2.5 rounded-lg transition-all hover:bg-rose-500 hover:text-white shadow-[0_0_15px_rgba(244,63,94,0.1)] active:scale-95">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
					Simpan ke List Pribadi
				</button>
			{/if}
		</div>

		<div class="prose prose-invert mb-10 max-w-none">
			<div class="flex items-center justify-between mb-3">
				<h3 class="text-xl font-semibold">Sinopsis Cerita</h3>
				<ShareButtons comicSlug={data.comic.slug} />
			</div>
			<p class="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px]">
				{data.comic.description || 'Admin belum menuliskan deskripsi apapun untuk komik ini.'}
			</p>
		</div>

		<DonationWidget />

		<!-- Chapter List UI -->
		<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-1 md:p-6 mb-8 mt-10 shadow-inner border">
			<h3 class="text-xl font-semibold mb-4 mx-3 md:mx-0 border-slate-200 dark:border-slate-800 pb-3 border-b">
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
						class="text-center p-12 bg-white dark:bg-slate-950/50 rounded-lg text-slate-500 border border-dashed border-slate-200 dark:border-slate-800"
					>
						Wah, belum ada chapter yang diunggah sejauh ini.
					</div>
				{/each}
			</div>
		</div>

		<!-- Related Comics -->
		{#if data.relatedComics && data.relatedComics.length > 0}
			<div class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl p-4 md:p-6 shadow-inner border">
				<h3 class="text-xl font-semibold mb-4">Komik Serupa</h3>
				<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
					{#each data.relatedComics as rel (rel.id)}
						<a href="/comic/{rel.slug}" class="group">
							<div class="aspect-3/4 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 mb-1.5">
								<img src={rel.cover} alt={rel.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
							</div>
							<p class="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-purple-400 transition-colors">{rel.title}</p>
						</a>
					{/each}
				</div>
			</div>
		{/if}
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

<!-- Age Gate Warning Overlay for Mature Content -->
{#if !matureConsent}
	<div class="fixed inset-0 z-9999 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
		<div class="bg-slate-50 dark:bg-slate-900 border-2 border-red-500/40 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-red-900/30">
			<!-- Warning Icon -->
			<div class="w-20 h-20 mx-auto mb-5 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
				<span class="text-4xl">🔞</span>
			</div>

			<h2 class="text-2xl font-black text-red-400 mb-3">Peringatan Konten Dewasa</h2>
			<p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
				Komik <strong class="text-slate-900 dark:text-white">{data.comic.title}</strong> mengandung konten yang ditujukan untuk pembaca berusia <strong class="text-red-400">18 tahun ke atas</strong>. 
				Dengan melanjutkan, Anda menyatakan bahwa Anda sudah berusia 18 tahun atau lebih dan bersedia melihat konten ini.
			</p>

			<div class="flex gap-3">
				<a href="/" class="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-700">
					Kembali
				</a>
				<button onclick={() => matureConsent = true} class="flex-1 py-3 bg-red-600 hover:bg-red-500 text-slate-900 dark:text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-900/30">
					Saya 18+ Tahun
				</button>
			</div>

			<p class="text-[10px] text-slate-600 mt-4">Keputusan ini berlaku selama sesi browser Anda saat ini.</p>
		</div>
	</div>
{/if}

<!-- Modal Dialog Tambah ke Koleksi -->
{#if data.user}
<dialog id="collectionModal" class="bg-transparent m-auto p-0 backdrop:backdrop-blur-sm backdrop:bg-slate-900/80">
	<div class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-[90vw] max-w-[400px] shadow-2xl relative">
		<button onclick={() => {(document.getElementById('collectionModal') as HTMLDialogElement)?.close()}} class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-900 w-8 h-8 flex justify-center items-center rounded-full">✕</button>
		
		<h3 class="text-xl font-black text-slate-900 dark:text-white mb-2">Simpan ke List</h3>
		<p class="text-sm text-slate-500 mb-6">Pilih koleksi mana yang akan menyimpan komik ini.</p>
		
		{#if !data.userCollections || data.userCollections.length === 0}
			<div class="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mb-4">
				<p class="text-slate-500 text-sm font-medium mb-2">Belum ada daftar koleksi</p>
				<a onclick={() => {(document.getElementById('collectionModal') as HTMLDialogElement)?.close()}} href="/profile" class="text-purple-500 hover:text-purple-400 font-bold text-sm underline underline-offset-2">Buat koleksi baru di Profil</a>
			</div>
		{:else}
			<div class="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
				{#each data.userCollections as list (list.id)}
					<form method="POST" action="?/toggleCollectionItem" use:enhance={() => {
						return async ({ update }) => {
							await update({ reset: false }); // keep scrolling context
						};
					}} class="flex items-center justify-between p-3 rounded-xl border transition-colors {list.hasComic ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400'}">
						<input type="hidden" name="collectionId" value={list.id}>
						<div class="flex flex-col">
							<span class="font-bold text-sm {list.hasComic ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}">{list.name}</span>
							<span class="text-[10px] font-bold uppercase tracking-wider {list.isPublic ? 'text-emerald-500' : 'text-slate-500'}">{list.isPublic ? 'Publik' : 'Privat'}</span>
						</div>
						<button type="submit" class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 {list.hasComic ? 'bg-rose-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}">
							{list.hasComic ? 'Tersimpan ✓' : 'Tambahkan +'}
						</button>
					</form>
				{/each}
			</div>
		{/if}
	</div>
</dialog>
{/if}
