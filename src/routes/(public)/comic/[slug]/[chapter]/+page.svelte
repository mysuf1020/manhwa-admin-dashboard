<script lang="ts">
	import type { PageData } from './$types';
	import ReaderNav from '$lib/components/ReaderNav.svelte';
	import ReaderFooter from '$lib/components/ReaderFooter.svelte';
	import CommentSection from '$lib/components/CommentSection.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Chapter {data.chapter.chapterNumber} - {data.comic.title} | MangaReader</title>
</svelte:head>

<!-- Sticky Top Nav Reader -->
<ReaderNav
	title={data.comic.title}
	chapterNumber={data.chapter.chapterNumber}
	comicSlug={data.comic.slug}
	prevChapterNumber={data.prevChapterNumber}
	nextChapterNumber={data.nextChapterNumber}
/>

<!-- Area Utama Pembaca (Infinite Scroll Format Seamless) -->
<main class="bg-black pb-12 flex min-h-screen flex-col items-center select-none">
	<div class="max-w-3xl shadow-2xl relative flex w-full flex-col">
		{#if data.pages.length === 0}
			<!-- Jika data gambar kosong karena admin belum nge-upload file gambar panel komik -->
			<div
				class="py-32 px-4 text-slate-500 border-slate-800 rounded-xl m-4 mt-12 bg-slate-900/50 border-2 border-dashed text-center"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-16 w-16 mb-4 text-slate-600 mx-auto"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
				<p class="text-xl mb-2 font-medium">Kosong Melompong</p>
				<p class="text-sm text-slate-600">
					Admin/Uploader belum mensisipkan potongan rilis chapter ini ke Database.
				</p>
			</div>
		{:else}
			{#each data.pages as page (page.id)}
				<!-- Seamless Image Layout for Webtoon/Manhwa Format -->
				<!-- svelte-ignore a11y_missing_attribute -->
				<img
					src={page.imageUrl}
					loading="lazy"
					class="m-0 p-0 pointer-events-none block h-auto w-full"
				/>
			{/each}
		{/if}
	</div>

	<!-- Area Bawah Pembaca (Call to Actions) -->
	{#if data.pages.length > 0}
		<ReaderFooter 
			chapterNumber={data.chapter.chapterNumber} 
			comicSlug={data.comic.slug} 
			nextChapterNumber={data.nextChapterNumber} 
		/>
		<div class="w-full max-w-3xl mt-6 border-t border-slate-800">
			<CommentSection comments={data.comments} user={data.user} />
		</div>
	{/if}
</main>
