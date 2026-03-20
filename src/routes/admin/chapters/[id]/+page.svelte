<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import PageCard from '$lib/components/Admin/PageCard.svelte';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
</script>

<div class="mb-6 gap-4 flex flex-col">
	<!-- eslint-disable-next-line -->
	<Button
		href={`/admin/comics/${data.comic.slug}`}
		variant="ghost"
		class="bg-slate-900 border-slate-800 shadow-sm text-slate-400 hover:text-emerald-400 px-4 w-fit rounded-full border"
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
		Kembali ke Daftar Chapter
	</Button>
	<h2 class="text-3xl font-bold text-white gap-3 flex items-center">
		<span class="text-emerald-500">Inject Halaman Baca</span>
		<span class="text-slate-600 font-light">/</span>
		Ch. {data.chapter.chapterNumber}
	</h2>
</div>

<div class="md:grid-cols-4 gap-6 grid grid-cols-1">
	<!-- Kolom Kiri: Form Add Bulk -->
	<div class="md:col-span-1">
		<div class="bg-slate-900 rounded-xl border-slate-800 p-6 shadow-xl top-6 sticky border">
			<h3 class="text-lg font-bold text-white mb-4 gap-2 flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-emerald-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
					/></svg
				>
				Bulk Injector URL
			</h3>

			<p class="text-sm text-slate-400 mb-4 leading-relaxed">
				Salin barisan URL link gambar dari Cloudflare R2 secara sekuensial. Pisahkan tiap aset
				gambar ke bawah (Enter).
			</p>

			<form method="POST" action="?/addPages" use:enhance>
				<textarea
					name="urls"
					rows="12"
					required
					class="bg-slate-950 border-slate-700 rounded-lg p-3 text-slate-300 text-xs font-mono focus:border-emerald-500 focus:ring-emerald-500 mb-4 w-full border transition-all focus:ring-1 focus:outline-none"
					placeholder="https://image1.jpg&#10;https://image2.jpg&#10;https://image3.jpg"
				></textarea>

				<Button type="submit" variant="success" class="py-3 shadow-lg shadow-emerald-900/40 w-full">
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
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/></svg
					>
					Tembak URL ke Database
				</Button>
			</form>

			{#if form?.error}
				<div
					class="mt-5 bg-red-500/10 border-red-500/50 text-red-400 p-3 rounded-lg text-sm gap-2 flex items-center border"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 shrink-0"
						viewBox="0 0 20 20"
						fill="currentColor"
						><path
							fill-rule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/></svg
					>
					{form.error}
				</div>
			{/if}

			{#if form?.success}
				<div
					class="mt-5 bg-emerald-500/10 border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm gap-2 flex items-center border"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 shrink-0"
						viewBox="0 0 20 20"
						fill="currentColor"
						><path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/></svg
					>
					Instalasi Selesai! {form.count} aset disisipkan.
				</div>
			{/if}
		</div>
	</div>

	<!-- Kolom Kanan: Live Preview Grid -->
	<div class="md:col-span-3">
		<div class="bg-slate-900 border-slate-800 rounded-xl p-6 shadow-xl mb-6 border">
			<div class="mb-6 flex items-center justify-between">
				<div>
					<h3 class="text-lg font-bold text-white">Pratinjau Urutan Halaman Asli</h3>
					<p class="text-sm text-slate-400">Dimuat secara realtime: {data.pages.length} Halaman.</p>
				</div>
				{#if data.pages.length > 0}
					<form
						method="POST"
						action="?/deleteAllPages"
						use:enhance={({ cancel }) => {
							if (
								!confirm(
									'BAHAYA: Seluruh gambar di panel ini akan dicabut paksa eksistensinya! Hancurkan?'
								)
							)
								cancel();
						}}
					>
						<Button
							type="submit"
							variant="ghost"
							class="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20 border"
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
							Kosongkan Area
						</Button>
					</form>
				{/if}
			</div>

			{#if data.pages.length === 0}
				<div
					class="p-16 border-slate-700 rounded-xl bg-slate-950/50 border border-dashed text-center"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-12 w-12 text-slate-700 mb-4 mx-auto"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
						/></svg
					>
					<p class="text-slate-400 font-medium">Bilik ini 100% steril hampa gambar.</p>
				</div>
			{:else}
				<div class="sm:grid-cols-3 lg:grid-cols-5 gap-4 grid grid-cols-2">
					{#each data.pages as page}
						<PageCard {page} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
