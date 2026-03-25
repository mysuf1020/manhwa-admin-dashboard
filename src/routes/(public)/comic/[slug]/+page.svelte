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

<div class="w-full bg-[#0c0d10] min-h-screen font-sans text-slate-300">
	<!-- Hero Header Cinematic -->
	<div class="relative w-full border-b border-white/5 pt-10 pb-8 md:pt-16 md:pb-12">
		<!-- Blurred Background -->
		<div class="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style="background-image: url('{data.comic.coverUrl}'); filter: blur(20px);"></div>
		<div class="absolute inset-0 bg-linear-to-t from-[#0c0d10] via-transparent to-[#0c0d10]/50"></div>

		<div class="relative max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
			<!-- Cover Image -->
			<div class="w-48 md:w-56 shrink-0 relative z-10 mx-auto md:mx-0">
				<div class="rounded-xl shadow-2xl shadow-black/80 border border-white/10 overflow-hidden bg-black/50">
					<img src={data.comic.coverUrl} alt="Cover {data.comic.title}" class="w-full h-auto object-cover" />
				</div>
			</div>

			<!-- Info Column (Right Side) -->
			<div class="grow flex flex-col w-full text-center md:text-left">
				<!-- Description (above title to fill space) -->
				<p class="text-sm md:text-[15px] leading-relaxed text-zinc-400 mb-4 line-clamp-4 md:line-clamp-3 whitespace-pre-wrap">{data.comic.description || 'Belum ada deskripsi.'}</p>

				<!-- Info Tags Row -->
				<div class="flex flex-wrap gap-2 mb-4 justify-center md:justify-start text-[11px] font-bold font-mono">
					{#if data.comic.genres}
						{#each data.comic.genres.split(',').map((g) => g.trim()).filter(Boolean) as genre (genre)}
							<a href="/genre/{encodeURIComponent(genre)}" class="bg-[#242529] hover:bg-[#2d2e34] px-2.5 py-1 rounded text-zinc-300 transition-colors border border-white/5">{genre}</a>
						{/each}
					{/if}
					<span class="bg-[#1a1c23] px-2.5 py-1 rounded text-zinc-400 border border-white/5"><span class="text-zinc-600 uppercase tracking-wider mr-1">Author</span> {data.comic.author || '-'}</span>
					<span class="bg-[#1a1c23] px-2.5 py-1 rounded text-zinc-400 border border-white/5"><span class="text-zinc-600 uppercase tracking-wider mr-1">Format</span> {data.comic.type || 'Manhwa'}</span>
					<span class="bg-[#1a1c23] px-2.5 py-1 rounded text-zinc-400 border border-white/5"><span class="text-zinc-600 uppercase tracking-wider mr-1">Status</span> {data.comic.status}</span>
				</div>

				<h1 class="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 drop-shadow-lg leading-tight">
					{data.comic.title}
					{#if data.comic.isMature}
						<span class="ml-3 inline-block align-middle text-sm bg-red-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wider relative -top-1">18+</span>
					{/if}
				</h1>

				<div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
					<!-- Action Buttons -->
					<div class="flex items-center gap-3">
						<!-- Read Button (Primary) -->
						{#if data.chapters.length > 0}
							<a href="/comic/{data.comic.slug}/{data.chapters[data.chapters.length - 1].chapterNumber}" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-6 rounded transition-colors flex items-center gap-2 shadow-lg shadow-purple-900/20 uppercase text-sm tracking-wide">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
								Baca
							</a>
						{:else}
							<button disabled class="bg-zinc-800 text-zinc-500 font-bold py-2.5 px-6 rounded cursor-not-allowed uppercase text-sm tracking-wide">
								Belum Ada Chapter
							</button>
						{/if}

						<!-- Bookmark/Favorite Toggle -->
						<form action="?/toggleBookmark" method="POST" use:enhance>
							<button class="bg-[#242529] hover:bg-[#2d2e34] border border-white/5 text-white font-bold py-2.5 px-5 rounded transition-colors flex items-center gap-2 uppercase text-sm tracking-wide group">
								{#if data.isBookmarked}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
									Tersimpan
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
									Bookmark
								{/if}
							</button>
						</form>

						<!-- Follow Toggle (Readlist) -->
						<form action="?/toggleFollow" method="POST" use:enhance>
							<button class="bg-[#242529] hover:bg-[#2d2e34] border border-white/5 text-white font-bold py-2.5 px-5 rounded transition-colors flex items-center gap-2 uppercase text-sm tracking-wide group flex-nowrap whitespace-nowrap">
								{#if data.isFollowing}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-purple-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
									Dalam Readlist
								{:else}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-zinc-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
									Tambah ke Readlist
								{/if}
							</button>
						</form>
					</div>

					<!-- Stats Grid -->
					<div class="flex items-center gap-4 text-sm font-bold text-zinc-300 bg-[#16171b]/80 border border-white/5 px-4 py-2 rounded-lg">
						<span class="flex items-center gap-1.5"><span class="text-orange-400">★</span> {data.comic.averageRating}</span>
						<span class="flex items-center gap-1.5"><span class="text-cyan-400">📖</span> {new Intl.NumberFormat('id-ID').format(data.comic.viewCount)}</span>
						<span class="flex items-center gap-1.5"><span class="text-purple-400">🏆</span> {data.comic.ratingCount}</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Main Detail Content Layout -->
	<div class="max-w-6xl mx-auto px-4 md:px-6 py-8">

		<!-- Donation/Ratings Bar -->
		<div class="mb-8 flex items-center justify-between flex-wrap gap-4">
			<DonationWidget />
			<div class="flex flex-col items-end">
				<RatingStars 
					interactive={!!data.user} 
					rating={data.comic.averageRating} 
					count={data.comic.ratingCount} 
					userRating={data.userRating} 
				/>
				{#if !data.user}
					<span class="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">Login untuk review</span>
				{/if}
			</div>
		</div>

		<!-- Chapters Section -->
		<div class="mb-12">
			<div class="flex items-center gap-3 mb-4 text-white">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
				<h3 class="text-xl font-bold uppercase tracking-wide">Chapters</h3>
			</div>

			<!-- Search Bar -->
			<div class="mb-6 relative">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
				<input type="text" placeholder="Cari Chapter, Contoh: 89 atau 76" class="w-full bg-[#16171b] border border-white/5 rounded-lg py-3 pl-11 pr-4 text-sm text-zinc-300 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-zinc-600 block">
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 {data.chapters.length > 30 ? 'max-h-[800px] overflow-y-auto custom-scrollbar pr-2' : ''}">
				{#each data.chapters as chapter (chapter.id)}
					<ChapterRow
						slug={data.comic.slug}
						chapterNumber={chapter.chapterNumber}
						title={chapter.title}
						createdAt={chapter.createdAt}
						coverUrl={data.comic.coverUrl}
					/>
				{:else}
					<div class="col-span-full text-center p-12 bg-[#131418] rounded-xl text-zinc-500 border border-dashed border-white/5">
						Belum ada chapter yang tersedia untuk komik ini.
					</div>
				{/each}
			</div>
		</div>

		<!-- Related Comics -->
		{#if data.relatedComics && data.relatedComics.length > 0}
			<div class="mb-10">
				<h3 class="text-xl font-bold uppercase tracking-wide text-white border-b border-white/10 pb-3 mb-4">Komik Serupa</h3>
				<div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
					{#each data.relatedComics as rel (rel.id)}
						<a href="/comic/{rel.slug}" class="group block relative rounded-lg overflow-hidden aspect-[3/4] bg-[#1a1c23] border border-white/5">
							<img src={rel.cover} alt={rel.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100">
							<div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/80 to-transparent p-2">
								<p class="text-[10px] md:text-xs font-bold text-white line-clamp-2 leading-tight drop-shadow">{rel.title}</p>
							</div>
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
