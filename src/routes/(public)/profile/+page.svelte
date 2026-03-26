<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import ComicCard from '$lib/components/ComicCard.svelte';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	
	let isEditMode = $state(false);
	
	$effect(() => {
		if (form?.success) {
			isEditMode = false;
			(window as unknown as { __toast: (m: string, t: string) => void }).__toast('Profil berhasil diperbarui!', 'success');
		} else if (form?.error) {
			(window as unknown as { __toast: (m: string, t: string) => void }).__toast(form.error, 'error');
		}
	});
</script>

<svelte:head>
	<title>Profil & Koleksi - MangaReader</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
    <div class="mb-10 flex flex-col md:flex-row gap-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
		<!-- Decorative bg element -->
		<div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

		<div class="flex items-center gap-6 shrink-0 z-10">
			{#if data.profile?.avatarUrl}
				<img src={data.profile.avatarUrl} alt="Avatar" class="w-24 h-24 rounded-2xl object-cover shadow-xl shadow-purple-900/30 border border-slate-200 dark:border-slate-800" />
			{:else}
				<div class="w-24 h-24 bg-linear-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-purple-900/30 transform rotate-3">
					{data.user?.username[0].toUpperCase()}
				</div>
			{/if}
			<div>
				<h1 class="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{data.profile?.displayName || data.user?.username}</h1>
				<p class="text-slate-600 dark:text-slate-400 font-medium">@{data.user?.username}</p>
				{#if data.user?.role === 'admin'}
					<span class="inline-block mt-3 mr-2 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold uppercase tracking-widest">Administrator</span>
				{/if}
				<span class="inline-block mt-3 px-3 py-1 bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-widest">Lv. {data.user?.level || 1} ({data.user?.experience || 0} EXP)</span>
			</div>
		</div>

		<div class="flex-1 z-10 md:border-l border-slate-200 dark:border-slate-800 md:pl-8">
			{#if !isEditMode}
				<div class="flex justify-between items-start mb-2">
					<h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Tentang Saya</h3>
					<button onclick={() => isEditMode = true} class="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors py-1 px-3 bg-purple-500/10 rounded-lg">Edit Profil</button>
				</div>
				<p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
					{data.profile?.bio || 'Belum ada bio. Tulis sesuatu tentang dirimu!'}
				</p>
			{:else}
				<form method="POST" action="?/updateProfile" enctype="multipart/form-data" use:enhance class="space-y-4 animate-in fade-in zoom-in-95 duration-200">
					<div>
						<label for="displayName" class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Nama Tampilan</label>
						<input type="text" id="displayName" name="displayName" value={data.profile?.displayName || ''} placeholder="Contoh: Kirito" class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
					</div>
					<div>
						<label for="bio" class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Biodata</label>
						<textarea id="bio" name="bio" rows="2" placeholder="Suka baca aksi dan fantasi..." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors resize-none">{data.profile?.bio || ''}</textarea>
					</div>
					<div>
						<label for="avatarUrl" class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Ganti Avatar (File)</label>
						<input type="file" id="avatarUrl" name="avatarUrl" accept="image/*" class="w-full text-xs text-slate-600 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-900/40 file:text-purple-400 hover:file:bg-purple-900/60 transition-colors" />
					</div>
					<div>
						<label for="avatarUrlExt" class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Atau Avatar (Link URL)</label>
						<input type="url" id="avatarUrlExt" name="avatarUrlExt" placeholder="https://i.ibb.co/..." class="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors" />
					</div>
					<div class="flex gap-2 justify-end pt-2 border-t border-slate-200 dark:border-slate-800">
						<button type="button" onclick={() => isEditMode = false} class="px-4 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Batal</button>
						<button type="submit" class="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-purple-600/20">Simpan Perubahan</button>
					</div>
				</form>
			{/if}
		</div>
    </div>

    <!-- History Tab -->
    <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Lanjut Baca (Riwayat)</h2>
        </div>

        {#if data.userHistory.length === 0}
            <div class="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <p class="text-slate-600 dark:text-slate-400 font-medium text-lg">Hampa. Anda belum membaca komik satupun.</p>
                <a href="/" class="text-emerald-400 hover:text-emerald-300 transition-colors mt-3 inline-block font-bold bg-emerald-500/10 px-6 py-2.5 rounded-xl border border-emerald-500/20">Mulai Eksplorasi Katalog</a>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {#each data.userHistory as item (item.id)}
                    <a href={`/comic/${item.comicSlug}/${item.chapterId}`} class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 rounded-2xl p-4 flex gap-5 transition-all group hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1">
                        {#if item.comicCoverUrl}
                            <img src={item.comicCoverUrl} alt={item.comicTitle} class="w-20 h-28 object-cover rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950" />
                        {:else}
                            <div class="w-20 h-28 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 font-medium flex items-center justify-center text-[10px] text-slate-500 text-center">No Image</div>
                        {/if}
                        <div class="flex flex-col justify-center">
                            <h3 class="font-bold text-slate-900 dark:text-white text-lg group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">{item.comicTitle}</h3>
                            <div class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 mt-3 w-fit">
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
    <div class="mb-12">
        <div class="flex items-center gap-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Koleksi Tersimpan (Bookmark)</h2>
        </div>

        {#if data.userBookmarks.length === 0}
            <div class="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                <p class="text-slate-600 dark:text-slate-400 font-medium text-lg">Rak komik favorit Anda masih kosong.</p>
            </div>
        {:else}
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {#each data.userBookmarks as comic (comic.id)}
                    <ComicCard {comic} href={`/comic/${comic.slug}`} />
                {/each}
            </div>
        {/if}
    </div>

	<!-- Custom Collections Tab -->
	<div>
		<div class="flex items-center justify-between mb-6">
			<div class="flex items-center gap-3">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
				<h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Koleksi Pribadi</h2>
			</div>
			<button onclick={() => {
				const dialog = document.getElementById('createCollectionModal') as HTMLDialogElement;
				dialog?.showModal();
			}} class="bg-rose-500 hover:bg-rose-400 text-white fill-current font-bold py-2 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-rose-500/20 active:scale-95 flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>
				Buat Koleksi
			</button>
		</div>

		{#if data.userCollections.length === 0}
			<div class="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl p-10 text-center">
				<p class="text-slate-600 dark:text-slate-400 font-medium text-lg">Kamu belum membuat koleksi kustom apapun.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each data.userCollections as collection (collection.id)}
					<a href={`/profile/collections/${collection.id}`} class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 dark:hover:border-rose-500 p-5 pl-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-rose-900/10 transition-all group flex flex-col relative overflow-hidden">
						<!-- Decorative bar -->
						<div class="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-400 dark:bg-rose-500 rounded-l-2xl"></div>
						
						<div class="flex justify-between items-start mb-2">
							<h3 class="font-bold text-lg text-slate-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors line-clamp-1">{collection.name}</h3>
							{#if collection.isPublic}
								<span class="text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 py-0.5 px-2 rounded-full border border-emerald-500/20">Publik</span>
							{:else}
								<span class="text-[10px] font-black uppercase tracking-wider bg-slate-500/10 text-slate-500 py-0.5 px-2 rounded-full border border-slate-500/20"> Privat</span>
							{/if}
						</div>
						<p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 grow">{collection.description || 'Tidak ada deskripsi.'}</p>
						<span class="text-xs font-bold text-slate-500 dark:text-slate-500 flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
							{collection.itemCount} Komik dalam daftar
						</span>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Modal Dialog Buat Koleksi -->
<dialog id="createCollectionModal" class="bg-transparent m-auto p-0 backdrop:backdrop-blur-sm backdrop:bg-slate-900/80">
	<div class="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 w-[90vw] max-w-md shadow-2xl relative">
		<button onclick={() => {(document.getElementById('createCollectionModal') as HTMLDialogElement)?.close()}} class="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 dark:bg-slate-900 w-8 h-8 flex justify-center items-center rounded-full">✕</button>
		
		<h3 class="text-2xl font-black text-slate-900 dark:text-white mb-6">Koleksi Baru</h3>
		
		<form method="POST" action="?/createCollection" use:enhance={() => {
			return async ({ result, update }) => {
				if (result.type === 'success') {
					(document.getElementById('createCollectionModal') as HTMLDialogElement)?.close();
				}
				await update();
			};
		}} class="space-y-4">
			<div>
				<label for="name" class="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5">Judul Koleksi *</label>
				<input type="text" id="name" name="name" required placeholder="Cth: Isekai Reinkarnasi Terbaik" class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all font-medium" />
			</div>
			
			<div>
				<label for="description" class="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-1.5">Deskripsi</label>
				<textarea id="description" name="description" rows="3" placeholder="Deskripsikan koleksi ini agar orang lain tertarik..." class="w-full resize-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"></textarea>
			</div>
			
			<div class="flex items-center gap-3 pt-2">
				<input type="checkbox" id="isPublic" name="isPublic" checked class="w-5 h-5 accent-rose-500 bg-slate-900 rounded-md cursor-pointer" />
				<label for="isPublic" class="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">Buat Koleksi Ini Publik</label>
			</div>
			<p class="text-xs text-slate-500 dark:text-slate-500 pl-8 -mt-2">Jika dipublikasikan, orang lain bisa melihat koleksi ini di profil public Anda.</p>
			
			<div class="pt-6">
				<button type="submit" class="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all active:scale-95 text-sm uppercase tracking-wider">Simpan Koleksi</button>
			</div>
		</form>
	</div>
</dialog>
