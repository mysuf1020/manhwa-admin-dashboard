<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let unreadCount = $state(0);
	let showNotifs = $state(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let notifList = $state<any[]>([]);

	let isDark = $state(false);
	let showMobileMenu = $state(false);

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

	const navLinks = [
		{ href: '/ranking', label: 'Ranking', icon: '🏆' },
		{ href: '/schedule', label: 'Jadwal', icon: '📅' },
		{ href: '/search', label: 'Pencarian', icon: '🔍' }
	];
</script>

<header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
	<div class="max-w-7xl px-4 h-16 mx-auto flex items-center justify-between gap-4">
		<!-- Brand -->
		<a href="/" class="text-xl font-black bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent shrink-0">
			MangaReader
		</a>

		<!-- Desktop Nav Links -->
		<nav class="hidden md:flex items-center gap-1">
			{#each navLinks as link (link.href)}
				<a
					href={link.href}
					class="px-3 py-2 rounded-lg text-sm font-semibold transition-colors {$page.url.pathname === link.href ? 'text-purple-500 bg-purple-500/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}"
				>
					{link.label}
				</a>
			{/each}
			{#if $page.data.user}
				<a href="/profile" class="px-3 py-2 rounded-lg text-sm font-semibold transition-colors {$page.url.pathname === '/profile' ? 'text-purple-500 bg-purple-500/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}">
					Koleksiku
				</a>
				<a href="/following" class="px-3 py-2 rounded-lg text-sm font-semibold transition-colors {$page.url.pathname === '/following' ? 'text-purple-500 bg-purple-500/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}">
					Mengikuti
				</a>
			{/if}
		</nav>

		<!-- Right Side Actions -->
		<div class="flex items-center gap-1.5 md:gap-2">
			<!-- Search (Desktop) -->
			<form action="/" method="GET" class="hidden lg:flex relative items-center">
				<input
					type="search"
					name="q"
					placeholder="Cari judul..."
					class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-purple-500 py-2 pl-4 pr-10 text-sm text-slate-900 dark:text-white w-44 focus:w-60 rounded-xl transition-all focus:outline-none focus:ring-1 focus:ring-purple-500"
				/>
				<button type="submit" class="absolute right-3 text-slate-400 hover:text-purple-400" aria-label="Search">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
				</button>
			</form>

			<!-- Search (Mobile) -->
			<a href="/search" class="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Search">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
			</a>

			<!-- Theme Toggle -->
			<button onclick={toggleTheme} class="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Toggle Theme">
				{#if isDark}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
				{/if}
			</button>

			<!-- Notification Bell (for logged-in users only) -->
			{#if $page.data.user}
				<div class="relative">
					<button onclick={() => { showNotifs = !showNotifs; if (showNotifs && unreadCount > 0) markAllRead(); }} class="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative" aria-label="Notifications">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
						{#if unreadCount > 0}
							<span class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
						{/if}
					</button>
					{#if showNotifs}
						<div class="absolute right-0 top-12 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
							<div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
								<h4 class="text-sm font-bold text-slate-900 dark:text-white">Notifikasi</h4>
								<button onclick={() => showNotifs = false} class="text-slate-400 hover:text-red-400 text-xs font-bold">Tutup</button>
							</div>
							<div class="max-h-64 overflow-y-auto">
								{#each notifList.slice(0, 10) as notif (notif.id)}
									<div class="px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-none {notif.isRead ? 'opacity-50' : ''}">
										<p class="text-xs text-slate-700 dark:text-slate-300">{notif.message}</p>
										<span class="text-[10px] text-slate-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
									</div>
								{:else}
									<div class="px-4 py-6 text-center text-xs text-slate-400">Belum ada notifikasi.</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}

			<!-- User Area -->
			{#if $page.data.user}
				<div class="hidden sm:flex items-center gap-2 pl-1">
					<a
						href="/profile"
						class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl transition-colors"
					>
						<div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-bold text-white flex items-center justify-center rounded-lg uppercase">
							{$page.data.user.username[0]}
						</div>
						<span class="text-xs font-bold text-slate-700 dark:text-slate-300">{$page.data.user.username}</span>
					</a>
					{#if $page.data.user.role === 'admin'}
						<a
							href="/admin"
							class="hidden md:flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 px-3 py-1.5 text-xs font-bold rounded-xl transition-colors"
						>
							Dashboard
						</a>
					{/if}
					<form action="/logout" method="POST">
						<button
							type="submit"
							class="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/20 transition-colors active:scale-95"
						>
							Logout
						</button>
					</form>
				</div>
			{:else}
				<a
					href="/login"
					class="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg shadow-purple-600/20 border border-purple-500/30 transition-all active:scale-95"
				>
					Masuk
				</a>
			{/if}

			<!-- Mobile Hamburger -->
			<button onclick={() => showMobileMenu = !showMobileMenu} class="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Menu">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if showMobileMenu}
		<div class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-1">
			{#each navLinks as link (link.href)}
				<a href={link.href} onclick={() => showMobileMenu = false} class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors {$page.url.pathname === link.href ? 'text-purple-500 bg-purple-500/10' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}">
					<span>{link.icon}</span> {link.label}
				</a>
			{/each}
			{#if $page.data.user}
				<a href="/profile" onclick={() => showMobileMenu = false} class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
					📚 Koleksiku
				</a>
				<a href="/following" onclick={() => showMobileMenu = false} class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
					👥 Mengikuti
				</a>
				<div class="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
					<a href="/profile" class="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">
						<div class="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 text-xs font-bold text-white flex items-center justify-center rounded-lg uppercase">{$page.data.user.username[0]}</div>
						<span class="text-xs font-bold text-slate-700 dark:text-slate-300">{$page.data.user.username}</span>
					</a>
					<form action="/logout" method="POST">
						<button type="submit" class="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-3 py-2 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">Logout</button>
					</form>
				</div>
			{/if}
		</div>
	{/if}
</header>
