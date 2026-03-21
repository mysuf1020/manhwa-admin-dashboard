<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<svelte:head>
	<title>Edit Profil - MangaReader</title>
</svelte:head>

<div class="max-w-2xl px-4 py-8 mx-auto">
	<div class="mb-6">
		<a href="/profile" class="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-400 transition-colors">&larr; Kembali ke Profil</a>
		<h1 class="text-2xl font-bold text-slate-900 dark:text-white mt-2">Edit Profil</h1>
	</div>

	{#if form?.error}
		<div class="mb-4 bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="mb-4 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm">Profil berhasil diperbarui!</div>
	{/if}

	<form method="POST" action="?/updateProfile" enctype="multipart/form-data" use:enhance class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
		<!-- Avatar -->
		<div class="flex items-center gap-4">
			{#if data.profile.avatarUrl}
				<img src={data.profile.avatarUrl} alt="Avatar" class="w-16 h-16 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700">
			{:else}
				<div class="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-2xl font-bold text-slate-900 dark:text-white">{data.profile.username[0].toUpperCase()}</div>
			{/if}
			<div class="grow">
				<label for="avatar" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Ganti Avatar</label>
				<input id="avatar" type="file" name="avatar" accept="image/*" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-900/40 file:text-purple-400">
			</div>
		</div>

		<div>
			<label for="displayName" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Nama Tampilan</label>
			<input id="displayName" name="displayName" value={data.profile.displayName || ''} class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none" placeholder="Nama yang ditampilkan">
		</div>

		<div>
			<label for="bio" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Bio</label>
			<textarea id="bio" name="bio" rows="3" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none" placeholder="Ceritakan tentang dirimu...">{data.profile.bio || ''}</textarea>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="readingMode" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Mode Baca</label>
				<select id="readingMode" name="readingMode" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none">
					<option value="scroll" selected={data.profile.readingMode === 'scroll'}>↕️ Scroll Vertikal</option>
					<option value="page" selected={data.profile.readingMode === 'page'}>←→ Page-by-Page</option>
				</select>
			</div>
			<div>
				<label for="theme" class="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">Tema</label>
				<select id="theme" name="theme" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none appearance-none">
					<option value="dark" selected={data.profile.theme === 'dark'}>🌙 Dark Mode</option>
					<option value="light" selected={data.profile.theme === 'light'}>☀️ Light Mode</option>
				</select>
			</div>
		</div>

		<Button type="submit" class="w-full py-2.5">Simpan Perubahan</Button>
	</form>
</div>
