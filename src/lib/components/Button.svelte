<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		type = 'button',
		variant = 'primary',
		class: className = '',
		onclick,
		disabled = false,
		href,
		children
	}: {
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'danger' | 'success' | 'secondary' | 'ghost';
		class?: string;
		onclick?: (e: MouseEvent) => void;
		disabled?: boolean;
		href?: string;
		children?: Snippet;
	} = $props();

	const baseClasses =
		'font-bold rounded-lg transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 duration-200';

	const variantClasses = {
		primary: 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/30',
		danger: 'bg-red-600 hover:bg-red-500 text-white border border-red-400/30',
		success: 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/30',
		secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600/50',
		ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white shadow-none'
	};

	let combinedClasses = $derived(
		`${baseClasses} px-4 py-2 text-sm ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed active:scale-100' : ''} ${className}`
	);
</script>

{#if href}
	<!-- eslint-disable-next-line -->
	<a {href} class={combinedClasses} {onclick}>
		{#if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button {type} class={combinedClasses} {onclick} {disabled}>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
