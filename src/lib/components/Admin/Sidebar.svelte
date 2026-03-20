<script lang="ts">
	import { page } from '$app/stores';
	const nav = (p: string) => {
		window.location.href = p;
	};
</script>

<aside class="w-64 bg-slate-900 border-slate-800 flex shrink-0 flex-col border-r">
	<div class="h-16 px-6 border-slate-800 flex items-center border-b">
		<button
			onclick={() => nav('/')}
			class="text-xl font-bold text-white gap-2 flex items-center transition-opacity hover:opacity-80"
		>
			&larr; Back to Web
		</button>
	</div>
	<nav class="py-4 px-3 gap-2 shadow-inner flex grow flex-col">
		<button
			onclick={() => nav('/admin')}
			class="gap-3 px-3 py-2 flex items-center {$page.url.pathname === '/admin'
				? 'bg-purple-600/10 text-purple-400 border-purple-500/20 border'
				: 'hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
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
				: 'hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
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
				: 'hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent'} rounded-lg font-medium w-full text-left transition-colors"
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
	</nav>
</aside>
