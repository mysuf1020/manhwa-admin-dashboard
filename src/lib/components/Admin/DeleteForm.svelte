<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Snippet } from 'svelte';

	let {
		action,
		id,
		children,
		class: className = '',
		confirmMessage
	}: {
		action: string;
		id: number | string;
		children: Snippet;
		class?: string;
		confirmMessage?: string;
	} = $props();
</script>

<form
	method="POST"
	{action}
	use:enhance={({ cancel }) => {
		if (confirmMessage && !confirm(confirmMessage)) cancel();
	}}
	class={className}
>
	<input type="hidden" name="id" value={id} />
	{@render children()}
</form>
