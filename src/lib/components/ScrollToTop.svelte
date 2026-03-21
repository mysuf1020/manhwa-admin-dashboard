<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let visible = $state(false);

	function handleScroll() {
		visible = window.scrollY > 600;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => window.addEventListener('scroll', handleScroll));
	onDestroy(() => {
		if (typeof window !== 'undefined') window.removeEventListener('scroll', handleScroll);
	});
</script>

{#if visible}
	<button
		onclick={scrollToTop}
		class="fixed bottom-6 left-6 z-9990 w-11 h-11 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white shadow-xl shadow-purple-900/40 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-purple-400/20 backdrop-blur-sm"
		aria-label="Scroll to top"
	>
		<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
		</svg>
	</button>
{/if}
