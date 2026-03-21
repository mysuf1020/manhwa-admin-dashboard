<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let unreadCount = $state(0);
	let showNotifs = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let notifList = $state<any[]>([]);

	let isDark = $state(true);

	onMount(async () => {
		isDark = document.documentElement.classList.contains('dark');
		if ($page.data.user) {
			try {
				const res = await fetch('/api/notifications');
				const data = await res.json();
				unreadCount = data.unread || 0;
				notifList = data.notifications || [];
			} catch { /* silent */ }
		}
	});

	async function markAllRead() {
		await fetch('/api/notifications', { method: 'POST', body: JSON.stringify({ action: 'markAllRead' }), headers: { 'Content-Type': 'application/json' } });
		unreadCount = 0;
		notifList = notifList.map((n) => ({ ...n, isRead: true }));
	}

	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	}
</script>

<header class="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 top-0 shadow-md shadow-black/20 sticky z-50 border-b">
	<div class="max-w-7xl px-4 h-16 mx-auto flex items-center justify-between">
		<a
			href="/"
			class="text-xl font-black from-purple-400 to-emerald-400 bg-linear-to-r bg-clip-text text-transparent"
		>
			MangaReader
		</a>
		<nav class="md:flex gap-6 text-sm font-semibold hidden">
			{#if $page.data.user}
				<a
					href="/profile"
					class="hover:text-purple-400 gap-1.5 flex items-center transition-colors"
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
							d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
						/></svg
					>
					Koleksiku
				</a>
				<a
					href="/following"
					class="hover:text-purple-400 gap-1.5 flex items-center transition-colors"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
					Mengikuti
				</a>
			{/if}
		</nav>
		<div class="gap-2 md:gap-3 flex items-center">
			<form action="/" method="GET" class="md:flex relative hidden items-center">
				<input
					type="search"
					name="q"
					placeholder="Cari judul..."
					class="bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:border-purple-500 py-1.5 pl-4 pr-10 text-sm text-slate-900 dark:text-white w-48 focus:w-64 rounded-full border transition-colors focus:outline-none"
				/>
				<button
					type="submit"
					class="right-2 text-slate-600 dark:text-slate-400 hover:text-purple-400 absolute"
					aria-label="Search"
				>
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
				</button>
			</form>
			<a href="/" class="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Search">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
			</a>

			<!-- Theme Toggle -->
			<button onclick={toggleTheme} class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Toggle Theme">
				{#if isDark}
					<!-- Sun icon -->
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
				{:else}
					<!-- Moon icon -->
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
				{/if}
			</button>

			<!-- Notification Bell -->
			{#if $page.data.user}
				<div class="relative">
					<button onclick={() => { showNotifs = !showNotifs; if (showNotifs && unreadCount > 0) markAllRead(); }} class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative" aria-label="Notifications">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
						{#if unreadCount > 0}
							<span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-slate-900 dark:text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
						{/if}
					</button>
					{#if showNotifs}
						<div class="absolute right-0 top-12 w-72 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
							<div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
								<h4 class="text-sm font-bold text-slate-900 dark:text-white">Notifikasi</h4>
								<button onclick={() => showNotifs = false} class="text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs">Tutup</button>
							</div>
							<div class="max-h-64 overflow-y-auto">
								{#each notifList.slice(0, 10) as notif (notif.id)}
									<div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800/50 last:border-none {notif.isRead ? 'opacity-60' : ''}">
										<p class="text-xs text-slate-700 dark:text-slate-300">{notif.message}</p>
										<span class="text-[10px] text-slate-500">{new Date(notif.createdAt).toLocaleDateString()}</span>
									</div>
								{:else}
									<div class="px-4 py-6 text-center text-xs text-slate-500">Belum ada notifikasi.</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			{#if $page.data.user}
				<div class="gap-2 pl-2 flex items-center">
					<a
						href="/profile"
						class="sm:flex gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 px-3 py-1.5 hidden items-center rounded-full border transition-colors"
					>
						<div
							class="w-6 h-6 bg-purple-600 text-xs font-bold text-slate-900 dark:text-white shadow-sm flex items-center justify-center rounded-full uppercase"
						>
							{$page.data.user.username[0]}
						</div>
						<span class="text-xs font-bold text-slate-800 dark:text-slate-200">{$page.data.user.username}</span>
					</a>
					{#if $page.data.user.role === 'admin'}
						<a
							href="/admin"
							class="md:flex gap-2 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-slate-900 dark:text-white border-emerald-500/20 px-3 py-1.5 text-xs font-bold hidden items-center rounded-full border transition-colors"
						>
							Dashboard Admin
						</a>
					{/if}
					<form action="/logout" method="POST">
						<button
							type="submit"
							class="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-slate-900 dark:text-white px-3 py-2 rounded-lg text-sm font-bold border-red-500/20 shadow-lg border transition-colors active:scale-95"
						>
							Logout
						</button>
					</form>
				</div>
			{:else}
				<a
					href="/login"
					class="bg-purple-600 hover:bg-purple-500 px-5 py-2 rounded-lg text-sm font-bold text-slate-900 dark:text-white shadow-lg border-purple-400/20 border transition-all active:scale-95"
				>
					Masuk
				</a>
			{/if}
		</div>
	</div>
</header>
