<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<div class="max-w-3xl mx-auto">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<a href="/admin/comics/{data.comic.slug}" class="text-xs text-slate-600 dark:text-slate-400 hover:text-purple-400 transition-colors">&larr; Kembali ke Chapters</a>
			<h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-1">Edit Komik</h2>
		</div>
		<form method="POST" action="?/deleteComic" use:enhance onsubmit={(e) => { if (!confirm('Hapus komik ini beserta semua chapter-nya?')) e.preventDefault(); }}>
			<button type="submit" class="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-slate-900 dark:text-white transition-colors">Hapus Komik</button>
		</form>
	</div>

	{#if form?.error}
		<div class="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="mb-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm">Komik berhasil diperbarui!</div>
	{/if}

	<form method="POST" action="?/updateComic" enctype="multipart/form-data" use:enhance class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
		<!-- Cover Preview + Upload -->
		<div class="flex items-start gap-4">
			{#if data.comic.coverUrl}
				<img src={data.comic.coverUrl} alt={data.comic.title} class="w-24 h-auto rounded-lg border border-slate-300 dark:border-slate-700 object-cover">
			{/if}
			<div class="grow">
				<label for="cover" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Ganti Cover</label>
				<input id="cover" type="file" name="cover" accept="image/*" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-900/40 file:text-purple-400">
			</div>
		</div>

		<div>
			<label for="title" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Judul</label>
			<input id="title" name="title" value={data.comic.title} required class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none">
		</div>

		<div>
			<label for="author" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Author</label>
			<input id="author" name="author" value={data.comic.author || ''} class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none">
		</div>

		<div>
			<label for="description" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Deskripsi</label>
			<textarea id="description" name="description" rows="4" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none resize-none">{data.comic.description || ''}</textarea>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="status" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Status</label>
				<select id="status" name="status" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none">
					<option value="Ongoing" selected={data.comic.status === 'Ongoing'}>Ongoing</option>
					<option value="Completed" selected={data.comic.status === 'Completed'}>Completed</option>
					<option value="Hiatus" selected={data.comic.status === 'Hiatus'}>Hiatus</option>
				</select>
			</div>
			<div>
				<label for="type" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Tipe</label>
				<select id="type" name="type" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none">
					<option value="Manhwa" selected={data.comic.type === 'Manhwa'}>Manhwa</option>
					<option value="Manga" selected={data.comic.type === 'Manga'}>Manga</option>
					<option value="Manhua" selected={data.comic.type === 'Manhua'}>Manhua</option>
				</select>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="updateDay" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Hari Rilis Aktual</label>
				<select id="updateDay" name="updateDay" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none">
					<option value="" selected={!data.comic.updateDay}>-- Tidak Ditentukan --</option>
					<option value="Senin" selected={data.comic.updateDay === 'Senin'}>Senin</option>
					<option value="Selasa" selected={data.comic.updateDay === 'Selasa'}>Selasa</option>
					<option value="Rabu" selected={data.comic.updateDay === 'Rabu'}>Rabu</option>
					<option value="Kamis" selected={data.comic.updateDay === 'Kamis'}>Kamis</option>
					<option value="Jumat" selected={data.comic.updateDay === 'Jumat'}>Jumat</option>
					<option value="Sabtu" selected={data.comic.updateDay === 'Sabtu'}>Sabtu</option>
					<option value="Minggu" selected={data.comic.updateDay === 'Minggu'}>Minggu</option>
				</select>
			</div>
			<div>
				<label for="genres" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Genres (comma-separated)</label>
				<input id="genres" name="genres" value={data.comic.genres || ''} placeholder="Action, Fantasy, Romance" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none">
			</div>
		</div>

		<button type="submit" class="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-slate-900 dark:text-white font-bold rounded-lg transition-colors">Simpan Perubahan</button>
	</form>
</div>
