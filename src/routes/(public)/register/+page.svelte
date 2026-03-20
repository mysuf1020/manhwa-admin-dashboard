<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import Button from '$lib/components/Button.svelte';

	let { form } = $props<{ form: ActionData }>();
</script>

<svelte:head>
	<title>Register - Web Komik Reader</title>
</svelte:head>

<div class="min-h-[70vh] flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
		<div class="flex justify-center mb-6">
			<!-- Logo SVG -->
			<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
		</div>

		<h1 class="text-3xl font-black text-white text-center mb-2">Buat Akun</h1>
		<p class="text-slate-400 text-center mb-8 text-sm">Masuk barisan pembaca premium gratis.</p>

		<form method="POST" use:enhance class="flex flex-col gap-4">
			{#if form?.error}
				<div class="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center font-medium">
					{form.error}
				</div>
			{/if}

			<div>
				<label for="username" class="block text-sm font-semibold text-slate-300 mb-1.5">Username Rekomendasi (Unik)</label>
				<input type="text" id="username" name="username" required minlength="3" autocomplete="username" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium">
			</div>

			<div>
				<label for="password" class="block text-sm font-semibold text-slate-300 mb-1.5">Kata Sandi Rahasia</label>
				<input type="password" id="password" name="password" required minlength="6" autocomplete="new-password" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium">
			</div>

            <div>
				<label for="confirmPassword" class="block text-sm font-semibold text-slate-300 mb-1.5">Ketik Ulang Sandi</label>
				<input type="password" id="confirmPassword" name="confirmPassword" required minlength="6" autocomplete="new-password" class="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium">
			</div>

			<Button type="submit" class="w-full py-3.5 shadow-lg shadow-purple-900/20 text-base mt-2">
				Daftar & Langsung Masuk
			</Button>
		</form>

		<div class="mt-8 text-center text-sm text-slate-400">
			Pernah bikin akun? 
			<a href="/login" class="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors">Login Disini!</a>
		</div>
	</div>
</div>
