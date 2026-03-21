<script lang="ts">
	import { base } from '$app/paths';
	let { slug, chapterNumber, title, createdAt } = $props<{
		slug: string;
		chapterNumber: string;
		title: string | null;
		createdAt: Date;
	}>();
</script>

<!-- eslint-disable-next-line -->
<a
	href="{base}/comic/{slug}/{chapterNumber}"
	class="p-4 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:bg-slate-800 rounded-lg border-slate-200 dark:border-slate-800/50 hover:border-purple-500/50 font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white group flex items-center justify-between border transition-all"
>
	<span>
		Chapter {chapterNumber}
		<span class="ml-2 text-slate-500 font-normal group-hover:text-slate-700 dark:text-slate-300">
			{title ? `- ${title}` : ''}
		</span>
	</span>
	<span
		class="text-xs text-slate-600 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded group-hover:bg-slate-200 dark:bg-slate-700 transition-colors"
	>
		{new Date(createdAt).toLocaleDateString()}
	</span>
</a>
