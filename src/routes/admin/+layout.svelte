<script lang="ts">
	import '../../app.css';
	import Sidebar from '$lib/components/Admin/Sidebar.svelte';
	import Topbar from '$lib/components/Admin/Topbar.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard - MangaReader</title>
</svelte:head>

<div class="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 flex min-h-screen">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main Content area -->
	<main class="min-w-0 flex grow flex-col">
		<!-- Topbar -->
		<Topbar />

		<!-- Page Content -->
		<div class="p-6 grow overflow-auto">
			{@render children()}
		</div>
	</main>
</div>
