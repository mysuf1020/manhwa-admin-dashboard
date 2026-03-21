<script lang="ts">
	import type { PageData } from './$types';
	import { formatDistanceToNow } from 'date-fns';
    import { id } from 'date-fns/locale';

	let { data } = $props<{ data: PageData }>();
    let user = $derived(data.targetUser);
</script>

<svelte:head>
	<title>{user.displayName || user.username} (@{user.username}) - MangaReader</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Profile Header -->
    <div class="mb-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
		<div class="absolute -top-32 -right-32 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

		<div class="shrink-0 z-10">
			{#if user.avatarUrl}
				<img src={user.avatarUrl} alt="Avatar" class="w-32 h-32 rounded-3xl object-cover shadow-xl shadow-indigo-900/30 border-2 border-slate-300 dark:border-slate-700" />
			{:else}
				<div class="w-32 h-32 bg-linear-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-5xl font-black text-slate-900 dark:text-white shadow-xl shadow-indigo-900/30 transform -rotate-3 border-2 border-slate-300 dark:border-slate-700">
					{user.username[0].toUpperCase()}
				</div>
			{/if}
		</div>

		<div class="flex-1 z-10">
            <h1 class="text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{user.displayName || user.username}</h1>
            <p class="text-slate-600 dark:text-slate-400 font-medium text-lg mb-4">@{user.username}</p>
            
            <div class="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                {#if user.role === 'admin'}
                    <span class="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-widest">Administrator</span>
                {:else}
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-full text-xs font-bold uppercase tracking-widest">Reader</span>
                {/if}
                <span class="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
                    Bergabung {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: id })}
                </span>
            </div>

            <div class="bg-white dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50 inline-block text-left relative min-w-full md:min-w-[300px]">
                <h3 class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tentang Saya</h3>
                <p class="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                    {user.bio || 'Pengguna ini belum menulis biodata apapun.'}
                </p>
            </div>
		</div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Aktivitas Baca History -->
        <div class="lg:col-span-2">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Terakhir Dibaca
            </h2>
            
            {#if data.recentHistory.length === 0}
                <div class="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-8 text-center">
                    <p class="text-slate-500 font-medium">Belum ada aktivitas membaca publik.</p>
                </div>
            {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each data.recentHistory as item (item.comicSlug)}
                        <a href={`/comic/${item.comicSlug}`} class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl p-4 flex gap-4 transition-all group hover:bg-slate-100 dark:hover:bg-slate-800/50">
                            {#if item.comicCoverUrl}
                                <img src={item.comicCoverUrl} alt={item.comicTitle} class="w-16 h-20 object-cover rounded-xl shadow-lg bg-white dark:bg-slate-950" />
                            {:else}
                                <div class="w-16 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-[9px] text-slate-500">No Img</div>
                            {/if}
                            <div class="flex flex-col justify-center flex-1 min-w-0">
                                <h3 class="font-bold text-slate-900 dark:text-white text-md group-hover:text-emerald-400 transition-colors truncate">{item.comicTitle}</h3>
                                <p class="text-xs font-black text-emerald-400 mt-1">Ch. {item.chapterNumber}</p>
                                <span class="text-xs text-slate-500 mt-2">{formatDistanceToNow(new Date(item.readAt), { addSuffix: true, locale: id })}</span>
                            </div>
                        </a>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Komentar Terbaru -->
        <div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Komentar Terbaru
            </h2>

            {#if data.recentComments.length === 0}
                <div class="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-8 text-center">
                    <p class="text-slate-500 font-medium">Belum ada komentar.</p>
                </div>
            {:else}
                <div class="space-y-4">
                    {#each data.recentComments as comment (comment.createdAt + comment.content)}
                        <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 relative">
                            <div class="flex justify-between items-start mb-3">
                                <a href={`/comic/${comment.comicSlug}`} class="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors truncate pr-4 max-w-[80%]">
                                    {comment.comicTitle} • Ch {comment.chapterNumber}
                                </a>
                                <span class="text-[10px] uppercase font-bold tracking-wider text-slate-600 shrink-0">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: id })}
                                </span>
                            </div>
                            <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-2 border-slate-300 dark:border-slate-700 pl-3">"{comment.content}"</p>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>
