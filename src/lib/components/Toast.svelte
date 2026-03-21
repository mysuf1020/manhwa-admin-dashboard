<script lang="ts">
	import { onMount } from 'svelte';

	interface ToastItem {
		id: number;
		message: string;
		type: 'success' | 'error' | 'info';
	}

	let toasts = $state<ToastItem[]>([]);
	let nextId = 0;

	function addToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
		const id = nextId++;
		toasts = [...toasts, { id, message, type }];
		setTimeout(() => {
			toasts = toasts.filter((t) => t.id !== id);
		}, 3500);
	}

	function removeToast(id: number) {
		toasts = toasts.filter((t) => t.id !== id);
	}

	// Expose globally for easy usage anywhere
	onMount(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).__toast = addToast;
	});
</script>

{#if toasts.length > 0}
	<div class="fixed bottom-6 right-6 z-9998 flex flex-col gap-2 max-w-sm">
		{#each toasts as toast (toast.id)}
			<button
				onclick={() => removeToast(toast.id)}
				class="px-4 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-2.5 animate-slide-in cursor-pointer border transition-all hover:scale-[1.02]
				{toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30 shadow-emerald-900/30' : ''}
				{toast.type === 'error' ? 'bg-red-950/90 text-red-300 border-red-500/30 shadow-red-900/30' : ''}
				{toast.type === 'info' ? 'bg-blue-950/90 text-blue-300 border-blue-500/30 shadow-blue-900/30' : ''}"
			>
				{#if toast.type === 'success'}
					<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
				{:else if toast.type === 'error'}
					<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
				{:else}
					<svg class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
				{/if}
				{toast.message}
			</button>
		{/each}
	</div>
{/if}

<style>
	@keyframes slideIn {
		from { transform: translateX(100%); opacity: 0; }
		to { transform: translateX(0); opacity: 1; }
	}
	:global(.animate-slide-in) {
		animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
</style>
