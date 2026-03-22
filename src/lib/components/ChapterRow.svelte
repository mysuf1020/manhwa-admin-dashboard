<script lang="ts">
	import { base } from '$app/paths';
	let { slug, chapterNumber, title, createdAt, coverUrl } = $props<{
		slug: string;
		chapterNumber: string;
		title: string | null;
		createdAt: Date;
		coverUrl?: string | null;
	}>();

	// Function to calculate relative time (e.g., "1 hari lalu", "2 jam lalu")
	function getRelativeTime(date: Date) {
		const rtf = new Intl.RelativeTimeFormat('id', { numeric: 'auto' });
		const daysDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
		if (Math.abs(daysDifference) > 30) {
			const months = Math.round(daysDifference / 30);
			return rtf.format(months, 'month');
		} else if (Math.abs(daysDifference) > 0) {
			return rtf.format(daysDifference, 'day');
		} else {
			const hoursDifference = Math.round((date.getTime() - new Date().getTime()) / (1000 * 60 * 60));
			if (Math.abs(hoursDifference) > 0) return rtf.format(hoursDifference, 'hour');
			return 'Baru saja';
		}
	}

	const isNew = new Date().getTime() - new Date(createdAt).getTime() < 3 * 24 * 60 * 60 * 1000;
</script>

<a
	href="{base}/comic/{slug}/{chapterNumber}"
	class="group flex items-center bg-[#1a1c23] hover:bg-[#252830] border border-white/5 hover:border-white/10 rounded-lg overflow-hidden transition-all duration-200"
>
	<!-- Thumbnail -->
	<div class="w-24 shrink-0 aspect-video relative bg-black/50 overflow-hidden">
		{#if coverUrl}
			<img src={coverUrl} alt="Chapter {chapterNumber}" class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
		{:else}
			<div class="w-full h-full flex items-center justify-center text-white/20">IMAGE</div>
		{/if}
		<div class="absolute inset-0 bg-linear-to-r from-transparent to-[#1a1c23] group-hover:to-[#252830] transition-colors"></div>
	</div>

	<!-- Info -->
	<div class="p-3 flex flex-col justify-center flex-1 min-w-0">
		<h4 class="text-sm font-bold text-white truncate group-hover:text-purple-400 transition-colors">
			Chapter {chapterNumber} {title ? `- ${title}` : ''}
		</h4>
		<div class="flex items-center gap-2 mt-1">
			<span class="text-xs text-zinc-400">{getRelativeTime(new Date(createdAt))}</span>
			{#if isNew}
				<span class="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">UP</span>
			{/if}
		</div>
	</div>
</a>
