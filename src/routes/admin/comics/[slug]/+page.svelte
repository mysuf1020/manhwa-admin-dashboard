<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import DeleteForm from '$lib/components/Admin/DeleteForm.svelte';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	let isCreateModalOpen = $state(false);
</script>

<div class="mb-6 gap-4 flex flex-col">
	<!-- eslint-disable-next-line -->
	<Button
		href="/admin/comics"
		variant="ghost"
		class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 hover:text-indigo-400 px-4 w-fit rounded-full border"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-4 w-4"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 19l-7-7m0 0l7-7m-7 7h18"
			/></svg
		>
		Kembali ke Daftar Komik
	</Button>
	<h2 class="text-3xl font-bold text-slate-900 dark:text-white gap-3 flex items-center">
		<span class="text-indigo-500">Chapters</span>
		<span class="text-slate-600 font-light">/</span>
		{data.comic.title}
		<a href="/admin/comics/{data.comic.slug}/edit" class="ml-auto text-xs text-slate-600 dark:text-slate-400 hover:text-purple-400 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
			<svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
			Edit Komik
		</a>
	</h2>
</div>

<div
	class="mb-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between border"
>
	<div class="text-slate-600 dark:text-slate-400 text-sm gap-3 flex items-center">
		{#if data.comic.coverUrl}
			<img src={data.comic.coverUrl} alt="Cover" class="w-10 h-14 rounded shadow object-cover" />
		{/if}
		<div>
			Total Rilisan: <strong class="text-slate-900 dark:text-white text-lg">{data.chapters.length}</strong> Bab
		</div>
	</div>
	<Button
		onclick={() => (isCreateModalOpen = true)}
		class="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-900/30 border-indigo-400/30 font-bold px-5"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="3"
				d="M12 4v16m8-8H4"
			/></svg
		>
		Chapter Baru
	</Button>
</div>

{#if form?.error}
	<div
		class="bg-red-500/10 border-red-500/50 text-red-400 p-4 rounded-lg mb-6 gap-3 flex items-center border"
	>
		{form.error}
	</div>
{/if}

<div class="bg-slate-50 dark:bg-slate-900 rounded-xl border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden border">
	<table class="text-slate-700 dark:text-slate-300 w-full text-left">
		<thead class="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm border-b">
			<tr>
				<th class="p-4 font-medium w-32">Nomor</th>
				<th class="p-4 font-medium">Judul Sub-Bab (Opsional)</th>
				<th class="p-4 font-medium">Tanggal Dibuat</th>
				<th class="p-4 font-medium text-right">Database Gambar</th>
			</tr>
		</thead>
		<tbody class="divide-slate-800 divide-y">
			{#each data.chapters as chapter (chapter.id)}
				<tr class="hover:bg-slate-100 dark:bg-slate-800/50 transition-colors">
					<td class="p-4 font-black text-slate-900 dark:text-white text-lg">Ch. {chapter.chapterNumber}</td>
					<td class="p-4">
						{#if chapter.title}
							{chapter.title}
						{:else}
							<span class="text-slate-600 italic">Tanpa Judul Spesifik</span>
						{/if}
					</td>
					<td
						class="p-4 text-sm text-slate-600 dark:text-slate-400 font-mono bg-white dark:bg-slate-950/30 rounded mt-3 mb-3 ml-4 inline-block"
						>{new Date(chapter.createdAt).toLocaleString()}</td
					>
					<td class="p-4 text-right">
						<div class="gap-2 flex h-full items-center justify-end">
							<!-- eslint-disable-next-line -->
							<Button
								href={`/admin/chapters/${chapter.id}`}
								variant="ghost"
								class="bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600 hover:text-slate-900 dark:text-white px-4 border-emerald-500/30 border"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
									/></svg
								>
								Sisipkan Panel Gambar
							</Button>
							<DeleteForm
								action="?/deleteChapter"
								id={chapter.id}
								confirmMessage={`Peringatan: Hapus Chapter ${chapter.chapterNumber}? Anda MAJU MUNDUR menghapus semua gambar di dalamnya secara paksa!`}
							>
								<Button
									type="submit"
									variant="ghost"
									class="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-slate-900 dark:text-white px-3 border-red-500/20 font-medium border"
								>
									Hapus
								</Button>
							</DeleteForm>
						</div>
					</td>
				</tr>
			{:else}
				<tr>
					<td
						colspan="4"
						class="p-16 text-center text-slate-500 border-dashed border border-slate-200 dark:border-slate-800 m-8 rounded-xl bg-white dark:bg-slate-950/50"
					>
						<div class="flex justify-center mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-10 w-10 text-slate-700"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/></svg
							>
						</div>
						<h4 class="text-slate-900 dark:text-white font-medium mb-1">Belum Ada Satu Rilisan Pun</h4>
						<p class="text-sm">
							Klik tombol "Chapter Baru" di sudut kanan atas untuk mengunggah rilis perdana.
						</p>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Modal Create Chapter -->
{#if isCreateModalOpen}
	<div class="inset-0 bg-black/80 backdrop-blur-sm p-4 fixed z-50 flex items-center justify-center">
		<div
			class="bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl max-w-md animate-in fade-in zoom-in w-full overflow-hidden border duration-200"
		>
			<div class="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 flex items-center justify-between border-b">
				<h3 class="text-xl font-bold text-slate-900 dark:text-white gap-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-indigo-500"
						viewBox="0 0 20 20"
						fill="currentColor"
						><path
							fill-rule="evenodd"
							d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							clip-rule="evenodd"
						/></svg
					>
					Rilis Chapter Terkini
				</h3>
				<button
					onclick={() => (isCreateModalOpen = false)}
					aria-label="Close modal"
					class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-1.5 rounded-lg transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			</div>

			<form
				method="POST"
				action="?/createChapter"
				use:enhance={() => {
					return async ({ update, result }) => {
						await update();
						if (result.type === 'success') {
							isCreateModalOpen = false;
						}
					};
				}}
				class="p-6"
			>
				<!-- Hidden Comic ID -->
				<input type="hidden" name="comicId" value={data.comic.id} />

				<div class="mb-5">
					<label for="chapterNumber" class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block"
						>Deret Nomor Chapter *</label
					>
					<input
						type="text"
						id="chapterNumber"
						name="chapterNumber"
						required
						class="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white font-mono focus:border-indigo-500 focus:ring-indigo-500 w-full border transition-all focus:ring-1 focus:outline-none"
						placeholder="misal: 1, 10, atau 12.5"
					/>
				</div>

				<div class="mb-6">
					<label for="title" class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block"
						>Judul Spesifik Bab (Opsional)</label
					>
					<input
						type="text"
						id="title"
						name="title"
						class="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:border-indigo-500 w-full border transition-all focus:outline-none"
						placeholder="Penyerbuan di Sarang Semut"
					/>
				</div>

				<div class="gap-3 pt-5 border-slate-200 dark:border-slate-800 flex justify-end border-t">
					<Button variant="ghost" onclick={() => (isCreateModalOpen = false)} class="px-5"
						>Batal</Button
					>
					<Button
						type="submit"
						class="bg-indigo-600 hover:bg-indigo-500 px-6 shadow-lg border-indigo-400/30"
					>
						Simpan Chapter
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
