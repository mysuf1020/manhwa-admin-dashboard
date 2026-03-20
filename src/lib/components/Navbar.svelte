<script lang="ts">
	import { page } from '$app/stores';
</script>

<header class="bg-slate-900 border-slate-800 top-0 sticky z-50 border-b shadow-md shadow-black/20">
	<div class="max-w-7xl px-4 h-16 mx-auto flex items-center justify-between">
		<a
			href="/"
			class="text-xl font-black from-purple-400 to-emerald-400 bg-linear-to-r bg-clip-text text-transparent"
		>
			MangaReader
		</a>
		<nav class="md:flex gap-6 text-sm font-semibold hidden">
			<a href="/" class="hover:text-purple-400 transition-colors">Semua Rilisan</a>
			{#if $page.data.user}
				<a href="/profile" class="hover:text-purple-400 transition-colors flex items-center gap-1.5">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
					Koleksiku
				</a>
			{/if}
		</nav>
		<div class="gap-2 md:gap-3 flex items-center">
			<form action="/" method="GET" class="hidden md:flex relative items-center">
				<input type="search" name="q" placeholder="Cari judul..." class="bg-slate-950 border border-slate-700 focus:border-purple-500 rounded-full py-1.5 pl-4 pr-10 text-sm text-white focus:outline-none transition-colors w-48 focus:w-64">
				<button type="submit" class="absolute right-2 text-slate-400 hover:text-purple-400" aria-label="Search">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
				</button>
			</form>
			<a href="/" class="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors" aria-label="Search">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
			</a>

			{#if $page.data.user}
				<div class="flex items-center gap-2 pl-2">
					<a href="/profile" class="hidden sm:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-full transition-colors">
						<div class="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
							{$page.data.user.username[0]}
						</div>
						<span class="text-xs font-bold text-slate-200">{$page.data.user.username}</span>
					</a>
                    {#if $page.data.user.role === 'admin'}
                        <a href="/admin" class="hidden md:flex items-center gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 px-3 py-1.5 rounded-full transition-colors text-xs font-bold">
                            Dashboard Admin
                        </a>
                    {/if}
					<form action="/logout" method="POST">
						<button type="submit" class="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors border border-red-500/20 shadow-lg active:scale-95">
							Logout
						</button>
					</form>
				</div>
			{:else}
				<a
					href="/login"
					class="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all shadow-lg active:scale-95 border border-purple-400/20"
				>
					Masuk
				</a>
			{/if}
		</div>
	</div>
</header>
