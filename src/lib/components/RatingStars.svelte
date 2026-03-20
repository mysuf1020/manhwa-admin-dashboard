<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		rating = 0,
		count = 0,
		userRating = null,
		interactive = false
	} = $props<{
		rating?: number;
		count?: number;
		userRating?: number | null;
		interactive?: boolean;
	}>();
</script>

<div class="flex items-center gap-2">
	<div class="flex">
		{#each [1, 2, 3, 4, 5] as star (star)}
			{#if interactive}
				<form action="?/rate" method="POST" use:enhance class="inline">
					<input type="hidden" name="score" value={star} />
					<button
						type="submit"
						class="focus:outline-none transition-transform hover:scale-125"
						aria-label="Rate {star} stars"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-7 w-7 {star <= (userRating || Math.round(rating))
								? 'text-yellow-400'
								: 'text-slate-600'} hover:text-yellow-300 transition-colors drop-shadow-sm"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
							/>
						</svg>
					</button>
				</form>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-7 w-7 {star <= Math.round(rating) ? 'text-yellow-400' : 'text-slate-700'}"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
					/>
				</svg>
			{/if}
		{/each}
	</div>
	{#if count > 0}
		<span class="text-xl font-black text-yellow-500 ml-2"
			>{rating.toFixed(1)} <span class="text-slate-500 font-medium text-sm">({count} User)</span></span
		>
	{:else}
		<span class="text-sm font-medium text-slate-500 ml-2 italic">Belum ada rating</span>
	{/if}
</div>
