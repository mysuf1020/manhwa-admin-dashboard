<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import DeleteForm from '$lib/components/Admin/DeleteForm.svelte';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	let isCreateModalOpen = $state(false);
</script>

<div class="mb-6 flex items-center justify-between">
	<h2 class="text-2xl font-bold text-white">Manage Comics Katalog</h2>
	<Button
		onclick={() => (isCreateModalOpen = true)}
		class="shadow-lg shadow-purple-900/20 px-4 py-2"
	>
		+ Entry Komik Baru
	</Button>
</div>

{#if form?.error}
	<div
		class="bg-red-500/10 border-red-500/50 text-red-400 p-4 rounded-lg mb-6 gap-3 flex items-center border"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
				clip-rule="evenodd"
			/>
		</svg>
		{form.error}
	</div>
{/if}

{#if form?.success}
	<div
		class="bg-emerald-500/10 border-emerald-500/50 text-emerald-400 p-4 rounded-lg mb-6 gap-3 flex items-center border"
	>
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				clip-rule="evenodd"
			/>
		</svg>
		Berhasil Menyimpan Komik Database!
	</div>
{/if}

<div class="bg-slate-900 rounded-xl border-slate-800 shadow-xl overflow-hidden border">
	<table class="text-slate-300 w-full text-left">
		<thead class="bg-slate-950 border-slate-800 text-slate-400 text-sm border-b">
			<tr>
				<th class="p-4 font-medium">Aset Cover</th>
				<th class="p-4 font-medium">Judul & SEO Slug</th>
				<th class="p-4 font-medium">Status/Uploader</th>
				<th class="p-4 font-medium text-right">Manajemen</th>
			</tr>
		</thead>
		<tbody class="divide-slate-800 divide-y">
			{#each data.comics as comic (comic.id)}
				<tr class="hover:bg-slate-800/50 transition-colors">
					<td class="p-4 w-20">
						{#if comic.coverUrl}
							<img
								src={comic.coverUrl}
								alt="Cover"
								class="w-12 h-16 rounded shadow border-slate-700 bg-slate-950 border object-cover"
							/>
						{:else}
							<div
								class="w-12 h-16 bg-slate-800 rounded text-slate-500 border-slate-700 flex items-center justify-center border text-[10px]"
							>
								No Img
							</div>
						{/if}
					</td>
					<td class="p-4">
						<div class="font-bold text-white text-base">{comic.title}</div>
						<div
							class="text-xs text-purple-400 font-mono mt-1 bg-purple-900/20 px-2 py-0.5 rounded border-purple-500/20 w-fit border"
						>
							/{comic.slug}
						</div>
					</td>
					<td class="p-4">
						<div class="flex gap-2 flex-wrap mb-2">
							<span class="px-2 py-1 bg-slate-800 rounded text-xs border-slate-700 font-semibold border text-slate-300">{comic.status}</span>
							<span class="px-2 py-1 bg-purple-900/30 rounded text-xs border-purple-500/20 font-semibold border text-purple-400">{comic.type}</span>
							<form method="POST" action="?/toggleFeatured" use:enhance class="inline">
								<input type="hidden" name="id" value={comic.id}>
								<input type="hidden" name="isFeatured" value={String(comic.isFeatured)}>
								<button type="submit" class="px-2 py-1 rounded text-xs font-semibold border transition-colors {comic.isFeatured ? 'bg-amber-500/20 border-amber-500/30 text-amber-400 hover:bg-amber-500 hover:text-white' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-amber-400 hover:border-amber-500/30'}">
									{comic.isFeatured ? '★ Featured' : '☆ Set Featured'}
								</button>
							</form>
						</div>
						<div class="text-xs text-slate-500 mt-2 gap-1 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-3 w-3"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
								/></svg
							>
							{comic.author || 'Unknown'}
						</div>
					</td>
					<td class="p-4 text-right">
						<div class="gap-2 flex h-full items-center justify-end">
							<!-- eslint-disable-next-line -->
							<Button
								href={`/admin/comics/${comic.slug}`}
								variant="ghost"
								class="bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white px-3 border-indigo-500/30 font-medium border"
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
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/></svg
								>
								Chapters
							</Button>
							<DeleteForm
								action="?/delete"
								id={comic.id}
								confirmMessage={`Yakin ingin HAPUS komik "${comic.title}" secara permanen dari Database?`}
							>
								<Button
									type="submit"
									variant="ghost"
									class="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-3 border-red-500/20 font-medium border"
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
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/></svg
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
						class="p-12 text-center text-slate-500 border-dashed border-2 border-slate-800 m-4 rounded-xl"
					>
						<div class="flex justify-center mb-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-10 w-10 text-slate-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/></svg
							>
						</div>
						Katalog Komik Masih Kosong. Klik "+ Entry Komik Baru" untuk mulai.
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<!-- Modal Form Create Comic -->
{#if isCreateModalOpen}
	<div class="inset-0 bg-black/80 backdrop-blur-sm p-4 fixed z-50 flex items-center justify-center">
		<div
			class="bg-slate-900 border-slate-700 rounded-xl shadow-2xl max-w-xl mt-6 animate-in fade-in zoom-in w-full overflow-hidden border duration-200"
		>
			<div class="p-5 border-slate-800 bg-slate-950/50 flex items-center justify-between border-b">
				<h3 class="text-xl font-bold text-white gap-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-purple-500"
						viewBox="0 0 20 20"
						fill="currentColor"
						><path
							fill-rule="evenodd"
							d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
							clip-rule="evenodd"
						/></svg
					>
					Pendaftaran Komik
				</h3>
				<button
					onclick={() => (isCreateModalOpen = false)}
					aria-label="Close modal"
					class="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors"
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
				action="?/create"
				enctype="multipart/form-data"
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
				<div class="md:grid-cols-2 gap-5 mb-5 grid grid-cols-1">
					<div>
						<label for="title" class="text-sm font-semibold text-slate-300 mb-1.5 block"
							>Judul Manhwa/Manga *</label
						>
						<input
							type="text"
							id="title"
							name="title"
							required
							class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 focus:ring-purple-500 w-full border transition-all focus:ring-1 focus:outline-none"
							placeholder="Contoh: Solo Leveling"
						/>
					</div>
					<div>
						<label for="slug" class="text-sm font-semibold text-slate-300 mb-1.5 block"
							>URL Slug (Wajib Unik) *</label
						>
						<input
							type="text"
							id="slug"
							name="slug"
							required
							class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono focus:border-purple-500 focus:ring-purple-500 text-sm w-full border transition-all focus:ring-1 focus:outline-none"
							placeholder="solo-leveling"
						/>
					</div>
				</div>

				<div class="md:grid-cols-2 gap-5 mb-5 grid grid-cols-1">
					<div>
						<label for="author" class="text-sm font-semibold text-slate-300 mb-1.5 block"
							>Nama Author/Studio</label
						>
						<input
							type="text"
							id="author"
							name="author"
							class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 w-full border transition-all focus:outline-none"
							placeholder="Chugong"
						/>
					</div>
					<div>
						<label for="status" class="text-sm font-semibold text-slate-300 mb-1.5 block"
							>Status Rilisan</label
						>
						<div class="relative">
							<select
								id="status"
								name="status"
								class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 font-medium w-full appearance-none border transition-all focus:outline-none"
							>
								<option value="Ongoing">🟢 Ongoing</option>
								<option value="Completed">🏁 Completed</option>
								<option value="Hiatus">⏸️ Hiatus</option>
							</select>
						</div>
					</div>
				</div>

				<div class="mb-5">
					<label for="cover" class="text-sm font-semibold text-slate-300 mb-1.5 block"
						>Opsi A: Upload Cover Image (Cloudflare R2)</label
					>
					<input
						type="file"
						id="cover"
						name="cover"
						accept="image/png, image/jpeg, image/webp"
						class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-900/40 file:text-purple-400 hover:file:bg-purple-900/60 focus:border-purple-500 w-full border transition-all focus:outline-none"
					/>
				</div>

				<div class="mb-5">
					<label for="coverUrl" class="text-sm font-semibold text-slate-300 mb-1.5 block"
						>Opsi B: Cover Image (URL Eksternal)</label
					>
					<input
						type="url"
						id="coverUrl"
						name="coverUrl"
						class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 font-mono text-sm w-full border transition-all focus:outline-none"
						placeholder="https://i.ibb.co/example.jpg"
					/>
					<p class="text-xs text-slate-500 mt-1.5">
						Isi salah satu saja. Jika file Opsi A diisi, otomatis link Opsi B diabaikan. Maksimal 5MB.
					</p>
				</div>

				<div class="md:grid-cols-2 gap-5 mb-5 grid grid-cols-1">
					<div>
						<label for="type" class="text-sm font-semibold text-slate-300 mb-1.5 block"
							>Tipe Terbitan</label
						>
						<div class="relative">
							<select
								id="type"
								name="type"
								class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 font-medium w-full appearance-none border transition-all focus:outline-none"
							>
								<option value="Manhwa">🔥 Manhwa (Korea)</option>
								<option value="Manga">❤️ Manga (Jepang)</option>
								<option value="Manhua">🐉 Manhua (China)</option>
							</select>
						</div>
					</div>
					<div>
						<label for="genres" class="text-sm font-semibold text-slate-300 mb-1.5 block"
							>Genre (Pipisahkan Koma)</label
						>
						<input
							type="text"
							id="genres"
							name="genres"
							class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 w-full border transition-all focus:outline-none"
							placeholder="Action, Fantasy, Romance"
						/>
					</div>
				</div>

				<div class="mb-6">
					<label for="description" class="text-sm font-semibold text-slate-300 mb-1.5 block"
						>Sinopsis Singkat</label
					>
					<textarea
						id="description"
						name="description"
						rows="3"
						class="bg-slate-950 border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 w-full border transition-all focus:outline-none"
						placeholder="Sepuluh tahun lalu, sebuah gerbang muncul..."
					></textarea>
				</div>

				<div class="gap-3 pt-5 border-slate-800 flex justify-end border-t">
					<Button variant="ghost" onclick={() => (isCreateModalOpen = false)} class="px-5"
						>Batal Kembali</Button
					>
					<Button type="submit" class="px-6 shadow-lg">Simpan ke Database</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
