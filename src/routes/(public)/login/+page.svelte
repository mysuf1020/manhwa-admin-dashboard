<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Button from '$lib/components/Button.svelte';

	let { form } = $props<{ form: ActionData }>();
</script>

<svelte:head>
	<title>Masuk - Web Komik Reader</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
		<div class="flex justify-center mb-6">
			<!-- Logo SVG -->
			<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
		</div>
		
		<h1 class="text-3xl font-black text-slate-900 dark:text-white text-center mb-2">Login</h1>
		<p class="text-slate-600 dark:text-slate-400 text-center mb-8 text-sm">Masuk untuk menyimpan riwayat dan komik favorit.</p>

		<form method="POST" use:enhance class="flex flex-col gap-4">
			{#if form?.error}
				<div class="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center font-medium">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="username" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
				<input type="text" id="username" name="username" required autocomplete="username" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium">
			</div>

			<div>
				<label for="password" class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Kata Sandi</label>
				<input type="password" id="password" name="password" required autocomplete="current-password" class="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium">
			</div>

			<Button type="submit" variant="success" class="w-full py-3.5 shadow-lg shadow-emerald-900/20 text-base mt-2">
				Masuk Sekarang
			</Button>
		</form>

		<div class="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
			Belum punya akun? 
			<a href="/register" class="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-colors">Daftar Akun Baru</a>
		</div>
	</div>
</div>
