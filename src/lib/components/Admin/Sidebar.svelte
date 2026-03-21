<script lang="ts">
	import { page } from '$app/stores';
	const nav = (p: string) => {
		window.location.href = p;
	};
</script>

<aside class="w-64 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex shrink-0 flex-col border-r">
	<div class="h-16 px-6 border-slate-200 dark:border-slate-800 flex items-center border-b">
		<button
			onclick={() => nav('/')}
			class="text-xl font-bold text-slate-900 dark:text-white gap-2 flex items-center transition-opacity hover:opacity-80"
		>
			&larr; Back to Web
		</button>
	</div>
	<nav class="py-4 px-3 gap-2 shadow-inner flex grow flex-col">
		<button
			onclick={() => nav('/admin')}
			class="gap-3 px-3 py-2 flex items-center {$page.url.pathname === '/admin'
				? 'bg-purple-600/10 text-purple-400 border-purple-500/20 border'
				: 'hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"
				></rect><rect x="14" y="12" width="7" height="9"></rect><rect
					x="3"
					y="16"
					width="7"
					height="5"
				></rect></svg
			>
			Dashboard
		</button>
		<button
			onclick={() => nav('/admin/comics')}
			class="gap-3 px-3 py-2 flex items-center {$page.url.pathname.includes('/admin/comics')
				? 'bg-purple-600/10 text-purple-400 border-purple-500/20 border'
				: 'hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg
			>
			Manage Comics
		</button>
		<button
			onclick={() => nav('/admin/chapters')}
			class="gap-3 px-3 py-2 flex items-center {$page.url.pathname.includes('/admin/chapters')
				? 'bg-purple-600/10 text-purple-400 border-purple-500/20 border'
				: 'hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><path
					d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2-2.4-3.5-4.4-3.5h-1.2c-.7-3-3.2-5.2-6.2-5.6-3-.3-5.9 1.3-7.3 4-1.2 2.5-1 6.5.5 8.8m8.7-1.6V21"
				/><path d="M16 16l-4-4-4 4" /></svg
			>
			Upload Chapters
		</button>
		<button
			onclick={() => nav('/admin/announcements')}
			class="gap-3 px-3 py-2 flex items-center {$page.url.pathname.includes('/admin/announcements')
				? 'bg-purple-600/10 text-purple-400 border-purple-500/20 border'
				: 'hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
			Pengumuman
		</button>
		<button
			onclick={() => nav('/admin/users')}
			class="gap-3 px-3 py-2 flex items-center {$page.url.pathname.includes('/admin/users')
				? 'bg-purple-600/10 text-purple-400 border-purple-500/20 border'
				: 'hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
			Kelola User
		</button>
		<button
			onclick={() => nav('/admin/reports')}
			class="gap-3 px-3 py-2 flex items-center {$page.url.pathname.includes('/admin/reports')
				? 'bg-purple-600/10 text-purple-400 border-purple-500/20 border'
				: 'hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
			Laporan
		</button>
	</nav>
</aside>
