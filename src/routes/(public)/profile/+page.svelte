<script lang="ts">
	import type { PageData } from './$types';
    import ComicCard from '$lib/components/ComicCard.svelte';

	let { data } = $props<{ data: PageData }>();
</script>

<svelte:head>
	<title>Profil & Koleksi - MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-10 flex items-center gap-5 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div class="w-20 h-20 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-purple-900/30 transform rotate-3">
            {data.user?.username[0].toUpperCase()}
        </div>
        <div>
            <h1 class="text-3xl font-black text-white mb-1 tracking-tight">Halo, {data.user?.username}!</h1>
            <p class="text-slate-400 font-medium">Selamat datang di perpustakaan komik pribadi Anda.</p>
            {#if data.user?.role === 'admin'}
                <span class="inline-block mt-3 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-widest">Administrator</span>
            {/if}
        </div>
    </div>

    <!-- History Tab -->
    <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 class="text-2xl font-black text-white tracking-tight">Lanjut Baca (Riwayat)</h2>
        </div>

        {#if data.userHistory.length === 0}
            <div class="bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl p-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <p class="text-slate-400 font-medium text-lg">Hampa. Anda belum membaca komik satupun.</p>
                <a href="/" class="text-emerald-400 hover:text-emerald-300 transition-colors mt-3 inline-block font-bold bg-emerald-500/10 px-6 py-2.5 rounded-full border border-emerald-500/20">Mulai Eksplorasi Katalog</a>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {#each data.userHistory as item (item.id)}
                    <a href={`/comic/${item.comicSlug}/${item.chapterId}`} class="bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-2xl p-4 flex gap-5 transition-all group hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1">
                        {#if item.comicCoverUrl}
                            <img src={item.comicCoverUrl} alt={item.comicTitle} class="w-20 h-28 object-cover rounded-xl shadow-lg border border-slate-800 bg-slate-950" />
                        {:else}
                            <div class="w-20 h-28 bg-slate-800 rounded-xl border border-slate-700 font-medium flex items-center justify-center text-[10px] text-slate-500 text-center">No Image</div>
                        {/if}
                        <div class="flex flex-col justify-center">
                            <h3 class="font-bold text-white text-lg group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">{item.comicTitle}</h3>
                            <div class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 mt-3 w-fit">
                                <p class="text-sm font-black text-emerald-400">Chapter {item.chapterNumber}</p>
                            </div>
                            <span class="text-xs text-slate-500 mt-3 flex items-center gap-1.5 font-semibold tracking-wide">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {new Date(item.readAt).toLocaleDateString()}
                            </span>
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>

    <!-- Bookmark Tab -->
    <div>
        <div class="flex items-center gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            <h2 class="text-2xl font-black text-white tracking-tight">Koleksi Tersimpan (Bookmark)</h2>
        </div>

        {#if data.userBookmarks.length === 0}
            <div class="bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl p-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <p class="text-slate-400 font-medium text-lg">Rak komik favorit Anda masih kosong.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {#each data.userBookmarks as comic (comic.id)}
                    <ComicCard {comic} href={`/comic/${comic.slug}`} />
                {/each}
            </div>
        {/if}
    </div>
</div>
