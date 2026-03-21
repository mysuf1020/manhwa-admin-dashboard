<script lang="ts">
	import { navigating } from '$app/stores';

	let progress = $state(0);
	let visible = $state(false);
	let timeoutId: ReturnType<typeof setTimeout>;
	let intervalId: ReturnType<typeof setInterval>;

	$effect(() => {
		if ($navigating) {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
			visible = true;
			progress = 10;
			
			// Simulate progress
			intervalId = setInterval(() => {
				if (progress < 90) {
					progress += Math.random() * 10;
				}
			}, 300);
		} else {
			clearInterval(intervalId);
			progress = 100;
			timeoutId = setTimeout(() => {
				visible = false;
				setTimeout(() => {
					progress = 0;
				}, 300); // Wait for fade out
			}, 300);
		}
		
		return () => {
			clearTimeout(timeoutId);
			clearInterval(intervalId);
		};
	});
</script>

{#if visible}
	<div class="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none fade-out-transition" style="opacity: {visible ? 1 : 0}; transition: opacity 300ms ease;">
		<div class="h-full bg-purple-500 shadow-[0_0_10px_#a855f7] transition-all duration-300 ease-out" style="width: {progress}%;"></div>
	</div>
{/if}
