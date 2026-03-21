<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let { data } = $props<{ data: PageData }>();

	let showForm = $state(false);

	const positionLabels: Record<string, string> = {
		homepage_top: '🏠 Homepage - Atas',
		homepage_mid: '🏠 Homepage - Tengah',
		reader_top: '📖 Reader - Atas',
		reader_bottom: '📖 Reader - Bawah'
	};
</script>

<div class="max-w-6xl mx-auto">
	<!-- Header -->
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Ad Manager</h1>
			<p class="text-sm text-slate-500 mt-1">Kelola slot iklan banner & AdSense di seluruh situs.</p>
		</div>
		<button onclick={() => showForm = !showForm} class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all shadow-lg shadow-purple-600/20 active:scale-95 flex items-center gap-2">
			{#if showForm}
				✕ Tutup Form
			{:else}
				+ Tambah Iklan Baru
			{/if}
		</button>
	</div>

	<!-- Create Form -->
	{#if showForm}
		<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 shadow-lg">
			<h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Buat Iklan Baru</h2>
			<form method="POST" action="?/create" enctype="multipart/form-data" use:enhance={() => {
				return async ({ result, update }) => {
					if (result.type === 'success') showForm = false;
					await update();
				};
			}} class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="md:col-span-2">
					<label for="title" class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Judul Iklan *</label>
					<input type="text" id="title" name="title" required placeholder="Google AdSense Banner #1" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
				</div>

				<div>
					<label for="positionType" class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Posisi Slot</label>
					<select id="positionType" name="positionType" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500">
						<option value="homepage_top">🏠 Homepage - Atas</option>
						<option value="homepage_mid">🏠 Homepage - Tengah</option>
						<option value="reader_top">📖 Reader - Atas</option>
						<option value="reader_bottom">📖 Reader - Bawah</option>
					</select>
				</div>

				<div>
					<label for="linkUrl" class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Link Tujuan (opsional)</label>
					<input type="url" id="linkUrl" name="linkUrl" placeholder="https://sponsor.com" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500" />
				</div>

				<div>
					<label for="imageFile" class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Upload Banner (gambar)</label>
					<input type="file" id="imageFile" name="imageFile" accept="image/*" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm file:mr-3 file:font-bold file:bg-purple-500/10 file:text-purple-500 file:border-0 file:rounded-lg file:px-3 file:py-1" />
				</div>

				<div>
					<label for="imageUrlExt" class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Atau URL Gambar Eksternal</label>
					<input type="url" id="imageUrlExt" name="imageUrlExt" placeholder="https://cdn.example.com/banner.jpg" class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500" />
				</div>

				<div class="md:col-span-2">
					<label for="scriptCode" class="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Script Code (AdSense / HTML embed, opsional)</label>
					<textarea id="scriptCode" name="scriptCode" rows="3" placeholder='<ins class="adsbygoogle" ...></ins>' class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-purple-500 resize-none"></textarea>
					<p class="text-[10px] text-slate-500 mt-1">⚠️ Jika diisi, Script Code akan diprioritaskan dibanding gambar banner.</p>
				</div>

				<div class="md:col-span-2">
					<button type="submit" class="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-600/20 transition-all active:scale-95 text-sm w-full">
						Simpan Iklan
					</button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Listing Table -->
	{#if data.ads.length === 0}
		<div class="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-16 text-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
			<h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Belum ada iklan</h3>
			<p class="text-sm text-slate-500">Klik tombol "Tambah Iklan Baru" untuk memulai.</p>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each data.ads as ad (ad.id)}
				<div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden group transition-all hover:shadow-lg">
					<!-- Status bar -->
					<div class="absolute left-0 top-0 bottom-0 w-1.5 {ad.isActive ? 'bg-emerald-500' : 'bg-slate-400'} rounded-l-2xl"></div>

					<!-- Preview Thumbnail -->
					<div class="ml-2 w-20 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
						{#if ad.imageUrl}
							<img src={ad.imageUrl} alt={ad.title} class="w-full h-full object-cover" />
						{:else if ad.scriptCode}
							<span class="text-[10px] font-black text-slate-500 uppercase">Script</span>
						{:else}
							<span class="text-[10px] font-bold text-slate-400">No Image</span>
						{/if}
					</div>

					<!-- Info -->
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 mb-1">
							<h3 class="font-bold text-slate-900 dark:text-white text-sm truncate">{ad.title}</h3>
							<span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0
								{ad.isActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'}">
								{ad.isActive ? 'Aktif' : 'Mati'}
							</span>
						</div>
						<div class="flex items-center gap-3 text-xs text-slate-500">
							<span class="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-bold">{positionLabels[ad.positionType] || ad.positionType}</span>
							{#if ad.linkUrl}
								<a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" class="text-purple-500 underline truncate max-w-[200px]">{ad.linkUrl}</a>
							{/if}
						</div>
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-2 shrink-0">
						<form method="POST" action="?/toggleActive" use:enhance>
							<input type="hidden" name="id" value={ad.id}>
							<input type="hidden" name="isActive" value={String(ad.isActive)}>
							<button type="submit" class="text-xs font-bold py-2 px-3 rounded-lg border transition-colors
								{ad.isActive ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}">
								{ad.isActive ? 'Nonaktifkan' : 'Aktifkan'}
							</button>
						</form>

						<form method="POST" action="?/delete" use:enhance onsubmit={(e) => { if(!confirm('Yakin ingin menghapus iklan ini?')) e.preventDefault(); }}>
							<input type="hidden" name="id" value={ad.id}>
							<button type="submit" class="text-xs font-bold py-2 px-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">
								Hapus
							</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
