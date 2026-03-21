<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<div class="mb-6">
	<h2 class="text-2xl font-bold text-white mb-1">Pengumuman & Banner</h2>
	<p class="text-sm text-slate-400">Kelola banner iklan dan pengumuman yang tampil di homepage.</p>
</div>

{#if form?.error}
	<div class="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{form.error}</div>
{/if}
{#if form?.success}
	<div class="mb-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm">Operasi berhasil!</div>
{/if}

<div class="grid md:grid-cols-3 gap-6">
	<!-- Form Tambah -->
	<div class="md:col-span-1">
		<div class="bg-slate-900 rounded-xl border border-slate-800 p-5 sticky top-6">
			<h3 class="text-lg font-bold text-white mb-4">Tambah Baru</h3>
			<form method="POST" action="?/create" enctype="multipart/form-data" use:enhance class="space-y-3">
				<div>
					<label for="title" class="text-xs font-semibold text-slate-400 mb-1 block">Judul</label>
					<input id="title" name="title" required class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" placeholder="Promo Spesial">
				</div>
				<div>
					<label for="bannerFile" class="text-xs font-semibold text-slate-400 mb-1 block">Banner (Upload)</label>
					<input id="bannerFile" type="file" name="banner" accept="image/*" class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-900/40 file:text-purple-400">
				</div>
				<div>
					<label for="bannerUrl" class="text-xs font-semibold text-slate-400 mb-1 block">Atau URL Banner</label>
					<input id="bannerUrl" name="bannerUrl" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" placeholder="https://...">
				</div>
				<div>
					<label for="linkUrl" class="text-xs font-semibold text-slate-400 mb-1 block">Link Tujuan</label>
					<input id="linkUrl" name="linkUrl" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" placeholder="https://...">
				</div>
				<div>
					<label for="content" class="text-xs font-semibold text-slate-400 mb-1 block">Deskripsi (opsional)</label>
					<textarea id="content" name="content" rows="2" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none" placeholder="Keterangan singkat..."></textarea>
				</div>
				<div>
					<label for="sortOrder" class="text-xs font-semibold text-slate-400 mb-1 block">Urutan</label>
					<input id="sortOrder" name="sortOrder" type="number" value="0" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none">
				</div>
				<Button type="submit" variant="success" class="w-full py-2.5">Simpan Banner</Button>
			</form>
		</div>
	</div>

	<!-- Daftar Banner -->
	<div class="md:col-span-2 space-y-3">
		{#if data.announcements.length === 0}
			<div class="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-12 text-center text-slate-500">
				Belum ada pengumuman/banner yang dibuat.
			</div>
		{:else}
			{#each data.announcements as ann (ann.id)}
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-4 items-center {ann.isActive ? '' : 'opacity-50'}">
					{#if ann.imageUrl}
						<img src={ann.imageUrl} alt={ann.title} class="w-24 h-14 object-cover rounded-lg shrink-0 border border-slate-700">
					{:else}
						<div class="w-24 h-14 bg-slate-800 rounded-lg shrink-0 flex items-center justify-center text-slate-600 text-xs">No Image</div>
					{/if}
					<div class="grow min-w-0">
						<h4 class="font-bold text-white text-sm truncate">{ann.title}</h4>
						{#if ann.linkUrl}
							<p class="text-xs text-slate-500 truncate">{ann.linkUrl}</p>
						{/if}
						<span class="text-[10px] font-semibold {ann.isActive ? 'text-emerald-400' : 'text-red-400'}">{ann.isActive ? 'Aktif' : 'Nonaktif'}</span>
					</div>
					<div class="flex gap-2 shrink-0">
						<form method="POST" action="?/toggleActive" use:enhance>
							<input type="hidden" name="id" value={ann.id}>
							<input type="hidden" name="isActive" value={String(ann.isActive)}>
							<button type="submit" class="px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors {ann.isActive ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white'}">
								{ann.isActive ? 'Nonaktifkan' : 'Aktifkan'}
							</button>
						</form>
						<form method="POST" action="?/delete" use:enhance={({ cancel }) => { if (!confirm('Hapus banner ini?')) cancel(); }}>
							<input type="hidden" name="id" value={ann.id}>
							<button type="submit" class="px-3 py-1.5 text-xs font-bold rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors">Hapus</button>
						</form>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
