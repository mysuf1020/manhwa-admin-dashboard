<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import ComicCard from '$lib/components/ComicCard.svelte';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	$effect(() => {
		if (form?.error) {
			(window as unknown as { __toast: (m: string, t: string) => void }).__toast(form.error, 'error');
		}
	});
</script>

<svelte:head>
	<title>{data.collection.name} - Koleksi {data.collection.authorDisplayName || data.collection.authorUsername} | MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8 relative pt-20">
	<!-- Go Back -->
	<a href="/profile" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-xl mb-6 shadow-sm absolute top-4 left-4 z-40 font-bold text-sm">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
		Kembali ke Profil
	</a>

	<!-- Header Collection -->
	<div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 mb-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
		<!-- Decor -->
		<div class="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-rose-500/10 to-transparent pointer-events-none"></div>
		
		<div class="z-10 flex-1">
			<div class="flex items-center gap-3 mb-2">
				<h1 class="text-3xl font-black text-slate-900 dark:text-white">{data.collection.name}</h1>
				{#if data.collection.isPublic}
					<span class="text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 py-1 px-3 rounded-full border border-emerald-500/20">Publik</span>
				{:else}
					<span class="text-xs font-bold uppercase tracking-wider bg-slate-500/10 text-slate-500 py-1 px-3 rounded-full border border-slate-500/20">Privat</span>
				{/if}
			</div>
			
			<p class="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl text-sm leading-relaxed">{data.collection.description || 'Tidak ada deskripsi tertulis untuk koleksi ini.'}</p>
			
			<div class="flex items-center gap-3 shrink-0">
				<span class="text-xs text-slate-500">Dibuat oleh</span>
				<div class="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full shadow-sm">
					{#if data.collection.authorAvatar}
						<img src={data.collection.authorAvatar} alt="Avatar" class="w-5 h-5 rounded-full object-cover">
					{:else}
						<div class="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-inner">{data.collection.authorUsername[0].toUpperCase()}</div>
					{/if}
					<span class="text-xs font-bold text-slate-800 dark:text-slate-200">@{data.collection.authorUsername}</span>
				</div>
			</div>
		</div>

		{#if data.isOwner}
			<div class="z-10 flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200 dark:border-slate-800">
				<form method="POST" action="?/togglePrivacy" use:enhance class="w-full sm:w-auto">
					<input type="hidden" name="isPublic" value={String(data.collection.isPublic)}>
					<button class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-2">
						{#if data.collection.isPublic}
							Buat Privat 🔒
						{:else}
							Publikasikan 🌍
						{/if}
					</button>
				</form>
				
				<form method="POST" action="?/deleteCollection" use:enhance onsubmit={(e) => { if(!confirm('Yakin ingin menghapus koleksi ini secara permanen?')) e.preventDefault(); }} class="w-full sm:w-auto">
					<button class="w-full bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm text-center">
						Hapus Koleksi
					</button>
				</form>
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="flex items-center justify-between mb-6">
		<h2 class="text-xl font-bold flex gap-2 items-center text-slate-800 dark:text-slate-200">
			Daftar Komik
			<span class="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-md">{data.items.length}</span>
		</h2>
	</div>

	{#if data.items.length === 0}
		<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center border-dashed">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
			<h3 class="text-lg font-black text-slate-800 dark:text-slate-200 mb-1">Daftar Komik Kosong</h3>
			<p class="text-sm text-slate-500 max-w-sm mx-auto">Koleksi ini belum memiliki item komik apapun di dalamnya.</p>
		</div>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
			{#each data.items as item (item.id)}
				<div class="relative group">
					<ComicCard comic={item} href={`/comic/${item.slug}`} />
					
					{#if data.isOwner}
						<!-- Tombol Hapus overlay saat hover -->
						<div class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
							<form method="POST" action="?/removeItem" use:enhance onsubmit={(e) => { if(!confirm('Hapus komik ini dari daftar koleksi?')) e.preventDefault(); }}>
								<input type="hidden" name="itemId" value={item.id}>
								<button type="submit" class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-red-600 transition-transform hover:scale-110" title="Hapus dari koleksi">
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
								</button>
							</form>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
